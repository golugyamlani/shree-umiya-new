"use server";

import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getDb } from "@/db";
import { teamMembers } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid";

function getDbClient() {
  try {
    const { env } = getCloudflareContext();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return getDb(env as any);
  } catch {
    throw new Error("DB_UNAVAILABLE");
  }
}

export async function getTeamMembers() {
  try {
    const db = getDbClient();
    // Fetch all members. D1 returns them natively in one blazing fast payload.
    return await db.select().from(teamMembers).orderBy(asc(teamMembers.displayOrder));
  } catch (e) {
    console.error(e);
    return [];
  }
}

export async function createTeamMember(data: { name: string, role: string, image: string }) {
  const db = getDbClient();
  
  // Find current max order to place new member at the bottom
  const members = await db.select().from(teamMembers);
  const maxOrder = members.length > 0 ? Math.max(...members.map(m => m.displayOrder || 0)) : -1;

  await db.insert(teamMembers).values({
    id: nanoid(),
    name: data.name,
    role: data.role,
    image: data.image,
    displayOrder: maxOrder + 1
  });
  
  revalidatePath("/admin/team");
  revalidatePath("/about");
  revalidatePath("/", "layout"); // Burst global edge cache just in case
}

export async function updateTeamOrder(updates: { id: string, newOrder: number }[]) {
  const db = getDbClient();
  
  // D1 is extremely fast. We can just execute multiple updates iteratively or run a transaction natively.
  // For small team lists under 100 members, sequential async execution is heavily optimized by Cloudflare edge caching.
  await Promise.all(
    updates.map((update) => 
      db.update(teamMembers)
        .set({ displayOrder: update.newOrder })
        .where(eq(teamMembers.id, update.id))
    )
  );

  revalidatePath("/admin/team");
  revalidatePath("/about");
  revalidatePath("/", "layout");
}

export async function deleteTeamMember(id: string) {
  const db = getDbClient();
  await db.delete(teamMembers).where(eq(teamMembers.id, id));
  
  revalidatePath("/admin/team");
  revalidatePath("/about");
  revalidatePath("/", "layout");
}
