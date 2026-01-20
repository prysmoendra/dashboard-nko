import { createBrowserClient } from '@/shared/lib/supabase';
import type { CreateUserFormData } from '../schemas/user-schema';

/**
 * User service - Handles all user management operations
 */

export interface UserWithRole {
    id: string;
    name: string;
    email: string;
    work_unit: string;
    division: string | null;
    role_name: string;
    role_id: number;
    created_at: string;
}

/**
 * Fetch all users with their role information
 */
export async function getAllUsers(): Promise<UserWithRole[]> {
    const supabase = createBrowserClient();

    const { data, error } = await supabase
        .from('users')
        .select(`
            id,
            full_name,
            email,
            work_unit,
            division,
            role_id,
            created_at,
            roles (
                id,
                name
            )
        `)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('[UserService] Error fetching users:', error);
        throw new Error('Gagal mengambil data pengguna');
    }

    // Transform the data to flatten the role information
    return (data || []).map((user: any) => ({
        id: user.id,
        name: user.full_name,
        email: user.email,
        work_unit: user.work_unit,
        division: user.division,
        role_name: user.roles?.name || 'unknown',
        role_id: user.role_id,
        created_at: user.created_at,
    }));
}

/**
 * Get role ID by role name
 */
async function getRoleIdByName(roleName: string): Promise<number> {
    const supabase = createBrowserClient();

    const { data, error } = await supabase
        .from('roles')
        .select('id')
        .eq('name', roleName)
        .single();

    if (error || !data) {
        console.error('[UserService] Error fetching role:', error);
        throw new Error(`Role "${roleName}" tidak ditemukan`);
    }

    return data.id;
}

/**
 * Create a new user account
 */
export async function createUser(userData: CreateUserFormData): Promise<void> {
    const supabase = createBrowserClient();

    try {
        // 1. Get role ID
        const roleId = await getRoleIdByName(userData.roleName);

        // 2. Create auth user via Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: userData.email,
            password: userData.password,
            options: {
                data: {
                    name: userData.name,
                    role_name: userData.roleName,
                },
            },
        });

        if (authError) {
            console.error('[UserService] Auth signup error:', authError);
            throw new Error(authError.message || 'Gagal membuat akun pengguna');
        }

        if (!authData.user) {
            throw new Error('Gagal membuat akun pengguna');
        }

        // 3. Insert user profile into users table
        const { error: profileError } = await supabase
            .from('users')
            .insert({
                id: authData.user.id,
                full_name: userData.name,
                email: userData.email,
                role_id: roleId,
                work_unit: userData.workUnit,
                division: userData.division || null,
            });

        if (profileError) {
            console.error('[UserService] Profile creation error:', profileError);
            // Note: Auth user is already created, but profile failed
            // In production, you might want to implement cleanup or retry logic
            throw new Error('Gagal membuat profil pengguna');
        }

        console.log('[UserService] User created successfully:', authData.user.id);
    } catch (error) {
        console.error('[UserService] Create user error:', error);
        throw error;
    }
}

/**
 * Update an existing user
 */
export async function updateUser(
    userId: string,
    updates: Partial<CreateUserFormData>
): Promise<void> {
    const supabase = createBrowserClient();

    try {
        const updateData: any = {};

        if (updates.name) updateData.full_name = updates.name;
        if (updates.email) updateData.email = updates.email;
        if (updates.workUnit) updateData.work_unit = updates.workUnit;
        if (updates.division !== undefined) updateData.division = updates.division;

        // If role is being updated, get the role ID
        if (updates.roleName) {
            const roleId = await getRoleIdByName(updates.roleName);
            updateData.role_id = roleId;
        }

        const { error } = await supabase
            .from('users')
            .update(updateData)
            .eq('id', userId);

        if (error) {
            console.error('[UserService] Update user error:', error);
            throw new Error('Gagal memperbarui data pengguna');
        }

        console.log('[UserService] User updated successfully:', userId);
    } catch (error) {
        console.error('[UserService] Update user error:', error);
        throw error;
    }
}

/**
 * Delete a user (soft delete by setting active = false, if that column exists)
 * For now, we'll do a hard delete
 */
export async function deleteUser(userId: string): Promise<void> {
    const supabase = createBrowserClient();

    const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

    if (error) {
        console.error('[UserService] Delete user error:', error);
        throw new Error('Gagal menghapus pengguna');
    }

    console.log('[UserService] User deleted successfully:', userId);
}
