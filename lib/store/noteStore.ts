import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type NewNote } from '@/types/note';

interface NoteDraftState {
    draft: NewNote;
    setDraft: (note: NewNote) => void;
    clearDraft: () => void;
}

const initialDraft: NewNote = {
    title: '',
    content: '',
    tag: 'Todo',
};

export const useDraft = create<NoteDraftState>()(
    persist(
        (set) => ({
            draft: initialDraft,

            setDraft: (note) =>
                set(() => ({
                    draft: note,
                })),

            clearDraft: () =>
                set(() => ({
                    draft: initialDraft,
                })),
        }),
        {
            name: 'note-draft',
            partialize: (state) => ({
                draft: state.draft,
            }),
        }
    )
);