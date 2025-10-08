import { v } from "convex/values";
import QRCode from "qrcode";
// Import both mutation and query
import { Doc } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";

// Utility to generate unique alphanumeric code
function generateUniqueCode(length = 12) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// =======================================================
// MUTATION: generateCertificate (Creates the certificate)
// =======================================================
export const generateCertificate = mutation({
  args: {
    userId: v.id("users"),
    courseId: v.id("courses"),
  },
  handler: async (ctx, { userId, courseId }) => {
    const user = await ctx.db.get(userId);
    const course = await ctx.db.get(courseId);

    if (!user || !course) throw new Error("User or course not found");

    const enrollment = await ctx.db
      .query("enrollments")
      .withIndex("by_user_course", (q) => q.eq("userId", userId).eq("courseId", courseId))
      .unique();

    if (!enrollment) throw new Error("User is not enrolled in this course");
    if (!enrollment.isCompleted) throw new Error("Course not completed yet");

    const uniqueCode = generateUniqueCode();
    const verifyUrl = `https://your-domain.com/verify/${uniqueCode}`;

    // FIX: Use QRCode.toString with type: "svg" for Node-compatible generation
    const qrCodeSvg = await QRCode.toString(verifyUrl, { type: "svg" });

    const now = new Date().toISOString();

    const certificateId = await ctx.db.insert("certificates", {
      userId,
      courseId,
      issuedAt: now,
      completedAt: enrollment.lastAccessedAt ?? now,
      qrCodeUrl: qrCodeSvg, // Store the SVG string
      uniqueCode,
      totalLessons: course.lessons?.length || 0,
      totalSubLessons: course.lessons?.reduce((acc, l) => acc + (l.subLessons?.length || 0), 0) || 0,
      grade: 'A',
      overallScore: 80,
      userSnapshot: {
        fullname: user.fullname,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage ?? "",
      },
      courseSnapshot: {
        title: course.title,
        category: course.category ?? "",
        image: course.image ?? "",
      },
    });

    await ctx.db.patch(enrollment._id, { certificateId });

    // The mutation only returns the certificateId, uniqueCode, and qrCodeUrl
    return { certificateId, uniqueCode, qrCodeUrl: qrCodeSvg };
  },
});

export const getDetails = query({
  args: {
    certificateId: v.id("certificates"),
  },
  handler: async (ctx, { certificateId }) => {
    // Fetch the certificate record by ID
    const certificate = await ctx.db.get(certificateId);

    if (!certificate) {
      throw new Error("Certificate not found.");
    }
   
    return certificate as Doc<"certificates">;
  },
});