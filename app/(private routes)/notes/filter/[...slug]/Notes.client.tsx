'use client';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import css from './page.module.css';
import { useState } from 'react';
import Pagination from '@/components/Pagination/Pagination';
import SearchBox from '@/components/SearchBox/SearchBox';
import { useDebouncedCallback } from 'use-debounce';
import NoteList from '@/components/NoteList/NoteList';
import Link from 'next/link';
import { fetchNotes } from '@/lib/api/clientApi';

interface NotesClientProps {
  tag?: string;
}

export default function NotesClient({ tag }: NotesClientProps) {
  const [page, setPage] = useState(1);
  const [inputValue, setInputValue] = useState('');
  const [search, setSearch] = useState('');
  const handleDebouncedSearch = useDebouncedCallback(value => {
    setSearch(value);
    setPage(1);
  }, 500);

  const { data } = useQuery({
    queryKey: ['notes', { page, search, tag }],
    queryFn: () =>
      fetchNotes({
        page,
        search,
        tag,
        perPage: 12,
      }),
    placeholderData: keepPreviousData,
  });

  return (
    <>
      <div className={css.toolbar}>
        <SearchBox
          value={inputValue}
          onChange={value => {
            setInputValue(value);
            handleDebouncedSearch(value);
          }}
        />
        {data && data.totalPages > 1 && (
          <Pagination
            totalPage={data.totalPages}
            page={page}
            onPageSelect={setPage}
          />
        )}

        <Link href="/notes/action/create">Create note +</Link>
      </div>
      {data && data.notes.length > 0 && <NoteList notes={data.notes} />}
    </>
  );
}
