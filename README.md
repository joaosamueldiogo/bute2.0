This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Converting song lyrics

Convert a UTF-8 `.txt` file containing chord lines and lyrics into the song
JSON format used by the project:

```bash
npm run convert-song -- "public/songs_db/Somos Irmãos.txt"
```

The output is written next to the input file with a `.json` extension. Pass a
second argument to choose a different output path:

```bash
npm run convert-song -- input.txt output.json
```

Metadata can be placed at the top of the text file using `Title: ...`,
`Author: ...`, and `Category: ...` lines. Missing metadata defaults to the input
filename (without `.txt`) for the title, an empty author, and an empty category.
The category may be empty when no category is provided. Chord-line
whitespace is preserved so chords remain aligned with the following lyric line.
When a text file has no metadata lines, conversion adds these default metadata
lines to the source file.
A standalone chord line is associated with the next lyric line; lyric lines
without chords are retained with an empty `chords` value.

Generated song JSON files are read by the `/songs` page. The catalogue can be
searched by title, author, or category, and each song has its own detail page with
the chords and lyrics.

When running in development mode, the catalogue also exposes an **Editar** action
for changing a song's title, author, or category. Changes are written back to the
source `.txt` file and its generated `.json` file. This editor and its write API
are disabled outside development.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
