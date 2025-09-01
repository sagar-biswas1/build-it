import { Inngest } from "inngest";

interface InngestConfig {
    id: string;
}

const config: InngestConfig = {
    id: process.env.INNGEST_ID || "vive-dev", // Use environment variable if available
};

// Create a client to send and receive events
export const inngest = new Inngest(config);