import { Metadata } from 'next';
import Image from 'next/image';
import css from './ProfilePage.module.css';
import { getMe } from '@/lib/api/serverApi';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Profile',
    description: 'Manage your personal profile in NoteHub.',
    openGraph: {
        type: 'website',
        url: '',
        title: 'Profile',
        description: 'Access and manage your NoteHub profile.',
        images: [
            {
                url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
                width: 1200,
                height: 630,
                alt: 'NoteHub profile page preview',
            },
        ],
    },
};

export default async function Profile() {
    const userData = await getMe();

    return (
        <main className={css.mainContent}>
            <div className={css.profileCard}>
                <div className={css.header}>
                    <h1 className={css.formTitle}>Profile Page</h1>
                    <Link href={'/profile/edit'} className={css.editProfileButton}>
                        Edit Profile
                    </Link>
                </div>
                <div className={css.avatarWrapper}>
                    <Image
                        src={userData.avatar}
                        alt="User Avatar"
                        width={120}
                        height={120}
                        className={css.avatar}
                    />
                </div>
                <div className={css.profileInfo}>
                    <p>Username: {userData.username}</p>
                    <p>Email: {userData.email}</p>
                </div>
            </div>
        </main>
    );
}
