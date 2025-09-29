// utils/convexHelpers.ts
import { api } from "../convex/_generated/api";

import { ConvexClient } from "convex/browser"; // or "convex/react" or wherever you initialize your client

export const getConvexUserId = async (convex: ConvexClient, clerkId: string) => {
  const user = await convex.query(api.users.getUserByClerkId, { clerkId });
  if (!user) throw new Error("User not found in Convex DB");
  return user._id; // Convex database ID
};
