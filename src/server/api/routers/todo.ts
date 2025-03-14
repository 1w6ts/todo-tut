import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { todos } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const todoRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.select().from(todos).orderBy(todos.createdAt);
  }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const [todo] = await ctx.db
        .select()
        .from(todos)
        .where(eq(todos.id, input.id));
      return todo;
    }),

  create: publicProcedure
    .input(z.object({ content: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const [newTodo] = await ctx.db
        .insert(todos)
        .values({
          content: input.content,
          completed: false,
        })
        .returning();
      return newTodo;
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        content: z.string().min(1).optional(),
        completed: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const [updatedTodo] = await ctx.db
        .update(todos)
        .set({
          ...data,
          updatedAt: new Date(),
        })
        .where(eq(todos.id, id))
        .returning();
      return updatedTodo;
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const [deletedTodo] = await ctx.db
        .delete(todos)
        .where(eq(todos.id, input.id))
        .returning();
      return deletedTodo;
    }),
});
