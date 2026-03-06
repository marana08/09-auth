'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Modal from '@/components/Modal/Modal';
import css from './NotePreview.module.css';
import { fetchNoteById } from '@/lib/api/clientApi';

export default function NotePreviewClient() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();

    const { data, isError, isLoading } = useQuery({
        queryKey: ['note', id],
        queryFn: () => fetchNoteById(id),
        refetchOnMount: false,
    });

    return (
        <Modal onCloseModal={() => router.back()}>
            {isLoading && <p>Loading, please wait...</p>}
            {isError && <p>Something went wrong.</p>}
            {data && (
                <div className={css.container}>
                    <div className={css.item}>
                        <div className={css.header}>
                            <h2>{data.title}</h2>
                        </div>
                        <p className={css.tag}>{data.tag}</p>
                        <p className={css.content}>{data.content}</p>
                        <p className={css.date}>{data.createdAt}</p>
                    </div>
                </div>
            )}
        </Modal>
    );
}
