import { FormValues, Note } from "@/types/note";
import { nextServer } from "./api";
import { User } from "@/types/user";

interface FetchNotesResponse {
    notes: Note[];
    totalPages: number;
}

export interface FetchNotesParams {
    page: number;
    perPage: number;
    search?: string;
    tag?: string;
}

export interface UserRegisterData {
    email: string;
    password: string;
}

interface CheckSessionReq {
    success: boolean;
}

interface UpdateUserData {
    username: string;
}

export async function fetchNotes(
    params: FetchNotesParams,
): Promise<FetchNotesResponse> {
    const response = await nextServer.get<FetchNotesResponse>("/notes", {
        params,
    });
    return response.data;
}

export async function fetchNoteById(id: Note["id"]) {
    const response = await nextServer.get<Note>(`/notes/${id}`);

    return response.data;
}

export async function createNote(newTask: FormValues) {
    const response = await nextServer.post<Note>("/notes", newTask);
    return response.data;
}

export async function deleteNote(id: string) {
    const response = await nextServer.delete<Note>(`/notes/${id}`);
    return response.data;
}

export async function register(data: UserRegisterData) {
    const response = await nextServer.post<User>("/auth/register", data);
    return response.data;
}

export async function login(data: UserRegisterData) {
    const response = await nextServer.post<User>("/auth/login", data);
    return response.data;
}

export async function getMe() {
    const response = await nextServer.get<User>("/users/me");
    return response.data;
}

export async function checkSession() {
    const res = await nextServer.get<CheckSessionReq>("/auth/session");
    return res.data;
}

export async function logout() {
    const res = await nextServer.post("/auth/logout");
    return res.data;
}

export async function updateMe(data: UpdateUserData) {
    const res = await nextServer.patch<User>("/users/me", data);
    return res.data;
}
