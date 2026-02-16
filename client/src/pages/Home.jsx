import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building2, ArrowRight, Users, Home as HomeIcon, Shield } from 'lucide-react';

// Hostel background images from Unsplash
const backgrounds = [
    'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=1920&q=80', // Modern hostel room
    'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1920&q=80', // Hostel common area
    'https://images.unsplash.com/photo-1631049307255-1f2e02ebf0cf?w=1920&q=80', // Hostel exterior
];

const Home = () => {
    const [currentBg, setCurrentBg] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentBg((prev) => (prev + 1) % backgrounds.length);
        }, 5000); // Change background every 5 seconds
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Animated Background Images */}
            <div className="absolute inset-0 z-0">
                {backgrounds.map((bg, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${currentBg === index ? 'opacity-100' : 'opacity-0'
                            }`}
                        style={{
                            backgroundImage: `url(${bg})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            transform: currentBg === index ? 'scale(1)' : 'scale(1.1)',
                            transition: 'transform 5s ease-in-out, opacity 1s ease-in-out'
                        }}
                    />
                ))}
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-950/95 via-slate-900/90 to-slate-950/95"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
            </div>

            {/* Floating orbs */}
            {<div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-20 left-10 md:left-20 w-64 h-64 md:w-72 md:h-72 bg-blue-500/10 rounded-full blur-3xl animate-float"></div>
                <div className="absolute bottom-20 right-10 md:right-20 w-64 h-64 md:w-72 md:h-72 bg-purple-500/10 rounded-full blur-3xl animate-float-delay"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 md:w-96 md:h-96 bg-pink-500/5 rounded-full blur-3xl animate-pulse"></div>
            </div>}

            {/* Content */}
            <div className="relative z-10 min-h-screen flex items-center justify-center p-4 md:p-6">
                <div className="max-w-7xl w-full mx-auto">
                    {/* Single Column Hero Content - Centered */}
                    <div className="space-y-8 md:space-y-10 animate-fade-in flex flex-col items-center text-center mx-auto max-w-4xl">
                        <div className="space-y-6 md:space-y-8">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium backdrop-blur-sm animate-slide-up">
                                <Building2 size={18} />
                                <span>Modern Hostel Management</span>
                            </div>

                            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight animate-slide-up-delay-1">
                                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                    Hostel Management System
                                </span>
                                <br />
                                <br />
                                <span className="text-white font-semibold text-3xl color-dark-500 animate-slide-up-delay-2">
                                    Book your space now with Ease.
                                </span>
                            </h1>

                            <p className="text-slate-300 text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl mx-auto animate-slide-up-delay-2">
                                Experience seamless hostel life with our cutting-edge management platform. Book rooms, manage payments, and connect with your community—all in one place.
                            </p>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 animate-slide-up-delay-3 justify-center w-full">
                            <Link
                                to="/student/login"
                                className="group px-8 md:px-10 py-3 md:py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl font-bold transition-all hover:scale-105 shadow-lg shadow-blue-500/25 text-center flex items-center justify-center gap-2"
                            >
                                <Users size={20} />
                                Student Portal
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </Link>

                            <Link
                                to="/admin/login"
                                className="group px-8 md:px-10 py-3 md:py-4 bg-slate-800/80 hover:bg-slate-700/80 backdrop-blur-sm rounded-xl font-bold transition-all hover:scale-105 border border-slate-700 text-center flex items-center justify-center gap-2"
                            >
                                <Shield size={20} />
                                Admin Access
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>

                        {/* Features */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 pt-8 md:pt-10 animate-slide-up-delay-4 w-full max-w-3xl">
                            <div className="glass p-4 md:p-6 rounded-xl text-center hover:scale-105 transition-transform cursor-pointer">
                                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">500+</div>
                                <div className="text-slate-400 text-sm md:text-base mt-2">Students</div>
                            </div>
                            <div className="glass p-4 md:p-6 rounded-xl text-center hover:scale-105 transition-transform cursor-pointer">
                                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">100+</div>
                                <div className="text-slate-400 text-sm md:text-base mt-2">Rooms</div>
                            </div>
                            <div className="glass p-4 md:p-6 rounded-xl text-center hover:scale-105 transition-transform cursor-pointer">
                                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-400 to-blue-400 bg-clip-text text-transparent">24/7</div>
                                <div className="text-slate-400 text-sm md:text-base mt-2">Support</div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Indicator */}
                    <div className="flex justify-center gap-2 mt-16 animate-fade-in-delay-2">
                        {backgrounds.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentBg(index)}
                                className={`h-1.5 rounded-full transition-all ${currentBg === index
                                    ? 'w-8 bg-gradient-to-r from-blue-500 to-purple-500'
                                    : 'w-1.5 bg-slate-700 hover:bg-slate-600'
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
