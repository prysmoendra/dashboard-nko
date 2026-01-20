'use client';

import { LoginForm } from '../components/LoginForm';
import { Carousel, CarouselSlide } from '@/shared/components/ui/Carousel';
import { Lock } from 'lucide-react';
import Image from 'next/image';

/**
 * LoginPage - Premium split-screen layout for authentication
 * 
 * Layout:
 * - Left side (60%): Brand carousel with background image and overlay
 * - Right side (40%): Clean login form
 */
export function LoginPage() {
    // Carousel slides with corporate messaging
    const carouselSlides: CarouselSlide[] = [
        {
            id: 1,
            content: (
                <div className="flex flex-col justify-center h-full px-12">
                    <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                        Transformasi Digital
                    </h2>
                    <p className="text-xl lg:text-2xl text-blue-100 leading-relaxed">
                        Mengawal Kinerja Terbaik untuk Negeri.
                    </p>
                </div>
            ),
        },
        {
            id: 2,
            content: (
                <div className="flex flex-col justify-center h-full px-12">
                    <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                        Real-Time Monitoring
                    </h2>
                    <p className="text-xl lg:text-2xl text-blue-100 leading-relaxed">
                        Keputusan Tepat Berbasis Data Akurat.
                    </p>
                </div>
            ),
        },
        {
            id: 3,
            content: (
                <div className="flex flex-col justify-center h-full px-12">
                    <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                        Sinergi & Kolaborasi
                    </h2>
                    <p className="text-xl lg:text-2xl text-blue-100 leading-relaxed">
                        Mewujudkan PLN Juara.
                    </p>
                </div>
            ),
        },
    ];

    return (
        <div className="h-screen overflow-hidden flex flex-col lg:flex-row">
            {/* Left Side - Brand Carousel (60%) */}
            <div className="relative lg:w-[60%] bg-blue-900 text-white flex flex-col justify-between overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0">
                    <Image
                        src="/login-bg.png"
                        alt="Technology Background"
                        fill
                        className="object-cover"
                        priority
                    />
                    {/* Blue Overlay */}
                    <div className="absolute inset-0 bg-blue-900/90"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col h-full">
                    {/* Header */}
                    <div className="p-8 lg:p-12">
                        <h1 className="text-3xl lg:text-4xl font-bold mb-3 border-b-4 border-white pb-2 inline-block">
                            PLN Dashboard NKO
                        </h1>
                        <p className="text-blue-100 mt-4 text-base lg:text-lg leading-relaxed max-w-xl">
                            Akses terpusat untuk monitoring kinerja, pelaporan, dan analitik.
                            Khusus pegawai PLN.
                        </p>
                    </div>

                    {/* Carousel - Takes remaining space */}
                    <div className="flex-1 relative">
                        <Carousel
                            slides={carouselSlides}
                            autoPlayInterval={5000}
                            showControls={false}
                            showIndicators={true}
                            pauseOnHover={true}
                        />
                    </div>

                    {/* Footer */}
                    <div className="p-8 lg:p-12 flex flex-row justify-between text-blue-100 text-sm">
                        <p>© 2025 PLN. All Rights Reserved</p>
                        <p className="flex items-center gap-2">
                            <Lock className="w-4 h-4" />
                            <span>Secure Access</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form (40%) */}
            <div className="lg:w-[40%] bg-white flex items-center justify-center p-8 lg:p-12 overflow-y-auto">
                <div className="w-full max-w-md">
                    {/* Logo Header */}
                    <div className="mb-8">
                        <div className="mb-6">
                            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
                                <svg
                                    className="w-7 h-7 text-white"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                                </svg>
                            </div>
                        </div>

                        {/* Welcome Header */}
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            Login Dashboard NKO
                        </h2>
                        <p className="text-gray-600">
                            Silakan masuk menggunakan email resmi PLN untuk mengakses sistem ini
                        </p>
                    </div>

                    {/* Login Form Component */}
                    <LoginForm />
                </div>
            </div>
        </div>
    );
}
