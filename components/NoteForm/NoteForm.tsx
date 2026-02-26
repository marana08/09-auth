'use client';

import css from './NoteForm.module.css';

import { useId } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createNote } from '@/lib/api';
import { type NewNote } from '@/types/note';
import { useDraft } from '@/lib/store/noteStore';

type noteTag = 'Todo' | 'Work' | 'Personal' | 'Meeting' | 'Shopping';

export default function NoteForm() {
    const id = useId();
    const router = useRouter();
    const queryClient = useQueryClient();

    const { draft, setDraft, clearDraft } = useDraft();

    const createMutation = useMutation({
        mutationFn: async (data: NewNote) => {
            return await createNote(data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notes'] });
            clearDraft(); // очищаємо тільки після успішного створення
            router.back();
        },
    });

    function handleChange(
        ev: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) {
        const updatedDraft: NewNote = {
            ...draft,
            [ev.target.name]: ev.target.value,
        };

        setDraft(updatedDraft);
    }

    function handleSubmit(formData: FormData) {
        const newNote: NewNote = {
            title: formData.get('title') as string,
            content: formData.get('content') as string,
            tag: formData.get('tag') as noteTag,
        };

        createMutation.mutate(newNote);
    }

    function cancelForm() {
        // draft НЕ очищається
        router.back();
    }

    return (
        <form className={css.form} action={handleSubmit}>
            <div className={css.formGroup}>
                <label htmlFor={`${id}-title`}>Title</label>
                <input
                    type="text"
                    id={`${id}-title`}
                    name="title"
                    className={css.input}
                    required
                    onChange={handleChange}
                    defaultValue={draft.title}
                />
            </div>

            <div className={css.formGroup}>
                <label htmlFor={`${id}-content`}>Content</label>
                <textarea
                    id={`${id}-content`}
                    name="content"
                    className={css.textarea}
                    rows={8}
                    onChange={handleChange}
                    defaultValue={draft.content}
                />
            </div>

            <div className={css.formGroup}>
                <label htmlFor={`${id}-tag`}>Tag</label>
                <select
                    id={`${id}-tag`}
                    name="tag"
                    className={css.select}
                    onChange={handleChange}
                    defaultValue={draft.tag}
                >
                    <option value="Todo">Todo</option>
                    <option value="Work">Work</option>
                    <option value="Personal">Personal</option>
                    <option value="Meeting">Meeting</option>
                    <option value="Shopping">Shopping</option>
                </select>
            </div>

            <div className={css.actions}>
                <button
                    type="button"
                    onClick={cancelForm}
                    className={css.cancelButton}
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    className={css.submitButton}
                >
                    Create note
                </button>
            </div>
        </form>
    );
}