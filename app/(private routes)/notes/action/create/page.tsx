import NoteForm from "@/components/NoteForm/NoteForm";
import css from "./page.module.css";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Create Note",
    description:
        "Create a new note in NoteHub. Add title, content and tag to organize your tasks and ideas.",

    openGraph: {
        title: "Create Note",
        description: "Create a new note in NoteHub and organize your tasks easily.",
        url: "https://09-auth-snowy-six.vercel.app/notes/action/create",
        images: [
            {
                url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
                width: 1200,
                height: 630,
                alt: "Create note page",
            },
        ],
    },
};

export default function CreateNote() {
    return (
        <main className={css.main}>
            <div className={css.container}>
                <h1 className={css.title}>Create note</h1>
                <NoteForm />
            </div>
        </main>
    );
}







