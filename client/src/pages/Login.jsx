import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { Mail, Lock, LogIn, Zap } from 'lucide-react'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const { login } = useAuth()
    const navigate = useNavigate()

    const handleLogin = async () => {
        if (!email || !password) { setError('Please fill all fields'); return }
        setLoading(true); setError(null)
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', { email, password })
            login(res.data.user, res.data.token)
            navigate('/dashboard')
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong')
        } finally { setLoading(false) }
    }

    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
            <div className="bg-gray-900 border border-green-900/30 rounded-2xl p-8 w-full max-w-md shadow-xl shadow-green-900/10">

                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-2 mb-3">
                        <Zap size={28} className="text-green-400" />
                        <span className="text-2xl font-bold text-green-400">StackMatch</span>
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-1">Welcome Back</h1>
                    <p className="text-gray-500 text-sm">Login to your account</p>
                </div>

                {error && (
                    <div className="bg-red-900/20 border border-red-600/40 rounded-xl p-3 mb-5 text-red-400 text-sm">
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    <div>
                        <label className="text-gray-400 text-sm mb-1.5 block">Email</label>
                        <div className="relative">
                            <Mail size={15} className="absolute left-3.5 top-3.5 text-green-500" />
                            <input
                                type="email"
                                placeholder="sakshi@example.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="w-full bg-gray-800 border border-gray-700 hover:border-gray-600 focus:border-green-500 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none transition text-sm"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-gray-400 text-sm mb-1.5 block">Password</label>
                        <div className="relative">
                            <Lock size={15} className="absolute left-3.5 top-3.5 text-green-500" />
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                                className="w-full bg-gray-800 border border-gray-700 hover:border-gray-600 focus:border-green-500 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none transition text-sm"
                            />
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleLogin}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 disabled:opacity-50 py-3 rounded-xl text-white font-semibold mt-6 transition text-sm"
                >
                    <LogIn size={16} />
                    {loading ? 'Logging in...' : 'Login'}
                </button>

                <p className="text-center text-gray-500 mt-4 text-sm">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-green-400 hover:text-green-300 transition">Register here</Link>
                </p>
            </div>
        </div>
    )
}