import { fetchArtistById, fetchSongById } from '@/lib/database/data';
import Breadcrumbs from '@/components/ui/songs/breadcrumbs';

export default async function Page({ params }: { params: { id: string } }) {
  const artist = await fetchArtistById(params.id);

  return (
    <section className="flex flex-col items-start gap-4">
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Listas', href: '/lists' },
          {
            label: artist.name,
            href: `/lists/${artist.id}`,
            active: true,
          },
        ]}
      />
    </section>
  );
}
