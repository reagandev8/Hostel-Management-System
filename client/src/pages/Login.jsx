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
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
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
                            {type === 'admin' ? 'Username' : 'Student ID'}
                        </label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-100 placeholder-slate-600"
                            placeholder={type === 'admin' ? "Enter your username" : "Enter your Student ID"}
                            required
                        />
                    </div>
                    <div>
                        <div className="flex justify-between items-center mt-1.5">
                            <label className="block text-sm font-medium text-slate-300">
                                {type === 'admin' ? 'Password' : 'Email Address'}
                            </label>
                            {type === 'student' && (
                                <Link to="/forgot-password" size="sm" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                                    Forgot Login Credentials?
                                </Link>
                            )}
                        </div>
                        <input
                            type={type === 'admin' ? "password" : "email"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-100 placeholder-slate-600"
                            placeholder={type === 'admin' ? "••••••••" : "Enter your registered email"}
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
                        <p className="text-slate-500 text-xs italic">
                            Only admin-registered students can access the dashboard.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Login;
