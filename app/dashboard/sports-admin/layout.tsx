import { Metadata } from 'next';
import SportsAdminSidebar from '@/components/dashboards/SportsAdminSidebar';

export const metadata: Metadata = {
    title: 'Sports Admin Dashboard | TF1',
    description: 'Administration panel',
};

export default function SportsAdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-slate-50">
            <SportsAdminSidebar />
            <main className="flex-1 p-8 overflow-x-hidden">
                {children}
            </main>
        </div>
    );
}
