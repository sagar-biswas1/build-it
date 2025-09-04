import { inngest } from "./client";
import { gemini, createAgent, createTool, AnyZodType, createNetwork, openai } from "@inngest/agent-kit";
import { Sandbox } from "@e2b/code-interpreter"
import { getSandBox, lastAssistantTextMessageContent } from "./utils";
// import { z } from 'zod';
import { NEXTJS_DEV_PROMPT } from "./prompts/nextjsDevPrompt";
import { z } from "zod";
export const helloWorld = inngest.createFunction(
    { id: "hello-world" },
    { event: "test/hello.world" },
    async ({ event, step }) => {

        const sandboxId = await step.run("get-sandbox-id", async () => {
            const sandbox = await Sandbox.create("vibe-next-test-v2");
            return sandbox.sandboxId;
        })
        const codeAgent = createAgent({
            name: "code-agent",
            description: "An expert programming assistant that writes clean, professional, and maintainable code.",
            system: NEXTJS_DEV_PROMPT,
            model: openai({
                model: "gpt-4o",
                defaultParameters: { temperature: 0.5 },
            }),

            // model: gemini({
            //     model: "gemini-1.5-flash",

            // }),
            tools: [
                createTool({
                    name: "terminal",
                    description: "A terminal in a linux environment. Use this to run commands, install packages, and interact with the filesystem.",
                    parameters: z.object({
                        command: z.string()
                    }),
                    handler: async ({ command }, { step }) => {
                        return await step?.run('terminal', async () => {
                            const buffers = {
                                stdout: "",
                                stderr: ""
                            }

                            try {
                                const sandBox = await getSandBox(sandboxId);
                                const result = await sandBox.commands?.run(command, {
                                    onStdout: (data: string) => {
                                        buffers.stdout += data;
                                    },
                                    onStderr: (data: string) => {
                                        buffers.stderr += data;
                                    }
                                })
                                return result.stdout
                            } catch (e) {
                                const err = "command failed: " + e + `\nstderr:` + buffers.stderr + `\nstdout:` + buffers.stdout
                                console.error(err);
                                return err
                            }
                        })
                    }
                }),

                createTool({
                    name: "createOrUpdateFiles",
                    description: "Create or update files in the code interpreter sandbox.",
                    parameters: z.object({
                        files: z.array(z.object({
                            path: z.string(),
                            content: z.string()
                        }))
                    }),
                    handler: async ({ files }, { step, network }) => {

                        const newFiles = await step?.run("createOrUpdateFiles", async () => {

                            try {
                                const updateFiles = network.state.data?.files || {}

                                const sandBox = await getSandBox(sandboxId);
                                for (const file of files) {
                                    await sandBox.files.write(
                                        file.path,
                                        file.content
                                    )
                                    updateFiles[file.path] = file.content
                                }
                                return updateFiles
                            } catch (e) {
                                return "Error :" + e
                            }


                        })

                        if (typeof newFiles === "object") {
                            network.state.data.files = newFiles
                        }


                    }
                }),

                createTool({
                    name: "readFiles",
                    description: "Read files from the code interpreter sandbox.",
                    parameters: z.object({
                        files: z.array(z.string())
                    }),
                    handler: async ({ files }, { step, network }) => {
                        return await step?.run("readFiles", async () => {
                            try {
                                const sandBox = await getSandBox(sandboxId);
                                const contents = []
                                for (const file of files) {

                                    const content = await sandBox.files.read(file);
                                    contents.push({ path: file, content })

                                }
                                return JSON.stringify(contents);
                            } catch (e) {
                                return "Error :" + e
                            }
                        })

                    }
                })

            ],
            lifecycle: {
                onResponse: async ({ result, network }) => {
                    const lastAssistantTextMessage = lastAssistantTextMessageContent(result)
                    if (lastAssistantTextMessage && network) {
                        if (lastAssistantTextMessage.includes("<task_summary>")) {
                            network.state.data.summary = lastAssistantTextMessage
                        }
                    }
                    return result
                }
            }
        });


        const network = createNetwork({
            name: "coding-agent-network",
            agents: [codeAgent],
            maxIter: 15,
            router: async ({ network }) => {
                const summary = network.state.data?.summary || ""
                if (summary) {
                    return
                }
                return codeAgent
            }
        })
        // Run the agent with an input.  This automatically uses steps
        // to call your AI model.
        // const { output } = await codeAgent.run(event.data.input);

        const result = await network.run(event.data.input,)
        const sandboxURL = await step.run("get-sandbox-url", async () => {

            const sandBox = await getSandBox(sandboxId);
            const host = sandBox.getHost(3000);

            return `https://${host}`;
        })
        return {
            userInput: `Hello ${event.data.input}!`,
            title: "Fragment",
            sandboxURL,
            files: result.state.data?.files || {},
            summary: result.state.data?.summary || "No summary found"
        };
    },
);

