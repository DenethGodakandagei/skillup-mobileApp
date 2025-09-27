import { v } from "convex/values";
import { mutation, MutationCtx, query, QueryCtx } from "./_generated/server";

// Create a new task with the given text
export const createUser = mutation({
    args:{
        username: v.string(), 
        fullname: v.string(), 
        email: v.string(),
        bio: v.optional(v.string()),
        profileImage: v.string(),
        coverImage: v.optional(v.string()),
        clerkId: v.string(),
    },

    handler: async(ctx, args) => {
        const existingUser = await ctx.db.query("users").withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId)).first();
        await ctx.auth.getUserIdentity()
        if(existingUser) return;
        
        //create a user in database
        await ctx.db.insert("users",{
            username: args.username,
            fullname: args.fullname,
            email: args.email,
            bio: args.bio,
            profileImage: args.profileImage,
            coverImage: args.coverImage,
            clerkId: args.clerkId,
        })
    }
});

export const getUserByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    return user;
  },
});

export const updateProfile = mutation({
    args: {
        fullname: v.optional(v.string()), // Make fullname optional
        bio: v.optional(v.string()),
        coverImage: v.optional(v.string()),
        profileImage: v.optional(v.string()), // Add profileImage as optional
    },
    handler: async (ctx, args) => {
        const currentUser = await getAuthenticatedUser(ctx);

        // Build an object with only the fields that were provided in args
        const fieldsToUpdate: { [key: string]: string | undefined } = {};
        if (args.fullname !== undefined) {
            fieldsToUpdate.fullname = args.fullname;
        }
        if (args.bio !== undefined) {
            fieldsToUpdate.bio = args.bio;
        }
        if (args.coverImage !== undefined) {
            fieldsToUpdate.coverImage = args.coverImage;
        }
        if (args.profileImage !== undefined) {
            fieldsToUpdate.profileImage = args.profileImage;
        }
        
        await ctx.db.patch(currentUser._id, fieldsToUpdate);
    },
});

export async function getAuthenticatedUser(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Unauthorized");

  const currentUser = await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
    .first();

  if (!currentUser) throw new Error("User not found");

  return currentUser;
}

export const getUserProfile = query({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.id);
    if (!user) throw new Error("User not found");

    return user;
  },
});
