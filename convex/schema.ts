import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Users table
  users: defineTable({
    username: v.string(),            // johndoe
    fullname: v.string(),            // John Doe
    email: v.string(),
    bio: v.optional(v.string()),
    profileImage: v.string(),
    coverImage: v.optional(v.string()),
    courses: v.optional(v.number()), // total courses created (optional, can calculate dynamically)
    clerkId: v.string(),
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_email", ["email"])
    .index("by_username", ["username"]),

  // Courses table
  courses: defineTable({
    title: v.string(),          // Course title e.g. "Web Development for Beginners"
    image: v.string(),          // Image URL (course thumbnail)
    description: v.string(),    // Course description
    category: v.string(),       // e.g. Web Dev, Data Science, etc.
    lessons: v.array(
      v.object({
        lessonTitle: v.string(),   // e.g. "Lesson 1: Introduction..."
        subLessons: v.array(
          v.object({
            subTitle: v.string(),          // e.g. "1.1 Introduction to Networking..."
            videoUrl: v.string(),          // video link
            description: v.string(),       // description of the sub lesson
            textNotes: v.string(),         // text notes
            image: v.optional(v.string()), // optional image
            status: v.union(               // completion status
              v.literal("completed"),
              v.literal("incompleted")
            ),
          })
        ),
      })
    ),
    createdAt: v.number(),      // timestamp
  })
    .index("by_category", ["category"])
    .index("by_createdAt", ["createdAt"]),



  // // Enrollments table
  // enrollments: defineTable({
  //   courseId: v.id("courses"),
  //   userId: v.id("users"),
  //   progress: v.number(),            // % progress (0–100)
  //   completedLevels: v.array(v.number()), // Levels finished
  //   marks: v.array(v.number()),      // Marks per level
  //   isCompleted: v.boolean(),
  //   certificateId: v.optional(v.id("certificates")), // Link to certificate if completed
  //   enrolledAt: v.string(),          // ISO date
  //   updatedAt: v.optional(v.string()),
  // })
  //   .index("by_course", ["courseId"])
  //   .index("by_user", ["userId"]),

  // // Certificates table
  // certificates: defineTable({
  //   courseId: v.id("courses"),
  //   userId: v.id("users"),
  //   grade: v.string(),               // e.g. "A", "B", "C"
  //   issuedAt: v.string(),            // ISO date
  //   qrCodeUrl: v.string(),           // Stored QR code image
  //   uniqueCode: v.string(),          // Unique ID to verify
  // })
  //   .index("by_unique_code", ["uniqueCode"])
  //   .index("by_user", ["userId"])
  //   .index("by_course", ["courseId"]),
});
