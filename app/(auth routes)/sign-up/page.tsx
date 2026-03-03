'use client';

import { getMe, register } from '@/lib/api/clientApi';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import css from './page.module.css';
import { useLogin } from '@/lib/store/authStore';

export default function SignUpPage() {
    const router = useRouter();
    const setUser = useLogin(state => state.setUser);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        try {
            await register({ email, password });
            const user = await getMe();
            setUser(user);
            router.push('/profile');
        } catch (err: unknown) {
            if (typeof err === 'object' && err !== null && 'response' in err) {
                const axiosError = err as {
                    response?: { data?: { message?: string } };
                };
                setError(axiosError.response?.data?.message || 'Registration failed');
            } else {
                setError('Registration failed');
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <main className={css.mainContent}>
            <h1 className={css.formTitle}>Sign up</h1>

            <form className={css.form} onSubmit={handleSubmit}>
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
                    />
                </div>

                <div className={css.actions}>
                    <button
                        type="submit"
                        className={css.submitButton}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Registering...' : 'Register'}
                    </button>
                </div>

                {error && <p className={css.error}>{error}</p>}
            </form>
        </main>
    );
}
