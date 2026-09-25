import { sql } from '@vercel/postgres';
import { Artist, Song, SongForm, Tag } from './definitions';

const ITEMS_PER_PAGE = 6;



export async function fetchFilteredSongs(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const songs = await sql<Song>`
      SELECT
        songs.id,
        songs.title,
        songs.file_path,
        ARRAY_AGG(DISTINCT artists.name ORDER BY artists.name) AS artists,
        ARRAY_AGG(DISTINCT tags.name ORDER BY tags.name) AS tags
      FROM songs
      LEFT JOIN songs_artists ON songs.id = songs_artists.songs_id
      LEFT JOIN artists ON songs_artists.artists_id = artists.id
      LEFT JOIN songs_tags ON songs.id = songs_tags.songs_id
      LEFT JOIN tags ON songs_tags.tags_id = tags.id
      WHERE
        songs.title ILIKE ${`%${query}%`} OR
        artists.name ILIKE ${`%${query}%`} OR
        tags.name ILIKE ${`%${query}%`}
      GROUP BY songs.id
      ORDER BY UPPER(songs.title), UPPER(MIN(artists.name))
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset};
    `;

    return songs.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch songs.');
  }
}

export async function fetchSongsPages(query: string) {

  try {
    const count = await sql`SELECT COUNT(*)
    FROM songs
    LEFT JOIN songs_artists ON songs.id = songs_artists.songs_id
    LEFT JOIN artists ON songs_artists.artists_id = artists.id
    LEFT JOIN songs_tags ON songs.id = songs_tags.songs_id
    LEFT JOIN tags ON songs_tags.tags_id = tags.id
    WHERE
      songs.title ILIKE ${`%${query}%`} OR
      artists.name ILIKE ${`%${query}%`} OR
      tags.name ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of songs.');
  }
}

export async function fetchSongById(id: string) {
  try {
    const data = await sql<Song>`
      SELECT
        songs.id,
        songs.title,
        songs.file_path
      FROM songs
      WHERE songs.id = ${id};
    `;

    const tags = await sql<Tag>`
      SELECT tags.*
      FROM tags
      JOIN songs_tags ON tags.id = songs_tags.tags_id
      WHERE songs_tags.songs_id = ${id};
    `;
    const artists = await sql<Artist>`
      SELECT artists.*
      FROM artists
      JOIN songs_artists ON artists.id = songs_artists.artists_id
      WHERE songs_artists.songs_id = ${id};
    `;

    const song = data.rows[0]

    const songForm : SongForm = {
      id: song.id,
      title: song.title,
      file_path: song.file_path,
      tags: tags.rows,
      artists: artists.rows
    }

    return songForm
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch Song.');
  }
}



export async function fetchArtistsPages(query: string) {

  try {
    const count = await sql`SELECT COUNT(*)
    FROM artists
    WHERE
      artists.name ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of songs.');
  }
}

export async function fetchFilteredArtists(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const artists = await sql<Artist>`
      SELECT
        artists.id,
        artists.name
      FROM artists
      WHERE
        artists.name ILIKE ${`%${query}%`}
      ORDER BY UPPER(artists.name)
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset};
    `;

    return artists.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch artists.');
  }
}

export async function fetchArtists() {
  try {
    const artists = await sql<Artist>`
      SELECT
        artists.id,
        artists.name
      FROM artists
      ORDER BY UPPER(artists.name)
    `;

    return artists.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch artists.');
  }
}



export async function fetchArtistById(id: string) {
  try {
    const data = await sql<Artist>`
      SELECT
        artists.id,
        artists.name
      FROM artists
      WHERE artists.id = ${id};
    `;

    const artist = data.rows

    return artist[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch Artist by Id.');
  }
}

export async function fetchTags() {
  try {
    const tags = await sql<Tag>`
      SELECT
        tags.id,
        tags.name
      FROM tags
      ORDER BY UPPER(tags.name)
    `;

    return tags.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch tags.');
  }
}


export async function fetchTagsPages(query: string) {

  try {
    const count = await sql`SELECT COUNT(*)
    FROM tags
    WHERE
      tags.name ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of tags.');
  }
}


export async function fetchFilteredTags(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const tags = await sql<Tag>`
      SELECT
        tags.id,
        tags.name
      FROM tags
      WHERE
        tags.name ILIKE ${`%${query}%`}
      ORDER BY UPPER(tags.name)
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset};
    `;

    return tags.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch tags.');
  }
}

