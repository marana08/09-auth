import { FormValues } from '@/types/note';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const initialDraft: FormValues = {
    title: '',
    content: '',
    tag: 'Todo',
};

interface NoteStore {
    draft: FormValues;
    setDraft: (note: FormValues) => void;
    clearDraft: () => void;
}

export const useNoteStore = create<NoteStore>()(
    persist(
        set => ({
            draft: initialDraft,
            setDraft: (newNote: FormValues) => set({ draft: newNote }),
            clearDraft: () => set({ draft: initialDraft }),
        }),
        {
            name: 'note',
        }
    )
);
