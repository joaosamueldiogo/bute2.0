'use client';

import Link from 'next/link';
import {
  InformationCircleIcon,
  MusicalNoteIcon,
  PlusIcon,
  TagIcon,
  UserGroupIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';
import { createArtist, createSong, createTag, updateArtist, updateSong, updateTag } from '@/lib/actions'; // Adjust the import according to your setup
import { Button } from '../button';
import { Artist, Song, SongForm, Tag } from '@/lib/database/definitions';
import Uploader from '@/components/Uploader';
import { useEffect, useState } from 'react';
import MultiSelect from './multiselect';
import { fetchFilteredSongs } from '@/lib/database/data';


export default function Form({ song, artists, tags }: { song?: SongForm, artists: Artist[], tags:Tag[]}) {

  const [file, setFile] = useState<File | null>(null);
  const [selectedArtists, setSelectedArtists] = useState<Artist[]>([]);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);


  const handleSubmit = async (formData: FormData) => {
    if (file !== null) {
      formData.append('file', file);
    }
    // Convert selected tags and artists to JSON arrays
    const tagsArray = selectedTags.map(tag => tag.name); // Assuming Tag has an id property
    const artistsArray = selectedArtists.map(artist => artist.name); // Assuming Artist has an id property

    // Append tags and artists as JSON strings
    formData.append('tags', JSON.stringify(tagsArray));
    formData.append('artists', JSON.stringify(artistsArray));

    if(song){
      await updateSong(song.id, formData);
    }else{
      await createSong(formData);
    }
  };
  useEffect(() => {
    if (song) {
      setSelectedArtists(song.artists || []);
      setSelectedTags(song.tags || []);
    }
  }, [song]);
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      handleSubmit(formData);
    }}>
      <div className="rounded-md bg-surface-400 dark:bg-surface-dark-300 text-text dark:text-text-dark p-4 md:p-6 mt-8">
        {/* Name */}
        <div className="mb-4">
          <label htmlFor="title" className="mb-2 block text-xl font-semibold">
            Nome
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="title"
                name="title"
                type="text"
                placeholder="Nome da música"
                className="peer block w-full rounded-md border border-surface-200 dark:border-surface-dark-500 bg-surface-600 dark:bg-surface-dark-300 py-2 pl-10 text-sm outline-2 placeholder:text-placeholder dark:placeholder:text-placeholder-dark"
                defaultValue={song?.title}
                required
              />
              <MusicalNoteIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 icon" />
            </div>
          </div>
        </div>  

        {/* Tags */}
        <div className='mb-4'>
          <label htmlFor="tags" className="mb-2 block text-xl font-semibold">
            Tags
          </label>
          <MultiSelect
            options={tags}
            selectedOptions={selectedTags}
            onChange={setSelectedTags}
            icon={TagIcon}
          />
        </div>
        {/* <div className="mb-4">
          <label htmlFor="tags" className="mb-2 block text-xl font-semibold">
            Tags
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="tags"
                name="tags"
                type="text"
                placeholder="Descrição da música"
                className="peer block w-full rounded-md border border-surface-200 dark:border-surface-dark-500 bg-surface-600 dark:bg-surface-dark-300 py-2 pl-10 text-sm outline-2 placeholder:text-placeholder dark:placeholder:text-placeholder-dark"
                defaultValue={song?} ///CHANGE
                required
              />
              <InformationCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 icon" />
            </div>
          </div>
        </div>   */}

        <div className='mb-4'>
          <label htmlFor="artists" className="mb-2 block text-xl font-semibold">
            Autores
          </label>
          <MultiSelect
            options={artists}
            selectedOptions={selectedArtists}
            onChange={setSelectedArtists} 
            icon={UserGroupIcon}          
          />
        </div>

          {/* <div className="mt-4">
        <strong>Selected Options:</strong>
        {selectedOptions.length === 0 ? (
          <span className="text-gray-500"> None</span>
        ) : (
          <ul>
            {selectedOptions.map(option => (
              <li key={option.value}>{option.label}</li>
            ))}
          </ul>
        )}
        </div> */}

        <div className="mb-4">
          <label htmlFor="file" className="mb-2 block text-xl font-semibold">
            Upload File
          </label>
          <div className="relative mt-2 rounded-md">
            <Uploader onFileSelect={setFile} />
          </div>
        </div>
      </div>
      {/* Buttons */}
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/songs"
          className="flex h-10 items-center rounded-lg bg-surface-500 dark:bg-surface-dark-300 px-4 text-sm font-medium text-text dark:text-text-dark transition-colors hover:bg-surface-600 dark:hover:bg-surface-dark-400"
        >
          Cancel
        </Link>
        <Button type="submit">{song ? "Guardar" : "Adicionar"}</Button>
      </div>
    </form>
  );
}

export function ArtistForm({ artist }: { artist?: Artist }){
  const action = artist ? updateArtist.bind(null, artist.id) : createArtist;
  return (
    <form action={action}>
      <div className="rounded-md bg-surface-400 dark:bg-surface-dark-300 text-text dark:text-text-dark p-4 md:p-6 mt-8">
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-xl font-semibold">
            Nome
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Nome do Autor"
                className="peer block w-full rounded-md border border-surface-200 dark:border-surface-dark-500 bg-surface-600 dark:bg-surface-dark-300 py-2 pl-10 text-sm outline-2 placeholder:text-placeholder dark:placeholder:text-placeholder-dark"
                defaultValue={artist?.name}
                required
              />
              <MusicalNoteIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 icon" />
            </div>
          </div>
        </div>  
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/artists"
          className="flex h-10 items-center rounded-lg bg-surface-500 dark:bg-surface-dark-300 px-4 text-sm font-medium text-text dark:text-text-dark transition-colors hover:bg-surface-600 dark:hover:bg-surface-dark-400"
        >
          Cancel
        </Link>
        <Button type="submit">{artist ? "Guardar" : "Adicionar"}</Button>
      </div>
    </form>
  );
}


export function TagForm({ tag }: { tag?: Tag }){
  const action = tag ? updateTag.bind(null, tag.id) : createTag;
  return (
    <form action={action}>
      <div className="rounded-md bg-surface-400 dark:bg-surface-dark-300 text-text dark:text-text-dark p-4 md:p-6 mt-8">
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-xl font-semibold">
            Nome
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Nome da Tag"
                className="peer block w-full rounded-md border border-surface-200 dark:border-surface-dark-500 bg-surface-600 dark:bg-surface-dark-300 py-2 pl-10 text-sm outline-2 placeholder:text-placeholder dark:placeholder:text-placeholder-dark"
                defaultValue={tag?.name}
                required
              />
              <MusicalNoteIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 icon" />
            </div>
          </div>
        </div>  
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/artists"
          className="flex h-10 items-center rounded-lg bg-surface-500 dark:bg-surface-dark-300 px-4 text-sm font-medium text-text dark:text-text-dark transition-colors hover:bg-surface-600 dark:hover:bg-surface-dark-400"
        >
          Cancel
        </Link>
        <Button type="submit">{tag ? "Guardar" : "Adicionar"}</Button>
      </div>
    </form>
  );
}

export async function ListForm() {
  // State to keep track of selected song IDs
  const [selectedSongs, setSelectedSongs] = useState<string[]>([]);
  
  // State to store the submitted list of songs
  const [songList, setSongList] = useState<{ id: string; title: string }[]>([]);

  const availableSongs = await fetchFilteredSongs('', 1);
  // Handle song selection from the form
  const handleSongChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(event.target.selectedOptions).map(
      (option) => option.value
    );
    setSelectedSongs(selectedOptions); // Update the selected songs
  };

  // Handle form submission
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    // Get the selected songs' details based on their IDs
    const selectedSongDetails = availableSongs.filter(song =>
      selectedSongs.includes(song.id)
    );

    // Set the songList state to store the selected songs
    setSongList(selectedSongDetails);
  };

  return (
    <div className="w-full p-4">
      <form onSubmit={handleSubmit} className="mb-4">
        <label htmlFor="song-select" className="block mb-2">
          Select 2 or more songs:
        </label>
        <select
          id="song-select"
          multiple
          value={selectedSongs}
          onChange={handleSongChange}
          className="w-full p-2 border rounded"
        >
          {availableSongs.map((song) => (
            <option key={song.id} value={song.id}>
              {song.title}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="mt-4 p-2 bg-blue-500 text-white rounded"
          disabled={selectedSongs.length < 2} // Disable if less than 2 songs are selected
        >
          Create Song List
        </button>
      </form>

      {/* Display the selected list of songs */}
      {songList.length > 0 && (
        <div>
          <h3 className="text-lg font-bold">Your Selected Songs:</h3>
          <ul className="list-disc ml-4 mt-2">
            {songList.map((song) => (
              <li key={song.id}>{song.title}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}