import { redirect } from 'next/navigation';

/**
 * Root page - Redirects to login
 * All authenticated users will be redirected to their role-specific dashboard
 */
export default function Home() {
  redirect('/auth/login');
}
