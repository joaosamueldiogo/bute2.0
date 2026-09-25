import Breadcrumbs from '@/components/ui/songs/breadcrumbs';
import Form, { ListForm } from '@/components/ui/songs/form';

 
export default async function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Listas', href: '/lists' },
          {
            label: 'Adicionar Lista',
            href: '/lists/create',
            active: true,
          },
        ]}
      />
      <ListForm />
    </main>
  );
}