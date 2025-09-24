// convex/courses.ts
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

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



// Enroll user in a course
export const enrollInCourse = mutation({
  args: { courseId: v.id("courses") },
  handler: async (ctx, args) => {
    // 🔹 Paste here
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) throw new Error("User not found");

    // Now you can safely use user._id
    const existing = await ctx.db
      .query("enrollments")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .filter((q) => q.eq(q.field("courseId"), args.courseId))
      .first();

    if (existing) return existing;

    return await ctx.db.insert("enrollments", {
      courseId: args.courseId,
      userId: user._id,
      progress: 0,
      completedLevels: [],
      marks: [],
      isCompleted: false,
      enrolledAt: new Date().toISOString(),
    });
  },
});



// Update progress (when user finishes a level)
export const completeLevel = mutation({
  args: {
    enrollmentId: v.id("enrollments"),
    levelCompleted: v.number(),
    marks: v.number(),
  },
  handler: async (ctx, args) => {
    const enrollment = await ctx.db.get(args.enrollmentId);
    if (!enrollment) throw new Error("Enrollment not found");

    const updatedLevels = [...enrollment.completedLevels, args.levelCompleted];
    const updatedMarks = [...enrollment.marks, args.marks];

    return await ctx.db.patch(args.enrollmentId, {
      completedLevels: updatedLevels,
      marks: updatedMarks,
      progress: (updatedLevels.length / 10) * 100, // assuming 10 levels
      isCompleted: updatedLevels.length === 10,
      updatedAt: new Date().toISOString(),
    });
  },
});


// Generate certificate after completion
export const generateCertificate = mutation({
  args: { enrollmentId: v.id("enrollments"), grade: v.string() },
  handler: async (ctx, args) => {
    // 🔹 Paste here too
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) throw new Error("User not found");

    const enrollment = await ctx.db.get(args.enrollmentId);
    if (!enrollment || !enrollment.isCompleted)
      throw new Error("Course not completed");

    const certificateId = await ctx.db.insert("certificates", {
      courseId: enrollment.courseId,
      userId: enrollment.userId,
      grade: args.grade,
      issuedAt: new Date().toISOString(),
      qrCodeUrl: "/qr/sample.png",
      uniqueCode: crypto.randomUUID(),
    });

    await ctx.db.patch(args.enrollmentId, { certificateId });
    return certificateId;
  },
});
