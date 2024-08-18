import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("Notes").collect();
  },
});

export const getById = query({
  args: { id: v.id("Notes") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const deleteLocker = mutation({
  args: { id: v.id("Notes") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const createLocker = mutation({
  args: { title: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.insert("Notes", { title: args.title, content: "" });
  },
});

export const updateLocker = mutation({
  args: { id: v.id("Notes"), content: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, { content: args.content });
  },
});
