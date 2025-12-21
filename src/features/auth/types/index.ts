// Auth Domain Types and Interfaces

/**
 * User role types
 */
export type UserRole = 'staff' | 'assistant_manager' | 'manager';

/**
 * User profile information
 */
export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
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
 * Registration credentials input
 */
export interface RegisterCredentials {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    workUnit: string;
    division: string;
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
    // Future methods can be added here:
    // refreshSession(token: string): Promise<Session>;
}
