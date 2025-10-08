import { v } from "convex/values";
import { query } from "./_generated/server";

export const getCertificateByUserAndCourse = query({
  args: {
    userId: v.id("users"),
    courseId: v.id("courses"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("certificates")
      .withIndex("by_user")
      .filter((q) =>
        q.and(
          q.eq(q.field("userId"), args.userId),
          q.eq(q.field("courseId"), args.courseId)
        )
      )
      .first();
  },
});


export const getByUserAndCourse = query({
  args: {
    userId: v.id("users"),
    courseId: v.id("courses"),
  },
  handler: async (ctx, { userId, courseId }) => {
    return await ctx.db
      .query("certificates")
      .withIndex("by_user")
      .filter(q => q.eq(q.field("userId"), userId))
      .filter(q => q.eq(q.field("courseId"), courseId))
      .first();
  },
});


export const getAllByUser = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("certificates")
      .withIndex("by_user")
      .filter(q => q.eq(q.field("userId"), userId))
      // .sort((a, b) => b.issuedAt.localeCompare(a.issuedAt)) // optional: latest first
      .collect();
  },
});

export const getById = query({
  args: { certificateId: v.id("certificates") },
  handler: async (ctx, { certificateId }) => {
    // ✅ Use ctx.db.get() to fetch by ID
    return await ctx.db.get(certificateId);
  },
});
