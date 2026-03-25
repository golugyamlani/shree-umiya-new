import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { nanoid } from "nanoid";

function hasCloudflareContext(): boolean {
  try {
    getCloudflareContext();
    return true;
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  if (!hasCloudflareContext()) {
    return NextResponse.json({ error: "No Cloudflare Context. Run preview/deploy." }, { status: 500 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const prefix = formData.get("prefix") as string || "uploads";

    if (!file || file.size === 0) {
      return NextResponse.json({ error: "No valid file uploaded" }, { status: 400 });
    }

    const { env } = getCloudflareContext();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const r2 = (env as any).R2_ASSETS;

    const key = `${prefix}/${nanoid()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const buffer = await file.arrayBuffer();

    await r2.put(key, buffer, {
      httpMetadata: { contentType: file.type },
    });

    const url = `https://cdn.shreeumiyaenterprise.in/${key}`;
    return NextResponse.json({ url, success: true });
  } catch (error: any) {
    console.error("Upload API error:", error);
    return NextResponse.json({ error: error.message || "Failed to upload" }, { status: 500 });
  }
}
