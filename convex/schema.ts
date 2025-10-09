import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // ---------------------- USERS TABLE (Unchanged) ----------------------
  users: defineTable({
    username: v.string(),
    fullname: v.string(),
    email: v.string(),
    bio: v.optional(v.string()),
    profileImage: v.string(),
    coverImage: v.optional(v.string()),
    clerkId: v.string(),
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_email", ["email"])
    .index("by_username", ["username"]),

  // ---------------------- COURSES TABLE (Unchanged) ----------------------
  courses: defineTable({
    title: v.string(),
    image: v.string(),
    description: v.string(),
    category: v.string(),
    lessons: v.array(
      v.object({
        lessonTitle: v.string(),
        subLessons: v.array(
          v.object({
            subTitle: v.string(),
            videoUrl: v.string(),
            description: v.string(),
            textNotes: v.string(),
            image: v.optional(v.string()),
            status: v.union(v.literal("completed"), v.literal("incompleted")),
          })
        ),
      })
    ),
    createdAt: v.number(),
  })
    .index("by_category", ["category"])
    .index("by_createdAt", ["createdAt"]),

  // ---------------------- ENROLLMENTS TABLE (Improved) ----------------------
  enrollments: defineTable({
    userId: v.id("users"),
    courseId: v.id("courses"),

    // Enrollment status
    enrolledAt: v.string(),            // ISO date
    lastAccessedAt: v.optional(v.string()),
    isCompleted: v.boolean(),

    // Learning progress tracking
    progress: v.number(),              // 0–100 %
    completedLessons: v.array(
      v.object({
        lessonIndex: v.number(),
        subLessonIndex: v.number(),
        completedAt: v.string(),       // ISO date when sub-lesson was finished
      })
    ),

    // Assessment & marks (optional per lesson/sublesson)
    marks: v.optional(
      v.array(
        v.object({
          lessonIndex: v.number(),
          subLessonIndex: v.number(),
          score: v.number(),           // e.g. quiz marks
        })
      )
    ),

    // Certificate link (filled after course completion)
    certificateId: v.optional(v.id("certificates")),
  })
    .index("by_user", ["userId"])
    .index("by_course", ["courseId"])
    .index("by_user_course", ["userId", "courseId"]), // To quickly check enrollment


 // ---------------------- CERTIFICATES TABLE ----------------------
  certificates: defineTable({
    userId: v.id("users"),
    courseId: v.id("courses"),

    // Completion metadata
    issuedAt: v.string(),          // ISO date
    completedAt: v.string(),       // When the course was finished
    totalDuration: v.optional(v.number()), // in minutes/hours if you track time

    // Performance summary
    grade: v.string(),             // e.g. "A", "B", "C"
    overallScore: v.number(),      // calculated from marks
    totalLessons: v.number(),
    totalSubLessons: v.number(),

    // Certificate details
    qrCodeUrl: v.string(),         // stored QR image (SVG)
    uniqueCode: v.string(),        // Unique alphanumeric code for verification

    // Snapshot of user & course data at generation time
    userSnapshot: v.object({
      fullname: v.string(),
      username: v.string(),
      email: v.string(),
      profileImage: v.string(),
    }),
    courseSnapshot: v.object({
      title: v.string(),
      category: v.string(),
      image: v.string(),
      totalLessons: v.number(),     // included
      totalSubLessons: v.number(),  // included
    }),
  })
  .index("by_unique_code", ["uniqueCode"])
  .index("by_user", ["userId"])
  .index("by_course", ["courseId"])
  .index("by_user_course", ["userId", "courseId"]),
});
