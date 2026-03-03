'use client';

import { useRouter } from 'next/navigation';
import css from './page.module.css';
import { useLogin } from '@/lib/store/authStore';
import { useState } from 'react';
import { UserReg } from '@/types/user';
import { getMe, login } from '@/lib/api/clientApi';
import { AxiosError } from 'axios';
import Modal from '@/components/Modal/Modal';

export default function Login() {
    const router = useRouter();
    const setUser = useLogin(state => state.setUser);
    const [isModal, setIsModal] = useState(false);
    const [mess, setMess] = useState('');

    function closeModal() {
        setIsModal(false);
        router.push('/sign-in');
    }

    async function handleSubmit(fotmData: FormData) {
        // очищаємо попередній стан
        setMess('');
        setIsModal(false);

        const data: UserReg = {
            email: fotmData.get('email') as string,
            password: fotmData.get('password') as string,
        };
        try {
            // 1️⃣ логін (сервер встановлює cookie)
            await login(data);

            // 2️⃣ отримуємо поточного користувача
            const user = await getMe();

            // 3️⃣ зберігаємо у Zustand
            setUser(user);

            // 4️⃣ редірект
            router.push('/profile');
        } catch (error) {
            if (error instanceof AxiosError) {
                const message =
                    error.response?.data?.response?.message ||
                    error.response?.data?.message ||
                    'Authentication failed';

                if (message === 'Invalid credentials') {
                    setIsModal(true);
                }
                setMess(message);
            } else {
                setMess('An unexpected error occurred. Please try again.');
            }
        }
    }
    return (
        <main className={css.mainContent}>
            <form className={css.form} action={handleSubmit}>
                <h1 className={css.formTitle}>Sign in</h1>

                <div className={css.formGroup}>
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        className={css.input}
                        required
                    />
                </div>

                <div className={css.formGroup}>
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        className={css.input}
                        required
                        minLength={6}
                    />
                </div>

                <div className={css.actions}>
                    <button type="submit" className={css.submitButton}>
                        Log in
                    </button>
                </div>

                {mess && <p className={css.error}>{mess}</p>}

                {isModal && (
                    <Modal onClose={closeModal}>
                        <p>Invalid credentials or user not found.</p>
                    </Modal>
                )}
            </form>
        </main>
    );
}
