import type { AuthProvider, AuthResponse, LoginCredentials, RegisterCredentials } from '../types';
import { supabase } from '@/shared/lib/supabase';

/**
 * AuthService - Server-side business logic for authentication
 * 
 * Implements the Provider-Agnostic Service Pattern with Supabase.
 * Handles user authentication, registration, and profile management.
 */
export class AuthService implements AuthProvider {
    /**
     * Authenticate user with email and password
     * 
     * @param credentials - User login credentials
     * @returns Promise<AuthResponse> - User and session data
     * @throws Error if authentication fails
     */
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const { email, password } = credentials;

        try {
            // Step 1: Authenticate with Supabase Auth
            const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (authError) {
                throw new Error('Email atau password tidak valid');
            }

            if (!authData.user || !authData.session) {
                throw new Error('Login gagal. Silakan coba lagi.');
            }

            // Step 2: Fetch user profile with role info
            const { data: profile, error: profileError } = await supabase
                .from('users')
                .select(`
                    *,
                    roles:role_id (
                        id,
                        name,
                        display_name
                    )
                `)
                .eq('id', authData.user.id)
                .single();

            if (profileError || !profile) {
                // User authenticated but no profile found
                console.error('Profile fetch error:', profileError);
                throw new Error('Profil pengguna tidak ditemukan.');
            }

            // Fallback to varchar role if FK is not set (for backward compatibility)
            const userRole = profile.roles?.name || profile.role || 'pegawai';

            // Step 3: Map to AuthResponse format
            const user = {
                id: authData.user.id,
                email: authData.user.email || email,
                name: profile.full_name || profile.name || 'User',
                role: userRole,
                roleId: profile.role_id,
                roleDisplayName: profile.roles?.display_name || userRole,
                workUnit: profile.work_unit,
                division: profile.division,
            };

            const session = {
                token: authData.session.access_token,
                expiresAt: new Date(authData.session.expires_at || Date.now() + 3600000),
            };

            return { user, session };
        } catch (error) {
            console.error('Login error:', error);
            throw error instanceof Error ? error : new Error('Terjadi kesalahan saat login');
        }
    }

    /**
     * Register a new user
     * 
     * Process:
     * 1. Validate role exists in roles table
     * 2. Create auth user in Supabase Auth
     * 3. Insert profile data with role_id FK into public.users table
     * 4. On failure, attempt cleanup
     * 
     * @param credentials - User registration data
     * @returns Promise<AuthResponse> - User and session data
     * @throws Error if registration fails
     */
    async register(credentials: RegisterCredentials): Promise<AuthResponse> {
        const { email, password, name, roleName, workUnit, division } = credentials;

        try {
            // Step 1: Validate role exists and get role_id
            const { data: roleData, error: roleError } = await supabase
                .from('roles')
                .select('id, name, display_name')
                .eq('name', roleName)
                .single();

            if (roleError || !roleData) {
                throw new Error(`Role "${roleName}" tidak ditemukan. Hubungi administrator.`);
            }

            // Step 2: Create auth user
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: name,
                        role_id: roleData.id,
                        role_name: roleData.name,
                    },
                },
            });

            if (authError) {
                throw new Error(authError.message || 'Registrasi gagal');
            }

            if (!authData.user) {
                throw new Error('Registrasi gagal. Silakan coba lagi.');
            }

            // Step 3: Insert profile into public.users table
            const { error: profileError } = await supabase
                .from('users')
                .insert({
                    id: authData.user.id,
                    email: email,
                    full_name: name,
                    role_id: roleData.id,       // ← FK to roles.id
                    role: roleData.name,         // ← Denormalized for convenience
                    work_unit: workUnit,
                    division: division,
                    status: 'active',
                });

            if (profileError) {
                console.error('Profile insert error:', profileError);

                // Step 4: Attempt cleanup - delete auth user
                // Note: This requires admin privileges, so it may fail
                // In production, consider using a Supabase Edge Function or RPC
                try {
                    await supabase.auth.admin.deleteUser(authData.user.id);
                } catch (cleanupError) {
                    console.error('Cleanup failed:', cleanupError);
                }

                throw new Error('Gagal membuat profil pengguna. Silakan coba lagi.');
            }

            // Step 5: Return auth response
            const user = {
                id: authData.user.id,
                email: email,
                name: name,
                role: roleData.name,
                roleId: roleData.id,
                roleDisplayName: roleData.display_name,
                workUnit: workUnit,
                division: division,
            };

            const session = {
                token: authData.session?.access_token || '',
                expiresAt: new Date(authData.session?.expires_at || Date.now() + 3600000),
            };

            return { user, session };
        } catch (error) {
            console.error('Registration error:', error);
            throw error instanceof Error ? error : new Error('Terjadi kesalahan saat registrasi');
        }
    }

    /**
     * Logout user and terminate session
     * 
     * @returns Promise<void>
     * @throws Error if logout fails
     */
    async logout(): Promise<void> {
        try {
            // Terminate Supabase session
            // Note: Supabase signOut uses the current session from the client
            const { error } = await supabase.auth.signOut();

            if (error) {
                console.error('Supabase signOut error:', error);
                // Don't throw - we still want to clear the cookie even if Supabase fails
            }
        } catch (error) {
            console.error('Logout error:', error);
            // Don't throw - allow cookie clearing to proceed
        }
    }


    /**
     * Update user profile data
     * 
     * @param userId - ID of user to update
     * @param data - Data fields to update
     */
    async updateProfile(userId: string, data: { full_name?: string }): Promise<void> {
        if (data.full_name) {
            const { error } = await supabase
                .from('users')
                .update({ full_name: data.full_name })
                .eq('id', userId);

            if (error) {
                console.error('Update profile error:', error);
                throw new Error('Gagal memperbarui profil');
            }
        }
    }

    /**
     * Update user password
     * 
     * @param password - New password
     */
    async updatePassword(password: string): Promise<void> {
        const { error } = await supabase.auth.updateUser({
            password: password
        });

        if (error) {
            console.error('Update password error:', error);
            throw new Error('Gagal memperbarui password');
        }
    }
}

// Export singleton instance
export const authService = new AuthService();
