import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { updateSongMetadata } from "@/lib/songs";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function POST(request: Request, { params }: RouteContext) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not available outside development." }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (
    !body ||
    typeof body !== "object" ||
    typeof (body as Record<string, unknown>).title !== "string" ||
    typeof (body as Record<string, unknown>).author !== "string" ||
    typeof (body as Record<string, unknown>).category !== "string"
  ) {
    return NextResponse.json({ error: "Title, author, and category are required." }, { status: 400 });
  }

  const metadata = body as { title: string; author: string; category: string };
  if (!metadata.title.trim()) {
    return NextResponse.json({ error: "Title cannot be empty." }, { status: 400 });
  }

  try {
    const { slug } = await params;
    await updateSongMetadata(slug, {
      title: metadata.title.trim(),
      author: metadata.author.trim(),
      category: metadata.category.trim(),
    });
    revalidatePath("/songs");
    revalidatePath(`/songs/${slug}`);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not update song metadata.";
    const status = message === "Song not found." ? 404 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
