import { cookies } from 'next/headers';
import { nextServer } from './api';
import type { AxiosResponse } from 'axios';

import type { User } from '@/types/user';
import { type Note, type FetchTagNote } from '@/types/note';

interface Answer {
    notes: Note[];
    totalPages: number;
}

// Helpers

async function getCookieHeader(): Promise<string> {
    const cookieStore = await cookies();

    return cookieStore
        .getAll()
        .map(({ name, value }) => `${name}=${value}`)
        .join('; ');
}

// Session 

export async function checkSession(): Promise<AxiosResponse> {
    const res = await nextServer.get('/auth/session', {
        headers: {
            Cookie: await getCookieHeader(),
        },
    });

    // Повертаємо повний AxiosResponse,
    // щоб middleware мав доступ до headers (set-cookie)
    return res;
}

// Notes

export async function fetchNotes(
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

    const res = await nextServer.get<Answer>('/notes', {
        params,
        headers: {
            Cookie: await getCookieHeader(),
        },
    });

    return res.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
    const res = await nextServer.get<Note>(`/notes/${id}`, {
        headers: {
            Cookie: await getCookieHeader(),
        },
    });

    return res.data;
}

// User

export async function getMe(): Promise<User> {
    const res = await nextServer.get<User>('/users/me', {
        headers: {
            Cookie: await getCookieHeader(),
        },
    });

    return res.data;
}