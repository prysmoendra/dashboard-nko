'use client';

import { useState } from 'react';
import { LoginForm } from '../components/LoginForm';
import { Zap, Shield, BarChart, Lock } from 'lucide-react';

type AuthMode = 'LOGIN' | 'REGISTER';

/**
 * LoginPage - Split-screen layout component for auth pages
 * 
 * Layout:
 * - Left side: Brand information with feature cards (blue background) - STATIC
 * - Right side: Dynamic auth form (white background) - Changes based on mode
 */
export function LoginPage() {
    const [mode, setMode] = useState<AuthMode>('LOGIN');
    const isLoginMode = mode === 'LOGIN';

    return (
        <div className="h-screen overflow-hidden flex flex-col lg:flex-row">
            {/* Left Side - Brand & Info (STATIC - Never changes) */}
            <div className="relative lg:w-1/2 bg-blue-600 text-white p-8 lg:p-12 flex flex-col justify-between">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-700 opacity-90"></div>

                <div className="relative z-10">
                    {/* Header */}
                    <div className="mb-12">
                        <h1 className="text-4xl lg:text-5xl font-bold mb-4 border-b-4 border-white pb-2 inline-block">
                            PLN Dashboard
                        </h1>
                        <p className="text-blue-100 mt-6 text-lg leading-relaxed max-w-lg">
                            Akses terpusat untuk NKO 2025, Gudang, dan Jaringan. Khusus pegawai PLN.
                        </p>
                    </div>

                    {/* Feature Cards */}
                    <div className="space-y-4 mb-12">
                        {/* Feature Card 1 - Dashboard NKO */}
                        <div className="backdrop-blur-sm bg-white/10 border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-300 shadow-lg">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-white/20 rounded-lg">
                                    <BarChart className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg mb-1">Dashboard NKO</h3>
                                    <p className="text-blue-100 text-sm">Monitoring real-time</p>
                                </div>
                            </div>
                        </div>

                        {/* Feature Card 2 - Terpusat */}
                        <div className="backdrop-blur-sm bg-white/10 border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-300 shadow-lg">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-white/20 rounded-lg">
                                    <Zap className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg mb-1">Terpusat</h3>
                                    <p className="text-blue-100 text-sm">Semua dalam satu platform</p>
                                </div>
                            </div>
                        </div>

                        {/* Feature Card 3 - Akses Aman */}
                        <div className="backdrop-blur-sm bg-white/10 border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-300 shadow-lg">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-white/20 rounded-lg">
                                    <Shield className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg mb-1">Akses Aman</h3>
                                    <p className="text-blue-100 text-sm">Khusus pegawai PLN</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="relative flex flex-row z-10 text-blue-100 text-sm justify-between">
                    <p>© 2025 All Rights Reserved</p>
                    <p className="flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        <span>Khusus untuk pegawai PLN</span>
                    </p>
                </div>
            </div>

            {/* Right Side - Auth Form (DYNAMIC) */}
            <div className="lg:w-1/2 bg-white flex items-center justify-center p-8 lg:p-12 overflow-y-auto">
                <div className="w-full max-w-md">
                    {/* Logo Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="p-2 bg-blue-600 rounded-lg">
                                <Zap className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-semibold text-gray-900 text-lg">PLN Dashboard Suite</span>
                        </div>

                        {/* Dynamic Welcome Header */}
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            {isLoginMode ? 'Hi, Welcome Back!' : 'Create an Account'}
                        </h2>
                        <p className="text-gray-600">
                            {isLoginMode
                                ? 'Silakan masuk menggunakan email resmi PLN untuk mengakses sistem ini'
                                : 'Daftar akun baru untuk mengakses PLN Dashboard Suite'}
                        </p>
                    </div>

                    {/* Auth Form Component */}
                    <LoginForm onModeChange={setMode} />
                </div>
            </div>
        </div>
    );
}
