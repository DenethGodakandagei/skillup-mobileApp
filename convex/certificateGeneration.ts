import { v } from "convex/values";
import QRCode from "qrcode";
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
    // 1️⃣ Fetch user and course data
    const user = await ctx.db.get(userId);
    const course = await ctx.db.get(courseId);
    if (!user || !course) throw new Error("User or course not found");

    // 2️⃣ Verify enrollment and completion
    const enrollment = await ctx.db
      .query("enrollments")
      .withIndex("by_user_course", (q) =>
        q.eq("userId", userId).eq("courseId", courseId)
      )
      .unique();

    if (!enrollment) throw new Error("User is not enrolled in this course");
    if (!enrollment.isCompleted) throw new Error("Course not completed yet");

    // 3️⃣ Generate unique code & timestamps
    const uniqueCode = generateUniqueCode();
    const now = new Date().toISOString();

    // 4️⃣ Prepare full certificate data (to embed inside QR)
    const certificateData = {
      uniqueCode,
      issuedAt: now,
      completedAt: enrollment.lastAccessedAt ?? now,
      user: {
        fullname: user.fullname,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage ?? "",
      },
      course: {
        title: course.title,
        category: course.category ?? "",
        image: course.image ?? "",
        totalLessons: course.lessons?.length || 0,
        totalSubLessons:
          course.lessons?.reduce(
            (acc, l) => acc + (l.subLessons?.length || 0),
            0
          ) || 0,
      },
      grade: "A",
      overallScore: 80,
      verifyUrl: `https://your-domain.com/verify/${uniqueCode}`,
    };

    // 5️⃣ Encode full JSON data into QR code
    const qrPayload = JSON.stringify(certificateData);
    const qrCodeSvg = await QRCode.toString(qrPayload, { type: "svg" });

    // 6️⃣ Save certificate record in DB
    const certificateId = await ctx.db.insert("certificates", {
      userId,
      courseId,
      issuedAt: now,
      completedAt: enrollment.lastAccessedAt ?? now,
      qrCodeUrl: qrCodeSvg, // Store the SVG QR data
      uniqueCode,
      totalLessons: certificateData.course.totalLessons,
      totalSubLessons: certificateData.course.totalSubLessons,
      grade: certificateData.grade,
      overallScore: certificateData.overallScore,
      userSnapshot: certificateData.user,
      courseSnapshot: certificateData.course,
    });

    // 7️⃣ Patch enrollment to include certificate ID
    await ctx.db.patch(enrollment._id, { certificateId });

    // 8️⃣ Return essential data
    return {
      certificateId,
      uniqueCode,
      qrCodeSvg,
      certificateData, // return full embedded data for client preview if needed
    };
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

export const checkIfCertificateExists = query({
  args: {
    userId: v.id("users"),
    courseId: v.id("courses"),
  },
  handler: async (ctx, { userId, courseId }) => {
    const certificate = await ctx.db
      .query("certificates")
      .withIndex("by_user_course", (q) => q.eq("userId", userId).eq("courseId", courseId))
      .unique();

    return certificate ? true : false;
  },
});
