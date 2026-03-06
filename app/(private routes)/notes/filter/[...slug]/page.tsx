import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import NotesClient from './Notes.client';
import { Metadata } from 'next';
import { fetchNotes } from '@/lib/api/serverApi';

interface NotesProps {
  params: Promise<{ slug: string[] }>;
}

interface MetadataProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({
  params,
}: MetadataProps): Promise<Metadata> {
  const { slug } = await params;
  const tag = slug[0] === 'all' ? 'all' : slug[0];
  const tagUrl = slug[0] === 'all' ? undefined : slug[0];
  const formattedTag = tag.charAt(0).toUpperCase() + tag.slice(1);

  return {
    title: `${formattedTag} Notes`,
    description: `Browse ${formattedTag.toLowerCase()} notes in NoteHub. Stay organized and manage your tasks efficiently.`,
    openGraph: {
      type: 'website',
      title: `${formattedTag} Notes`,
      description: `Browse ${formattedTag.toLowerCase()} notes in NoteHub. Stay organized and manage your tasks efficiently.`,
      url: `08-zustand-weld-eight.vercel.app/notes/filter/${tagUrl}`,
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: `${formattedTag} Notes - NoteHub`,
        },
      ],
    },
  };
}

export default async function Notes({ params }: NotesProps) {
  const { slug } = await params;
  const tag = slug[0] === 'all' ? undefined : slug[0];

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['notes', { page: 1 }, { search: '' }, { tag }],
    queryFn: () => fetchNotes({ page: 1, search: '', tag, perPage: 12 }),
  });
  return (
    <main>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <NotesClient tag={tag} />
      </HydrationBoundary>
    </main>
  );
}
