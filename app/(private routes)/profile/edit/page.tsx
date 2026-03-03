"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import css from "./EditProfilePage.module.css";

import { useLogin } from "@/lib/store/authStore";
import { updateMe } from "@/lib/api/clientApi";

export default function EditProfilePage() {
    const user = useLogin((state) => state.user);
    const setUser = useLogin((state) => state.setUser);
    const router = useRouter();

    const [username, setUsername] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Синхронізація локального стану з користувачем
    useEffect(() => {
        if (user?.username) {
            setUsername(user.username);
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!user) return;

        const trimmedUsername = username.trim();

        if (!trimmedUsername) {
            setError("Username cannot be empty");
            return;
        }

        if (trimmedUsername === user.username) {
            router.push("/profile");
            return;
        }

        try {
            setIsSubmitting(true);
            setError(null);

            const updatedUser = await updateMe({
                username: trimmedUsername,
                email: user.email,
            });

            setUser(updatedUser);
            router.push("/profile");
        } catch (err) {
            console.error("Update failed", err);
            setError("Failed to update profile. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        router.push("/profile");
    };

    if (!user) {
        return null; 
    }

    return (
        <main className={css.mainContent}>
            <div className={css.profileCard}>
                <h1 className={css.formTitle}>Edit Profile</h1>

                {user.avatar && (
                    <Image
                        src={user.avatar}
                        alt="User Avatar"
                        width={120}
                        height={120}
                        className={css.avatar}
                    />
                )}

                <form className={css.profileInfo} onSubmit={handleSubmit}>
                    <div className={css.usernameWrapper}>
                        <label htmlFor="username">Username:</label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className={css.input}
                        />
                    </div>

                    <p>Email: {user.email}</p>

                    {error && <p className={css.error}>{error}</p>}

                    <div className={css.actions}>
                        <button
                            type="submit"
                            className={css.saveButton}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Saving..." : "Save"}
                        </button>

                        <button
                            type="button"
                            className={css.cancelButton}
                            onClick={handleCancel}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}