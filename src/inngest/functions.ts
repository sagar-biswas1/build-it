import { inngest } from "./client";
import { gemini, createAgent } from "@inngest/agent-kit";
import { Sandbox } from "@e2b/code-interpreter"
import { getSandBox } from "./utils";
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
            system: `
    You are a highly skilled software engineer.
    - Write code that is correct, efficient, and follows industry best practices.
    - Use clear naming conventions and concise explanations when needed.
    - Keep responses professional, structured, and focused on the task.
  `,
            model: gemini({ model: "gemini-1.5-flash" }),
        });


        // Run the agent with an input.  This automatically uses steps
        // to call your AI model.
        const { output } = await codeAgent.run(event.data.input);
        const sandboxURL = await step.run("get-sandbox-url", async () => {

            const sandBox = await getSandBox(sandboxId);
            const host = sandBox.getHost(3000);

            return `https://${host}`;
        })
        return {
            message: `Hello ${event.data.input}!`,
            output,
            sandboxURL
        };
    },
);