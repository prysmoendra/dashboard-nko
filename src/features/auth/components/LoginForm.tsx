'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginSchema, type LoginFormData } from '../schemas/login-schema';
import { registerSchema, type RegisterFormData } from '../schemas/register-schema';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Select, SelectTrigger, SelectContent, SelectItem } from './Select';

type AuthMode = 'LOGIN' | 'REGISTER';

// Dropdown data
const ROLES = [
    { value: 'staff', label: 'Pegawai - Staff operasional' },
    { value: 'assistant_manager', label: 'Asisten Kepala Bidang - Supervisor & review' },
    { value: 'manager', label: 'Kepala Bidang - Manager & approval' },
];

const WORK_UNITS = [
    'UP3 Cimahi',
    'ULP CIKO',
    'ULP Cimindi',
    'ULP Padalarang',
    'Gudang Central',
    'Unit Jaringan',
    'Unit Pembangkit',
    'Unit Maintenance',
];

const DIVISIONS = ['Distribusi', 'Jaringan', 'Pembangkit', 'Logistik', 'Maintenance'];

interface AuthFormProps {
    onModeChange?: (mode: AuthMode) => void;
}

/**
 * AuthForm - Client component for login and registration
 * 
 * Features:
 * - Toggle between LOGIN and REGISTER modes
 * - Form validation with react-hook-form + Zod
 * - Loading state during submission
 * - Error handling and display
 */
export function AuthForm({ onModeChange }: AuthFormProps) {
    const router = useRouter();
    const [mode, setMode] = useState<AuthMode>('LOGIN');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Form for LOGIN mode
    const loginForm = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    // Form for REGISTER mode
    const registerForm = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const isLoginMode = mode === 'LOGIN';
    const currentForm = isLoginMode ? loginForm : registerForm;

    const toggleMode = () => {
        const newMode = isLoginMode ? 'REGISTER' : 'LOGIN';
        setMode(newMode);
        setErrorMessage(null);
        onModeChange?.(newMode);
        // Reset both forms when switching
        loginForm.reset();
        registerForm.reset();
    };

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

            router.push('/');
            router.refresh();
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : 'Terjadi kesalahan');
        } finally {
            setIsLoading(false);
        }
    };

    const onSubmitRegister = async (data: RegisterFormData) => {
        setIsLoading(true);
        setErrorMessage(null);

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Registrasi gagal');
            }

            // Show success and switch to login
            alert('Registrasi berhasil! Silakan login dengan akun Anda.');
            setMode('LOGIN');
            onModeChange?.('LOGIN');
            loginForm.reset();
            registerForm.reset();
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : 'Terjadi kesalahan');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md">
            {/* Demo Credentials Alert (LOGIN mode only) */}
            {isLoginMode && (
                <div className="mb-6 rounded-lg bg-blue-50 border border-blue-200 p-4">
                    <p className="text-sm text-blue-800">
                        <strong>Demo Login:</strong>
                        <br />
                        Email: <code className="bg-blue-100 px-1 rounded">demo@pln.co.id</code>
                        <br />
                        Password: <code className="bg-blue-100 px-1 rounded">any password (min 6 chars)</code>
                    </p>
                </div>
            )}

            {/* Error Alert */}
            {errorMessage && (
                <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <p className="text-sm text-red-800">{errorMessage}</p>
                </div>
            )}

            <form
                onSubmit={isLoginMode ? loginForm.handleSubmit(onSubmitLogin) : registerForm.handleSubmit(onSubmitRegister)}
                className="space-y-5"
            >
                {/* REGISTER MODE: Name Field */}
                {!isLoginMode && (
                    <div>
                        <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                            Nama Lengkap
                        </label>
                        <input
                            id="name"
                            type="text"
                            placeholder="Masukkan nama lengkap Anda"
                            {...registerForm.register('name')}
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${registerForm.formState.errors.name ? 'border-red-500' : 'border-gray-300'
                                }`}
                            disabled={isLoading}
                        />
                        {registerForm.formState.errors.name && (
                            <p className="mt-1 text-sm text-red-600">{registerForm.formState.errors.name.message}</p>
                        )}
                    </div>
                )}

                {/* Email Field (both modes) */}
                <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                        Email PLN Address
                    </label>
                    <input
                        id="email"
                        type="email"
                        placeholder={isLoginMode ? 'Masukkan email Anda @pln.co.id' : 'nama.anda@pln.co.id'}
                        {...(isLoginMode ? loginForm.register('email') : registerForm.register('email'))}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${currentForm.formState.errors.email ? 'border-red-500' : 'border-gray-300'
                            }`}
                        disabled={isLoading}
                    />
                    {currentForm.formState.errors.email && (
                        <p className="mt-1 text-sm text-red-600">{currentForm.formState.errors.email.message}</p>
                    )}
                </div>

                {/* Password Field (both modes) */}
                <div>
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        placeholder="Masukkan password Anda"
                        {...(isLoginMode ? loginForm.register('password') : registerForm.register('password'))}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${currentForm.formState.errors.password ? 'border-red-500' : 'border-gray-300'
                            }`}
                        disabled={isLoading}
                    />
                    {currentForm.formState.errors.password && (
                        <p className="mt-1 text-sm text-red-600">{currentForm.formState.errors.password.message}</p>
                    )}
                </div>

                {/* REGISTER MODE: Confirm Password Field */}
                {!isLoginMode && (
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                            Konfirmasi Password
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            placeholder="Masukkan ulang password Anda"
                            {...registerForm.register('confirmPassword')}
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${registerForm.formState.errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                                }`}
                            disabled={isLoading}
                        />
                        {registerForm.formState.errors.confirmPassword && (
                            <p className="mt-1 text-sm text-red-600">{registerForm.formState.errors.confirmPassword.message}</p>
                        )}
                    </div>
                )}

                {/* REGISTER MODE: Role Dropdown */}
                {!isLoginMode && (
                    <div>
                        <label htmlFor="role" className="block text-sm font-semibold text-gray-700 mb-2">
                            Jabatan / Role
                        </label>
                        <Select
                            value={registerForm.watch('role') || ''}
                            onChange={(value) => registerForm.setValue('role', value as any)}
                        >
                            <SelectTrigger
                                placeholder="Pilih jabatan Anda"
                                disabled={isLoading}
                                className={registerForm.formState.errors.role ? 'border-red-500' : ''}
                            />
                            <SelectContent>
                                {ROLES.map((role) => (
                                    <SelectItem key={role.value} value={role.value}>
                                        {role.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {registerForm.formState.errors.role && (
                            <p className="mt-1 text-sm text-red-600">{registerForm.formState.errors.role.message}</p>
                        )}
                    </div>
                )}

                {/* REGISTER MODE: Work Unit Dropdown */}
                {!isLoginMode && (
                    <div>
                        <label htmlFor="workUnit" className="block text-sm font-semibold text-gray-700 mb-2">
                            Unit Kerja
                        </label>
                        <Select
                            value={registerForm.watch('workUnit') || ''}
                            onChange={(value) => registerForm.setValue('workUnit', value)}
                        >
                            <SelectTrigger
                                placeholder="Pilih unit kerja Anda"
                                disabled={isLoading}
                                className={registerForm.formState.errors.workUnit ? 'border-red-500' : ''}
                            />
                            <SelectContent>
                                {WORK_UNITS.map((unit) => (
                                    <SelectItem key={unit} value={unit}>
                                        {unit}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {registerForm.formState.errors.workUnit && (
                            <p className="mt-1 text-sm text-red-600">{registerForm.formState.errors.workUnit.message}</p>
                        )}
                    </div>
                )}

                {/* REGISTER MODE: Division Dropdown */}
                {!isLoginMode && (
                    <div>
                        <label htmlFor="division" className="block text-sm font-semibold text-gray-700 mb-2">
                            Bidang
                        </label>
                        <Select
                            value={registerForm.watch('division') || ''}
                            onChange={(value) => registerForm.setValue('division', value)}
                        >
                            <SelectTrigger
                                placeholder="Pilih bidang Anda"
                                disabled={isLoading}
                                className={registerForm.formState.errors.division ? 'border-red-500' : ''}
                            />
                            <SelectContent>
                                {DIVISIONS.map((division) => (
                                    <SelectItem key={division} value={division}>
                                        {division}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {registerForm.formState.errors.division && (
                            <p className="mt-1 text-sm text-red-600">{registerForm.formState.errors.division.message}</p>
                        )}
                    </div>
                )}

                {/* LOGIN MODE: Remember Me & Forgot Password */}
                {isLoginMode && (
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
                )}

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
                        <span>{isLoginMode ? 'Masuk' : 'Daftar'}</span>
                    )}
                </button>

                {/* Toggle Mode Link */}
                <div className="text-center mt-4">
                    <p className="text-sm text-gray-600">
                        {isLoginMode ? 'Belum punya akun? ' : 'Sudah punya akun? '}
                        <button
                            type="button"
                            onClick={toggleMode}
                            className="font-medium text-blue-600 hover:text-blue-700 transition-colors"
                        >
                            {isLoginMode ? 'Daftar' : 'Masuk'}
                        </button>
                    </p>
                </div>
            </form>
        </div>
    );
}

// Export as LoginForm for backward compatibility
export { AuthForm as LoginForm };
