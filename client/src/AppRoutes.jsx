import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children, allowedRole }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="flex h-screen items-center justify-center bg-slate-900"><Loader2 className="animate-spin text-blue-500" size={48} /></div>;
    }

    if (!user) {
        return <Navigate to="/" replace />;
    }

    if (allowedRole && user.role !== allowedRole) {
        return <Navigate to="/" replace />;
    }

    return children;
};

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/student/signup" element={<Signup />} />
            <Route path="/student/login" element={<Login type="student" />} />
            <Route path="/admin/login" element={<Login type="admin" />} />

            <Route
                path="/student/dashboard"
                element={
                    <ProtectedRoute allowedRole="student">
                        <StudentDashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/admin/dashboard"
                element={
                    <ProtectedRoute allowedRole="admin">
                        <AdminDashboard />
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
}

export default AppRoutes;
