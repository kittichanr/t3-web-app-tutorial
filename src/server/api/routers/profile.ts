import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "y/server/api/trpc";
import { filterUserForClient } from "y/server/helpers/filterUserForClient";
import { z } from "zod";

export const profileRouter = createTRPCRouter({
    getUserByUserName: publicProcedure
        .input(z.object({ username: z.string() }))
        .query(async ({ ctx, input }) => {
            const [user] = await clerkClient.users.getUserList({
                username: [input.username]
            })

            if (!user) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: "User not found"
                })
            }
            return filterUserForClient(user)
        })
});
