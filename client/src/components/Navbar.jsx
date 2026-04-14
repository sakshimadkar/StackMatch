import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Zap, LayoutDashboard, Search, LogOut, User } from 'lucide-react'

export default function Navbar() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <nav className="bg-gray-950 border-b border-green-900/40 px-6 py-4">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 text-xl font-bold text-green-400">
                    <Zap size={22} className="text-green-400" />
                    StackMatch
                </Link>

                {user ? (
                    <div className="flex items-center gap-6">
                        <Link to="/dashboard" className="flex items-center gap-1.5 text-gray-400 hover:text-green-400 transition text-sm">
                            <LayoutDashboard size={15} />
                            Dashboard
                        </Link>
                        <Link to="/analyze" className="flex items-center gap-1.5 text-gray-400 hover:text-green-400 transition text-sm">
                            <Search size={15} />
                            Analyze Job
                        </Link>
                        <span className="text-gray-700">|</span>
                        <span className="flex items-center gap-1.5 text-gray-300 text-sm">
                            <User size={15} className="text-green-400" />
                            {user.name}
                        </span>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-1.5 bg-red-600/20 hover:bg-red-600/40 border border-red-600/40 px-3 py-1.5 rounded-lg text-red-400 text-sm transition"
                        >
                            <LogOut size={14} />
                            Logout
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-4">
                        <Link to="/login" className="text-gray-400 hover:text-green-400 transition text-sm">
                            Login
                        </Link>
                        <Link to="/register" className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-white text-sm font-medium transition">
                            Register
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    )
}