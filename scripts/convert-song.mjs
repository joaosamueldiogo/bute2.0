import { readFile, writeFile } from "node:fs/promises";
import { basename, dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const CHORD_TOKEN =
  /^[A-G](?:#|b)?(?:m|min|maj|sus|dim|aug|add)?\d*(?:\/[A-G](?:#|b)?)?$/i;

function defaultTitle(inputPath) {
  const fileName = basename(inputPath, extname(inputPath));
  return fileName || basename(inputPath);
}

function isChordLine(line) {
  const tokens = line.trim().split(/\s+/);
  return tokens.length > 0 && tokens.every((token) => CHORD_TOKEN.test(token));
}

function parseMetadataLine(line) {
  const match = line.match(/^(title|author|category)\s*:\s*(.*)$/i);
  if (!match) {
    return null;
  }

  return {
    key: match[1].toLowerCase(),
    value: match[2].trim(),
  };
}

function isMalformedMetadataLine(line) {
  return /^(title|author|category)\b/i.test(line) && !parseMetadataLine(line);
}

function addDefaultMetadata(text, inputPath) {
  const lines = text.split(/\r?\n/);
  const hasMetadata = lines.some((line) => parseMetadataLine(line.trim()));
  if (hasMetadata) {
    return text;
  }

  const lineEnding = text.includes("\r\n") ? "\r\n" : "\n";
  const metadata = [
    `Title: ${defaultTitle(inputPath)}`,
    "Author: ",
    "Category: ",
  ].join(lineEnding);

  return `${metadata}${text ? `${lineEnding}${lineEnding}${text}` : lineEnding}`;
}

export function parseSongText(text, inputPath = "song.txt") {
  const metadata = {
    title: defaultTitle(inputPath),
    author: "",
    category: "",
  };
  const lyrics = [];
  let pendingChords = "";
  let contentStarted = false;

  for (const [index, rawLine] of text.replace(/^\uFEFF/, "").split(/\r?\n/).entries()) {
    const lineNumber = index + 1;
    const line = rawLine.trim();

    if (!line) {
      continue;
    }

    const metadataLine = parseMetadataLine(line);
    if (metadataLine && !contentStarted) {
      metadata[metadataLine.key] = metadataLine.value;
      continue;
    }

    if (!contentStarted && isMalformedMetadataLine(line)) {
      throw new Error(
        `Invalid metadata on line ${lineNumber}. Use "Title: ...", "Author: ...", or "Category: ...".`,
      );
    }

    contentStarted = true;

    if (isChordLine(line)) {
      if (pendingChords) {
        throw new Error(
          `Chord line ${lineNumber} must be followed by a lyric line before another chord line.`,
        );
      }
      pendingChords = rawLine;
      continue;
    }

    lyrics.push({
      chords: pendingChords,
      line,
    });
    pendingChords = "";
  }

  if (pendingChords) {
    throw new Error("The file ends with a chord line that has no lyric line after it.");
  }

  if (!metadata.title) {
    metadata.title = defaultTitle(inputPath);
  }
  return {
    title: metadata.title,
    author: metadata.author,
    category: metadata.category,
    lyrics,
  };
}

export async function convertSongFile(inputPath, outputPath) {
  const sourcePath = resolve(inputPath);
  const destinationPath = resolve(
    outputPath ??
      join(dirname(sourcePath), `${basename(sourcePath, extname(sourcePath))}.json`),
  );
  const text = await readFile(sourcePath, "utf8");
  const songText = addDefaultMetadata(text, sourcePath);
  const song = parseSongText(songText, sourcePath);

  if (songText !== text) {
    await writeFile(sourcePath, songText, "utf8");
  }

  await writeFile(destinationPath, `${JSON.stringify(song, null, 2)}\n`, "utf8");
  return destinationPath;
}

function printUsage() {
  console.error("Usage: npm run convert-song -- <input.txt> [output.json]");
}

async function main() {
  const [, , inputPath, outputPath] = process.argv;
  if (!inputPath) {
    printUsage();
    process.exitCode = 1;
    return;
  }

  try {
    const destinationPath = await convertSongFile(inputPath, outputPath);
    console.log(`Created ${destinationPath}`);
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await main();
}
