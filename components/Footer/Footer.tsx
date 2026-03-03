import css from './Footer.module.css';

import Link from 'next/link';

export default function Footer() {
    return (
        <footer className={css.footer}>
            <div className={css.content}>
                <p>© {new Date().getFullYear()} NoteHub. All rights reserved.</p>
                <div className={css.wrap}>
                    <p>Developer: Melen Mariana</p>
                    <p>
                        Contact us:
                        <Link
                            href="https://www.linkedin.com/in/mariana-melen"
                            target="_blank"
                        >
                            Linkedin
                        </Link>
                    </p>
                </div>
            </div>
        </footer>
    );
}
