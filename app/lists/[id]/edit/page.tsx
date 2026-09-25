import { fetchArtistById, fetchSongById } from '@/lib/database/data';
import Breadcrumbs from '@/components/ui/songs/breadcrumbs';
import Form, { ArtistForm } from '@/components/ui/songs/form';
import { notFound } from 'next/navigation';
 
export default async function Page({ params }: { params: { id: string } }) {
    
  const id = params.id;
  const artist = await fetchArtistById(id);
  console.log(artist)
  if(!artist){
    notFound();
  }
  
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Músicas', href: '/songs' },
          {
            label: 'Editar Música',
            href: `/songs/${id}/edit`,
            active: true,
          },
        ]}
      />
      <ArtistForm artist={artist} />
    </main>
  );
}