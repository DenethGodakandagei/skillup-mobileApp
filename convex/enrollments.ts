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

    // Prevent duplicates
    const alreadyCompleted = enrollment.completedLessons.some(
      (c: any) => c.lessonIndex === lessonIndex && c.subLessonIndex === subLessonIndex
    );
    if (alreadyCompleted) {
      return { status: "already_completed", progress: enrollment.progress, isCompleted: enrollment.isCompleted };
    }

    const course = await ctx.db.get(enrollment.courseId);
    if (!course) throw new Error("Course not found");

    // Add the new completed sub-lesson
    const updatedCompletedLessons = [
      ...enrollment.completedLessons,
      { lessonIndex, subLessonIndex, completedAt: new Date().toISOString() },
    ];

    // Remove duplicates just in case
    const uniqueCompletedLessons = updatedCompletedLessons.filter(
      (v, i, a) =>
        a.findIndex((t) => t.lessonIndex === v.lessonIndex && t.subLessonIndex === v.subLessonIndex) === i
    );

    // Count all sub-lessons in the course
    const totalSubLessons = course.lessons.reduce((sum, lesson) => sum + lesson.subLessons.length, 0);

    // Calculate progress
    const progress = (uniqueCompletedLessons.length / totalSubLessons) * 100;

    // Set isCompleted = true if all sub-lessons done
    const isCompleted = uniqueCompletedLessons.length === totalSubLessons;

    await ctx.db.patch(enrollmentId, {
      completedLessons: uniqueCompletedLessons,
      progress: isCompleted ? 100 : progress,
      isCompleted,
      lastAccessedAt: new Date().toISOString(),
    });

    return { status: "success", progress: isCompleted ? 100 : progress, isCompleted };
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
    // 1️⃣ Fetch all enrollments of the user
    const enrollments = await ctx.db
      .query("enrollments")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    if (!enrollments || enrollments.length === 0) return [];

    // 2️⃣ Map each enrollment to full course info + progress
    const coursesWithProgress = await Promise.all(
      enrollments.map(async (enrollment) => {
        const course = await ctx.db.get(enrollment.courseId);
        if (!course) return null;

        return {
          _id: course._id,
          title: course.title,
          image: course.image,
          category: course.category,
          description: course.description ?? "",
          lessons: course.lessons ?? [],       // Include lessons if available
          progress: enrollment.progress ?? 0,  // User progress
          isCompleted: enrollment.isCompleted ?? false,
          completedLessons: enrollment.completedLessons ?? [],
        };
      })
    );

    // 3️⃣ Filter out null results (in case some courses were deleted)
    return coursesWithProgress.filter((c) => c !== null);
  },
});

