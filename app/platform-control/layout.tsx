import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Platform Control | TF1 Sports Platform',
    description: 'Restricted Access Only',
    robots: 'noindex, nofollow',
};

export default function PlatformControlLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-900 text-white">
            {children}
        </div>
    );
}
