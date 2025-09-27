// convex/courses.ts
import { v } from "convex/values";
import { query } from "./_generated/server";

// Get all predefined courses
export const getCourses = query({
  handler: async (ctx) => {
    return await ctx.db.query("courses").collect();
  },
});

// Get single course details
export const getCourseById = query({
  args: { courseId: v.id("courses") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.courseId);
  },
});


