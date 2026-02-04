import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2, AlertCircle } from 'lucide-react';
import api from '../api';

const Signup = () => {
    const [formData, setFormData] = useState({ username: '', password: '', confirmPassword: '', role: 'student' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setIsLoading(true);
        try {
            await api.post('/register', {
                username: formData.username,
                password: formData.password,
                role: formData.role
            });
            if (formData.role === 'admin') navigate('/admin/login');
            else navigate('/student/login');
        } catch (err) {
            setError(err.response?.data?.error || "Registration failed");
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
            </div>

            <div className="w-full max-w-md glass p-8 rounded-2xl shadow-xl border border-slate-800 relative z-10">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Create Account</h2>
                    <p className="text-slate-500 mt-2">Join the hostel community.</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-400 text-sm">
                        <AlertCircle size={18} />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-100 placeholder-slate-600"
                            placeholder="Choose a username"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
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
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-100 placeholder-slate-600"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Role</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-100"
                        >
                            <option value="student">Student</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 py-3 rounded-lg font-bold transition-all mt-6 shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Create Account'}
                    </button>

                    <div className="text-center mt-4">
                        <Link to="/student/login" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                            Already have an account? Login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Signup;
