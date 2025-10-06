// convex/enrollments.ts
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Enroll a user to a course
export const enrollUserToCourse = mutation({
  args: {
    userId: v.id("users"),
    courseId: v.id("courses"),
  },
  handler: async (ctx, { userId, courseId }) => {
    const existing = await ctx.db
      .query("enrollments")
      .withIndex("by_user_course", (q) => q.eq("userId", userId).eq("courseId", courseId))
      .unique();

    if (existing) return { enrolled: true, enrollmentId: existing._id };

    const enrollmentId = await ctx.db.insert("enrollments", {
      userId,
      courseId,
      enrolledAt: new Date().toISOString(),
      isCompleted: false,
      progress: 0,
      completedLessons: [],
    });

    return { enrolled: true, enrollmentId };
  },
});

// Check if a user is enrolled
export const checkEnrollmentStatus = query({
  args: { userId: v.id("users"), courseId: v.id("courses") },
  handler: async (ctx, { userId, courseId }) => {
    const enrollment = await ctx.db
      .query("enrollments")
      .withIndex("by_user_course", (q) => q.eq("userId", userId).eq("courseId", courseId))
      .unique();
    return { enrolled: !!enrollment };
  },
});

// Mark a sub-lesson as completed
export const completeSubLesson = mutation({
  args: {
    enrollmentId: v.id("enrollments"),
    lessonIndex: v.number(),
    subLessonIndex: v.number(),
  },
  handler: async (ctx, { enrollmentId, lessonIndex, subLessonIndex }) => {
    const enrollment = await ctx.db.get(enrollmentId);
    if (!enrollment) throw new Error("Enrollment not found");

    const alreadyCompleted = enrollment.completedLessons.some(
      (c: any) => c.lessonIndex === lessonIndex && c.subLessonIndex === subLessonIndex
    );

    if (alreadyCompleted) return { status: "already_completed" };

    const course = await ctx.db.get(enrollment.courseId);
    if (!course) throw new Error("Course not found");

    const totalSubLessons = course.lessons.reduce(
      (sum: number, lesson: any) => sum + lesson.subLessons.length,
      0
    );

    const updatedCompletedLessons = [
      ...enrollment.completedLessons,
      { lessonIndex, subLessonIndex, completedAt: new Date().toISOString() },
    ];

    const progress = (updatedCompletedLessons.length / totalSubLessons) * 100;
    const isCompleted = progress >= 100;

    await ctx.db.patch(enrollmentId, {
      completedLessons: updatedCompletedLessons,
      progress,
      isCompleted,
      lastAccessedAt: new Date().toISOString(),
    });

    return { status: "success", progress };
  },
});


export const getEnrollmentByUserAndCourse = query({
  args: { userId: v.id("users"), courseId: v.id("courses") },
  handler: async (ctx, { userId, courseId }) => {
    const enrollment = await ctx.db
      .query("enrollments")
      .withIndex("by_user_course", (q) => q.eq("userId", userId).eq("courseId", courseId))
      .unique();
    return enrollment;
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

