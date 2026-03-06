'use client';

import { useRouter } from 'next/navigation';
import css from './NoteForm.module.css';
import { useId } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FormValues, NoteTag } from '@/types/note';
import { useNoteStore } from '@/lib/store/noteStore';
import { createNote } from '@/lib/api/clientApi';

export default function NoteForm() {
    const fieldId = useId();
    const router = useRouter();
    const queryClient = useQueryClient();

    const { draft, setDraft, clearDraft } = useNoteStore();

    const createMutation = useMutation({
        mutationFn: (value: FormValues) => createNote(value),
        onSuccess: () => {
            clearDraft();
            queryClient.invalidateQueries({ queryKey: ['notes'] });
            router.back();
        },
    });

    const handleFormSubmit = (formData: FormData) => {
        const note: FormValues = {
            title: formData.get('title') as string,
            content: formData.get('content') as string,
            tag: formData.get('tag') as FormValues['tag'],
        };

        createMutation.mutate(note);
    };

    return (
        <form className={css.form} action={handleFormSubmit}>
            <div className={css.formGroup}>
                <label htmlFor={`${fieldId}-title`}>Title</label>
                <input
                    id={`${fieldId}-title`}
                    name="title"
                    type="text"
                    className={css.input}
                    value={draft.title}
                    onChange={e => setDraft({ ...draft, title: e.target.value })}
                    required
                />
            </div>

            <div className={css.formGroup}>
                <label htmlFor={`${fieldId}-content`}>Content</label>
                <textarea
                    id={`${fieldId}-content`}
                    name="content"
                    className={css.textarea}
                    rows={8}
                    value={draft.content}
                    onChange={e => setDraft({ ...draft, content: e.target.value })}
                />
            </div>

            <div className={css.formGroup}>
                <label htmlFor={`${fieldId}-tag`}>Tag</label>
                <select
                    id={`${fieldId}-tag`}
                    name="tag"
                    className={css.select}
                    value={draft.tag}
                    onChange={e => setDraft({ ...draft, tag: e.target.value as NoteTag })}
                >
                    <option value="Todo">Todo</option>
                    <option value="Work">Work</option>
                    <option value="Personal">Personal</option>
                    <option value="Meeting">Meeting</option>
                    <option value="Shopping">Shopping</option>
                </select>
            </div>

            <div className={css.actions}>
                <button type="button" className={css.cancelButton} disabled={false}>
                    Cancel
                </button>
                <button
                    type="submit"
                    className={css.submitButton}
                    disabled={createMutation.isPending}
                >
                    Create note
                </button>
            </div>
        </form>
    );
}
