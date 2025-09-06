
import { inngest } from "@/inngest/client"
import { prisma } from "@/lib/db"
import { baseProcedure, createTRPCRouter } from "@/trpc/init"
import { z } from "zod"


export const messagesRouter = createTRPCRouter({
    getMany: baseProcedure
        .input(z.object({
            projectId: z.string().min(1, { message: "projectId cannot be empty" }).max(100, { message: "Value is too long" })
        }))
        .query(async ({ input }) => {

            const messages = await prisma.message.findMany({
                where: {
                    projectId: input.projectId
                },
                include: {
                    fragment: true
                },
                orderBy: {
                    updatedAt: "asc"
                }
            })
            return messages
        }),
    create: baseProcedure
        .input(z.object({
            value: z.string().min(1, { message: "Message cannot be empty" }).max(10000, { message: "Message cannot be empty" }),
            projectId: z.string().min(1, {
                message: "projectId is required"
            })
        }))
        .mutation(async ({ input }) => {
            const createdMessage = prisma.message.create({
                data: {
                    content: input.value,
                    role: "USER",
                    type: "RESULT",
                    projectId: input.projectId
                }
            })

            await inngest.send({
                name: "agent/code-app", data: {
                    input: input.value,
                    projectId: input.projectId
                }
            })

            return createdMessage
        })

})