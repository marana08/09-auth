import axios from 'axios';
import { type Note, type NewNote, type FetchTagNote } from '@/types/note';

interface Answer {
  notes: Note[];
  totalPages: number;
}

const BASE_URL = 'https://notehub-public.goit.study/api';
const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${token}`,
  },
  proxy: false, 
});

export async function fetchFilterNotes(
  tag: FetchTagNote,
  page: number,
  search: string
): Promise<Answer> {
  const params: Record<string, string | number> = {
    page,
    perPage: 12,
  };

  if (tag !== 'all') {
    params.tag = tag;
  }

  if (search) {
    params.search = search;
  }

  const res = await api.get<Answer>('/notes', { params });

  return res.data;
}

export async function createNote(note: NewNote): Promise<Note> {
  const res = await api.post<Note>('/notes', note);
  return res.data;
}

export async function deleteNote(id: string): Promise<Note> {
  const res = await api.delete<Note>(`/notes/${id}`);
  return res.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const res = await api.get<Note>(`/notes/${id}`);
  return res.data;
}
