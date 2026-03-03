import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from '@tanstack/react-query';

import type { Metadata } from 'next';
import type { FetchTagNote } from '@/types/note';

import NotesClient from './Notes.client';
import { fetchNotes } from '@/lib/api/serverApi';

import css from './page.module.css';

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

  const rawTag = slug[0];
  const tagLabel = rawTag === 'all' ? 'all notes' : rawTag;
  const formattedTag = tagLabel.charAt(0).toUpperCase() + tagLabel.slice(1);

  return {
    title: `${formattedTag} Notes`,
    description: `Page for ${formattedTag.toLowerCase()} tag`,
    openGraph: {
      type: 'website',
      title: `${formattedTag} Notes`,
      description: `Page for ${formattedTag.toLowerCase()} tag`,
      url: 'https://09-auth-snowy-six.vercel.app',
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
  const queryClient = new QueryClient();

  const { slug } = await params;
  const tag = slug[0] as FetchTagNote;

  await queryClient.prefetchQuery({
    queryKey: ['notes', tag, 1, ''],
    queryFn: () => fetchNotes(tag, 1, ''),
  });

  return (
    <main className={css.main}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <NotesClient tag={tag} />
      </HydrationBoundary>
    </main>
  );
}
