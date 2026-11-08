import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export type LyricLine = {
  chords: string;
  line: string;
};

export type Song = {
  title: string;
  author: string;
  category: string;
  lyrics: LyricLine[];
  slug: string;
};

type SongFile = Omit<Song, "slug">;

const songsDirectory = path.join(process.cwd(), "public", "songs_db");

function createSlug(relativePath: string) {
  return relativePath
    .replace(/\.json$/i, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

async function findJsonFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const entryPath = path.join(directory, entry.name);
      return entry.isDirectory()
        ? findJsonFiles(entryPath)
        : entry.name.endsWith(".json")
          ? Promise.resolve([entryPath])
          : Promise.resolve([]);
    }),
  );

  return files.flat();
}

export async function getSongs(): Promise<Song[]> {
  const files = await findJsonFiles(songsDirectory);
  const songs = await Promise.all(
    files.map(async (filePath) => {
      const data = JSON.parse(await readFile(filePath, "utf8")) as SongFile;
      const relativePath = path.relative(songsDirectory, filePath);

      return {
        ...data,
        slug: createSlug(relativePath),
        category: data.category ?? "",
      };
    }),
  );

  return songs
    .filter((song) => song.title.toLowerCase() !== "test")
    .sort((a, b) => a.title.localeCompare(b.title, "pt"));
}

export async function getSong(slug: string) {
  const songs = await getSongs();
  return songs.find((song) => song.slug === slug);
}

export async function getSongSlugs() {
  const songs = await getSongs();
  return songs.map(({ slug }) => ({ slug }));
}

function replaceMetadata(text: string, metadata: Pick<Song, "title" | "author" | "category">) {
  const lineEnding = text.includes("\r\n") ? "\r\n" : "\n";
  const lines = text.replace(/^\uFEFF/, "").split(/\r?\n/);
  const metadataLines = [
    `Title: ${metadata.title}`,
    `Author: ${metadata.author}`,
    `Category: ${metadata.category}`,
  ];
  let firstContentLine = lines.findIndex((line) => line.trim() && !/^(title|author|category)\s*:/i.test(line.trim()));

  if (firstContentLine === -1) {
    firstContentLine = lines.length;
  }

  const content = lines.slice(firstContentLine);
  while (content[0] === "") {
    content.shift();
  }

  return `${metadataLines.join(lineEnding)}${lineEnding}${lineEnding}${content.join(lineEnding)}`;
}

export async function updateSongMetadata(
  slug: string,
  metadata: Pick<Song, "title" | "author" | "category">,
) {
  if (process.env.NODE_ENV !== "development") {
    throw new Error("Song metadata editing is only available in development.");
  }

  const files = await findJsonFiles(songsDirectory);
  const jsonPath = files.find((filePath) => createSlug(path.relative(songsDirectory, filePath)) === slug);
  if (!jsonPath) {
    throw new Error("Song not found.");
  }

  const sourcePath = jsonPath.replace(/\.json$/i, ".txt");
  const sourceText = await readFile(sourcePath, "utf8");
  const nextText = replaceMetadata(sourceText, metadata);
  await writeFile(sourcePath, nextText, "utf8");

  const nextSong = JSON.parse(await readFile(jsonPath, "utf8")) as SongFile;
  await writeFile(
    jsonPath,
    `${JSON.stringify({ ...nextSong, ...metadata }, null, 2)}\n`,
    "utf8",
  );
}
