import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    username: v.string(), //johndoe
    fullname: v.string(), // John Doe
    email: v.string(),
    bio: v.optional(v.string()),
    profileImage: v.string(),
    coverImage: v.optional(v.string()),
    courses: v.optional(v.number()),
    clerkId: v.string(),
  }).index("by_clerk_id", ["clerkId"]),

  courses: defineTable({
    userId: v.id("users"),          // Course owner
    imageUrl: v.string(),
    storageId: v.id("_storage"), 
    title: v.string(),
    description: v.string(),

    // Array of levels
    levels: v.array(
      v.object({
        number: v.number(),         // e.g. 1, 2, 3
        title: v.string(),          // "HTML Basics"
        content: v.string(),        // Description / lessons
        maxMarks: v.number(),       // Max marks for this level
      })
    ),
  }).index("by_user", ["userId"]),


  enrollments: defineTable({
    courseId: v.id("courses"),
    userId: v.id("users"),
    progress: v.number(),            // % progress (0–100)
    completedLevels: v.array(v.number()), // Levels finished
    marks: v.array(v.number()),      // Marks per level
    isCompleted: v.boolean(),
    certificateId: v.optional(v.id("certificates")), // Link to certificate if completed
  }).index("by_course", ["courseId"]).index("by_user", ["userId"]),


  certificates: defineTable({
    courseId: v.id("courses"),
    userId: v.id("users"),
    grade: v.string(),               // e.g. "A", "B", "C"
    issuedAt: v.string(),
    qrCodeUrl: v.string(),           // Stored QR code image
    uniqueCode: v.string(),          // Unique ID to verify
  }),

});
