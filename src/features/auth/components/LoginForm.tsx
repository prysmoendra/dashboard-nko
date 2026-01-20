'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginSchema, type LoginFormData } from '../schemas/login-schema';
import { AlertCircle, Loader2 } from 'lucide-react';

/**
 * LoginForm - Simplified login-only form component
 * 
 * Features:
 * - Email and password authentication
 * - Form validation with react-hook-form + Zod
 * - Loading state during submission
 * - Error handling and display
 */
export function LoginForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Form for LOGIN
    const loginForm = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmitLogin = async (data: LoginFormData) => {
        setIsLoading(true);
        setErrorMessage(null);

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Login failed');
            }

            // Use redirectUrl from response for role-based redirect
            const redirectUrl = result.redirectUrl || '/dashboard';
            router.push(redirectUrl);
            router.refresh();
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : 'Terjadi kesalahan');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full">
            {/* Error Alert */}
            {errorMessage && (
                <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <p className="text-sm text-red-800">{errorMessage}</p>
                </div>
            )}

            <form
                onSubmit={loginForm.handleSubmit(onSubmitLogin)}
                className="space-y-5"
            >
                {/* Email Field */}
                <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                        Email PLN Address
                    </label>
                    <input
                        id="email"
                        type="email"
                        placeholder="Masukkan email Anda @pln.co.id"
                        {...loginForm.register('email')}
                        className={`w-full px-4 py-3 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${loginForm.formState.errors.email ? 'border-red-500' : 'border-gray-300'
                            }`}
                        disabled={isLoading}
                    />
                    {loginForm.formState.errors.email && (
                        <p className="mt-1 text-sm text-red-600">{loginForm.formState.errors.email.message}</p>
                    )}
                </div>

                {/* Password Field */}
                <div>
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        placeholder="Masukkan password Anda"
                        {...loginForm.register('password')}
                        className={`w-full px-4 py-3 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${loginForm.formState.errors.password ? 'border-red-500' : 'border-gray-300'
                            }`}
                        disabled={isLoading}
                    />
                    {loginForm.formState.errors.password && (
                        <p className="mt-1 text-sm text-red-600">{loginForm.formState.errors.password.message}</p>
                    )}
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Tetap masuk</span>
                    </label>
                    <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
                        Lupa Password?
                    </a>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Memproses...</span>
                        </>
                    ) : (
                        <span>Masuk</span>
                    )}
                </button>
            </form>
        </div>
    );
}
