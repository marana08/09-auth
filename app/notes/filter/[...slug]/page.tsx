import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from '@tanstack/react-query';

import { FetchTagNote } from '@/types/note';
import { fetchFilterNotes } from '@/lib/api';
import NotesClient from './Notes.client';

import css from './page.module.css';
import { Metadata } from 'next';

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
  const tag = slug[0] === 'all' ? 'all notes' : slug[0];
  const tagUrl = slug[0] === 'all' ? undefined : slug[0];
  const formattedTag = tag.charAt(0).toUpperCase() + tag.slice(1);

  return {
    title: `${formattedTag} Notes`,
    description: `Page for ${formattedTag.toLowerCase()} tag`,
    openGraph: {
      type: 'website',
      title: `${formattedTag} Notes`,
      description: `Page for ${formattedTag.toLowerCase()} tag`,
      url: 'https://08-zustand-weld-eight.vercel.app',
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
    queryFn: () => fetchFilterNotes(tag, 1, ''),
  });

  return (
    <main className={css.main}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <NotesClient tag={tag} />
      </HydrationBoundary>
    </main>
  );
}
