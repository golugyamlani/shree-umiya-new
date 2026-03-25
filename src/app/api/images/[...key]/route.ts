import { getCloudflareContext } from "@opennextjs/cloudflare";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ key: string[] }> }
) {
  const { key } = await params;
  const objectKey = key.join("/");

  const { env } = getCloudflareContext();
  const r2 = (env as any).R2_ASSETS;

  const object = await r2.get(objectKey);

  if (!object) {
    return new NextResponse("Image not found", { status: 404 });
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("Cache-Control", "public, max-age=31536000, immutable");

  return new NextResponse(object.body, { headers });
}
