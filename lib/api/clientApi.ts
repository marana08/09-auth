'use client';

import { api } from '@/app/api/api';
import { type Note, type FetchTagNote, NewNote } from '@/types/note';
import { type User, type UserReg } from '@/types/user';

interface Answer {
    notes: Note[];
    totalPages: number;
}

interface UpdateUser {
    email: string;
    username: string;
}

// Notes

export async function fetchNotes(
    tag: FetchTagNote,
    page: number,
    search: string
): Promise<Answer> {
    const params: Record<string, string | number> = {
        page,
        perPage: 10,
    };

    if (tag !== 'all') params.tag = tag;
    if (search) params.search = search;

    const res = await api.get<Answer>('/notes', { params });
    return res.data;
}
export async function createNote(note: NewNote): Promise<Note> {
    const res = await api.post<Note>(`/notes`, note);
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

//Auth

export async function register(data: UserReg): Promise<User> {
    const res = await api.post<User>('/auth/register', data);
    return res.data;
}

export async function login(data: UserReg): Promise<User> {
    const res = await api.post<User>('/auth/login', data);
    return res.data;
}

export async function logout() {
    const res = await api.post('/auth/logout');
    return res.data;
}

export async function checkSession() {
    const res = await api.get('/auth/session');
    return res.data;
}

//User

export async function getMe(): Promise<User> {
    const res = await api.get<User>("/users/me");
    return res.data;
}

export async function updateMe(data: UpdateUser): Promise<User> {
    const res = await api.patch<User>("/users/me", data);
    return res.data;
}
