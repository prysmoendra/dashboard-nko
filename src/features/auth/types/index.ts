// Auth Domain Types and Interfaces

/**
 * User role types - matches roles.name in database
 */
export type UserRole = 'pegawai' | 'asisten' | 'kepala-bidang' | 'super-admin';

/**
 * User profile information
 */
export interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    roleId?: string;
    roleDisplayName?: string;
    workUnit?: string;
    division?: string;
}

/**
 * Session token and metadata
 */
export interface Session {
    token: string;
    expiresAt: Date;
}

/**
 * Login credentials input
 */
export interface LoginCredentials {
    email: string;
    password: string;
}

/**
 * User registration credentials
 */
export interface RegisterCredentials {
    email: string;
    password: string;
    name: string;
    roleName: 'pegawai' | 'asisten' | 'kepala-bidang' | 'super-admin';
    workUnit?: string;
    division?: string;
}

/**
 * Authentication response containing user and session
 */
export interface AuthResponse {
    user: User;
    session: Session;
}

/**
 * AuthProvider interface - defines the contract for authentication providers
 * This allows easy swapping of auth implementations (Supabase, NextAuth, Firebase, etc.)
 */
export interface AuthProvider {
    login(credentials: LoginCredentials): Promise<AuthResponse>;
    register(credentials: RegisterCredentials): Promise<AuthResponse>;
    logout(): Promise<void>;
    updateProfile(userId: string, data: { full_name?: string }): Promise<void>;
    updatePassword(password: string): Promise<void>;
    // Future methods can be added here:
    // refreshSession(token: string): Promise<Session>;
}
