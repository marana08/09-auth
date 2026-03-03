'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import css from './AuthNavigation.module.css';
import { useLogin } from '@/lib/store/authStore';

export default function AuthNavigation() {
    const router = useRouter();
    const { isAuthenticated, user, clearIsAuthenticated } = useLogin();

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include', 
            });
        } catch (err) {
            console.error('Logout failed', err);
        } finally {
            clearIsAuthenticated();
            router.push('/sign-in');
        }
    };

    // Якщо користувач авторизований
    if (isAuthenticated) {
        return (
            <>
                <li className={css.navigationItem}>
                    <Link href="/profile" prefetch={false} className={css.navigationLink}>
                        Profile
                    </Link>
                </li>

                <li className={css.navigationItem}>
                    {user.email && <span className={css.userEmail}>{user.email}</span>}
                    <button onClick={handleLogout} className={css.logoutButton}>
                        Logout
                    </button>
                </li>
            </>
        );
    }

    // Якщо користувач не авторизований
    return (
        <>
            <li className={css.navigationItem}>
                <Link href="/sign-in" prefetch={false} className={css.navigationLink}>
                    Login
                </Link>
            </li>

            <li className={css.navigationItem}>
                <Link href="/sign-up" prefetch={false} className={css.navigationLink}>
                    Sign up
                </Link>
            </li>
        </>
    );
}
