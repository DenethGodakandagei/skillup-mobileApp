import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const enrollUserToCourse = mutation({
  args: {
    userId: v.id("users"),
    courseId: v.id("courses"),
  },
  handler: async (ctx, { userId, courseId }) => {
    // Check if already enrolled
    const existing = await ctx.db
      .query("enrollments")
      .withIndex("by_user_course", (q) => q.eq("userId", userId).eq("courseId", courseId))
      .unique();

    if (existing) {
      return { enrolled: true, enrollmentId: existing._id };
    }

    const enrollmentId = await ctx.db.insert("enrollments", {
      userId,
      courseId,
      enrolledAt: new Date().toISOString(),
      isCompleted: false,
      progress: 0,
      completedLessons: [],
      marks: [],
      certificateId: undefined,
    });

    return { enrolled: true, enrollmentId };
  },
});

export const isUserEnrolled = query({
  args: {
    userId: v.id("users"),
    courseId: v.id("courses"),
  },
  handler: async (ctx, { userId, courseId }) => {
    const enrollment = await ctx.db
      .query("enrollments")
      .withIndex("by_user_course", (q) =>
        q.eq("userId", userId).eq("courseId", courseId)
      )
      .unique();

    return !!enrollment; // true if enrolled, false if not
  },
});

export const checkEnrollmentStatus = query({
  args: { userId: v.id("users"), courseId: v.id("courses") },
  handler: async (ctx, { userId, courseId }) => {
    const enrollment = await ctx.db
      .query("enrollments")
      .withIndex("by_user_course", (q) =>
        q.eq("userId", userId).eq("courseId", courseId)
      )
      .unique();
    return { enrolled: !!enrollment };
  },
});


export const getEnrolledCoursesByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    // Find all enrollment records for this user
    const enrollments = await ctx.db
      .query("enrollments")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    // Fetch the course details for each enrollment
    const courses = await Promise.all(
      enrollments.map(async (enrollment) => {
        const course = await ctx.db.get(enrollment.courseId);
        return course;
      })
    );

    // Filter out any nulls (in case a course was deleted)
    return courses.filter((c) => c !== null);
  },
});
