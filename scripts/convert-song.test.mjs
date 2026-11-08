import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import test from "node:test";

import { convertSongFile, parseSongText } from "./convert-song.mjs";

test("parses metadata, chord lines, lyric-only lines, and blank separators", () => {
  const song = parseSongText(
    [
      "Title: Test Song",
      "Author: Someone",
      "Category: worship",
      "",
      "  A    E   D  ",
      "First lyric",
      "",
      "Second lyric",
      "Bm",
      "Third lyric",
    ].join("\n"),
    "input.txt",
  );

  assert.deepEqual(song, {
    title: "Test Song",
    author: "Someone",
    category: "worship",
    lyrics: [
      { chords: "  A    E   D  ", line: "First lyric" },
      { chords: "", line: "Second lyric" },
      { chords: "Bm", line: "Third lyric" },
    ],
  });
});

test("uses defaults when metadata is missing", () => {
  assert.deepEqual(parseSongText("A\nA lyric", "Somos Irmãos.txt"), {
    title: "Somos Irmãos",
    author: "",
    category: "",
    lyrics: [{ chords: "A", line: "A lyric" }],
  });
});

test("adds default metadata to text files without metadata", async () => {
  const directory = await mkdtemp("convert-song-");
  const inputPath = join(directory, "Bless the Lord.txt");

  try {
    await writeFile(inputPath, "Dm        G        Dm\nBless the Lord, my soul,", "utf8");
    await convertSongFile(inputPath);

    assert.equal(
      await readFile(inputPath, "utf8"),
      [
        "Title: Bless the Lord",
        "Author: ",
        "Category: ",
        "",
        "Dm        G        Dm",
        "Bless the Lord, my soul,",
      ].join("\n"),
    );
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("does not replace existing metadata", async () => {
  const directory = await mkdtemp("convert-song-");
  const inputPath = join(directory, "input.txt");
  const text = "Title: Existing\n\nA\nA lyric";

  try {
    await writeFile(inputPath, text, "utf8");
    await convertSongFile(inputPath);
    assert.equal(await readFile(inputPath, "utf8"), text);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("rejects malformed metadata", () => {
  assert.throws(
    () => parseSongText("Title Test\nA lyric", "input.txt"),
    /Invalid metadata on line 1/,
  );
});

test("rejects a chord line without a following lyric", () => {
  assert.throws(
    () => parseSongText("A E", "input.txt"),
    /ends with a chord line/,
  );
});

test("rejects consecutive chord-only lines", () => {
  assert.throws(
    () => parseSongText("A\nE\nA lyric", "input.txt"),
    /must be followed by a lyric line/,
  );
});
