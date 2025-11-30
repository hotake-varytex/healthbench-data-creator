import { dir } from 'i18next';
import { languages } from '../i18n/settings';
import { Inter } from 'next/font/google';
import '../globals.css';
import { getTranslation } from '../i18n';
import LanguageSwitcher from '@/components/language-switcher';

const inter = Inter({ subsets: ['latin'] });

export async function generateStaticParams() {
    return languages.map((lng) => ({ lng }));
}

export const metadata = {
    title: 'HealthBench Data Creator',
    description:
        'A modern web tool for creating, editing, and validating OpenAI HealthBench-compliant datasets',
};

export default async function RootLayout({
    children,
    params: { lng },
}: {
    children: React.ReactNode;
    params: { lng: string };
}) {
    const { t } = await getTranslation(lng, 'translation');

    return (
        <html lang={lng} dir={dir(lng)}>
            <body className={inter.className}>
                <div className="min-h-screen bg-background">
                    <header className="border-b">
                        <div className="container mx-auto px-4 py-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h1 className="text-xl font-bold">{t('title')}</h1>
                                        <p className="text-sm text-muted-foreground">
                                            {t('description')}
                                        </p>
                                    </div>
                                </div>
                                <nav className="flex items-center gap-4">
                                    <LanguageSwitcher lng={lng} />
                                    <a
                                        href="https://github.com/openai/simple-evals"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-muted-foreground hover:text-foreground"
                                    >
                                        simple-evals
                                    </a>
                                    <a
                                        href="https://github.com/hotake-varytex/healthbench-data-creator"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-muted-foreground hover:text-foreground"
                                    >
                                        GitHub
                                    </a>
                                </nav>
                            </div>
                        </div>
                    </header>
                    <main>{children}</main>
                    <footer className="border-t py-6 mt-12">
                        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
                            <p>
                                HealthBench Data Creator | Open Source | MIT License |{' '}
                                <a
                                    href="https://github.com/hotake-varytex/healthbench-data-creator"
                                    className="underline hover:text-foreground"
                                >
                                    Contribute on GitHub
                                </a>
                            </p>
                        </div>
                    </footer>
                </div>
            </body>
        </html>
    );
}
