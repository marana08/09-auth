"use client";

import Image from "next/image";
import css from "./EditProfilePage.module.css";
import { useAuthStore } from "@/lib/store/authStore";
import { useRouter } from "next/navigation";
import { updateMe } from "@/lib/api/clientApi";

export default function Edit() {
    const user = useAuthStore((state) => state.user);
    const setUser = useAuthStore((state) => state.setUser);
    const router = useRouter();

    const handleUpdate = async (formData: FormData) => {
        if (!user) return;

        const username = formData.get("username") as string;

        try {
            const updatedUser = await updateMe({
                username,
            });

            setUser(updatedUser);
            router.push("/profile");
        } catch (error) {
            console.error("Update failed", error);
        }
    };

    const handleCancel = () => {
        router.push("/profile");
    };

    return (
        <main className={css.mainContent}>
            <div className={css.profileCard}>
                <h1 className={css.formTitle}>Edit Profile</h1>

                {user?.avatar && (
                    <Image src={user.avatar} alt="User Avatar" width={120} height={120} />
                )}

                <form className={css.profileInfo} action={handleUpdate}>
                    <div className={css.usernameWrapper}>
                        <label htmlFor="username">Username:</label>
                        <input
                            name="username"
                            defaultValue={user?.username}
                            id="username"
                            type="text"
                            className={css.input}
                        />
                    </div>

                    <p>Email: {user?.email}</p>

                    <div className={css.actions}>
                        <button type="submit" className={css.saveButton}>
                            Save
                        </button>
                        <button
                            type="button"
                            className={css.cancelButton}
                            onClick={handleCancel}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}