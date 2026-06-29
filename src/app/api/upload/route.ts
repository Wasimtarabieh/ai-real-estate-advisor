import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function POST(req: Request) {
  const formData = await req.formData();
  const files = formData.getAll("files") as File[];
  const urls: string[] = [];

  const uploadDir = join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });

  for (const file of files) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const name = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
    await writeFile(join(uploadDir, name), buffer);
    urls.push(`/uploads/${name}`);
  }

  return NextResponse.json({ urls });
}
