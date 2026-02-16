import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2, AlertCircle, ArrowLeft } from 'lucide-react';

const Login = ({ type }) => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const res = await login(formData.username, formData.password, type);
        setIsLoading(false);

        if (res.success) {
            if (type === 'admin') navigate('/admin/dashboard');
            else navigate('/student/dashboard');
        } else {
            setError(res.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950 relative overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1920&q=80"
                    alt="Background"
                    className="w-full h-full object-cover opacity-40"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-slate-950/80 to-slate-950/90"></div>
            </div>

            <div className="w-full max-w-md glass p-8 rounded-2xl shadow-xl border border-slate-800 relative z-10">
                <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm mb-6 group">
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </Link>

                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold capitalize bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">{type} Login</h2>
                    <p className="text-slate-500 mt-2">Welcome back! Please enter your details.</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-400 text-sm">
                        <AlertCircle size={18} />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1.5">
                            {type === 'admin' ? 'Username' : 'Email Address'}
                        </label>
                        <input
                            type={type === 'admin' ? "text" : "email"}
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-100 placeholder-slate-600"
                            placeholder={type === 'admin' ? "Enter your username" : "your.email@example.com"}
                            required
                        />
                    </div>
                    <div>
                        <div className="flex justify-between items-center mt-1.5">
                            <label className="block text-sm font-medium text-slate-300">
                                Password
                            </label>
                            {type === 'student' && (
                                <Link to="/forgot-password" size="sm" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                                    Forgot Password?
                                </Link>
                            )}
                        </div>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-100 placeholder-slate-600"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 py-3 rounded-lg font-bold transition-all mt-6 shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Sign In'}
                    </button>
                </form>

                {type === 'student' && (
                    <div className="text-center mt-6">
                        <p className="text-slate-400 text-sm">
                            Don't have an account?{' '}
                            <Link to="/student/signup" className="text-blue-400 hover:text-blue-300 transition-colors font-medium">
                                Sign up here
                            </Link>
                        </p>
                    </div>
                )}

                {type === 'admin' && (
                    <div className="text-center mt-6">
                        <p className="text-slate-400 text-sm">
                            Need an admin account?{' '}
                            <Link to="/admin/signup" className="text-purple-400 hover:text-purple-300 transition-colors font-medium">
                                Register here
                            </Link>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Login;
