'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useTranslation } from '@/app/i18n/client';
import { languages } from '@/app/i18n/settings';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher({ lng }: { lng: string }) {
    const { i18n } = useTranslation(lng, 'translation');
    const router = useRouter();
    const pathname = usePathname();

    const handleLanguageChange = (newLng: string) => {
        if (!pathname) return;
        const segments = pathname.split('/');
        segments[1] = newLng;
        const newPath = segments.join('/');
        router.push(newPath);
    };

    return (
        <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <Select value={i18n.resolvedLanguage} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-[100px] h-8 text-xs">
                    <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                    {languages.map((l) => (
                        <SelectItem key={l} value={l} className="text-xs">
                            {l === 'en' ? 'English' : '日本語'}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
