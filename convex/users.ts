import { v } from "convex/values";
import { mutation } from "./_generated/server";

// Create a new task with the given text
export const createUser = mutation({
    args:{
        username: v.string(), 
        fullname: v.string(), 
        email: v.string(),
        bio: v.optional(v.string()),
        profileImage: v.string(),
        courses: v.optional(v.number()),
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
            courses: 0,
            clerkId: args.clerkId,
        })
    }

});