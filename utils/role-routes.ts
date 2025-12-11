import { UserRole } from "@/types/auth";

export const ROLE_DASHBOARD_ROUTES: Record<UserRole, string> = {
    player: '/dashboard/player',
    coach: '/dashboard/coach',
    club: '/dashboard/club',
    specialist: '/dashboard/specialist',
    administrator: '/dashboard/administrator',
    'age-group-supervisor': '/dashboard/age-group-supervisor',
    'sports-director': '/dashboard/sports-director',
    'executive-director': '/dashboard/executive-director',
    secretary: '/dashboard/secretary',
    'sports-administrator': '/dashboard/sports-admin',
    team: '/dashboard/team'
};

export function getDashboardRoute(role: UserRole): string {
    return ROLE_DASHBOARD_ROUTES[role] || '/dashboard';
}

export const AUTH_PAGES = [
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/verify-email',
    '/verify-email-notice',

];

export function isAuthPage(path: string): boolean {
    return AUTH_PAGES.some(page => path.includes(page));
}
