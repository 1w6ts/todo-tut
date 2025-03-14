import { initTRPC } from "@trpc/server";
import { db } from "../db";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";

export const createTRPCContext = async (opts: CreateNextContextOptions) => {
  return {
    db,
    req: opts.req,
    res: opts.res,
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
