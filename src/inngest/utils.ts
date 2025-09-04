import Sandbox from "@e2b/code-interpreter";
import { AgentResult, TextMessage } from "@inngest/agent-kit";

export const getSandBox = async (sandboxId: string) => {
    const sandbox = await Sandbox.connect(sandboxId);

    return sandbox
}

export const lastAssistantTextMessageContent = (result: AgentResult) => {
    const lastAssistantTestMessageIndex = result.output.findLastIndex(
        (msg) => msg.role === "assistant")
    const message = result.output[lastAssistantTestMessageIndex] as | TextMessage | undefined

    return message?.content ? typeof message?.content === 'string' ? message.content : message?.content?.map(c => c.text).join("") : undefined

}