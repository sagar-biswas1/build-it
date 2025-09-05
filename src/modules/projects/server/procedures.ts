
import { inngest } from "@/inngest/client"
import { prisma } from "@/lib/db"
import { baseProcedure, createTRPCRouter } from "@/trpc/init"
import { z } from "zod"
import { generateSlug } from "random-word-slugs"

export const projectRouter = createTRPCRouter({
    getMany: baseProcedure.query(async () => {

        const messages = await prisma.message.findMany({
            orderBy: {
                updatedAt: "asc"
            }
        })
        return messages
    }),
    create: baseProcedure
        .input(z.object({
            value: z.string().min(1, { message: "value cannot be empty" }).max(10000, { message: "Value is too long" })
        }))
        .mutation(async ({ input }) => {
            const createdProject = await prisma.project.create({
                data: {
                    name: generateSlug(2, {
                        format: "kebab"
                    }),
                    messages: {
                        create: {
                            content: input.value,
                            role: "USER",
                            type: "RESULT"
                        }
                    }
                }
            })

            await inngest.send({
                name: "agent/code-app", data: {
                    input: input.value,

                    projectid: createdProject?.id

                }
            })

            return createdProject
        })

})