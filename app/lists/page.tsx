import PageBlueprint from "@/components/ui/PageBlueprint";

export default async function Home({
    searchParams,
  }: {
    searchParams?: {
      query?: string;
      page?: string;
    };
  }) {

  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  // const totalPages = await fetchSongsPages(query);

  // const songs = await fetchFilteredSongs(query, currentPage);

  return (
    <PageBlueprint query={query} currentPage={currentPage} totalPages={1} title={"Listas"} entityType={"lists"} create={true} /> 
  );
}