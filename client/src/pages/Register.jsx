import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { User, Mail, Lock, Plus, X, Zap } from 'lucide-react'

export default function Register() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [skillInput, setSkillInput] = useState('')
    const [skills, setSkills] = useState([])
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const { login } = useAuth()
    const navigate = useNavigate()

    const addSkill = () => {
        const trimmed = skillInput.trim()
        if (trimmed && !skills.includes(trimmed)) {
            setSkills([...skills, trimmed]); setSkillInput('')
        }
    }

    const handleRegister = async () => {
        if (!name || !email || !password) { setError('Please fill all fields'); return }
        setLoading(true); setError(null)
        try {
            const res = await axios.post('http://localhost:5000/api/auth/register', { name, email, password, skills })
            login(res.data.user, res.data.token)
            navigate('/dashboard')
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong')
        } finally { setLoading(false) }
    }

    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 py-10">
            <div className="bg-gray-900 border border-green-900/30 rounded-2xl p-8 w-full max-w-md shadow-xl shadow-green-900/10">

                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-2 mb-3">
                        <Zap size={28} className="text-green-400" />
                        <span className="text-2xl font-bold text-green-400">StackMatch</span>
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-1">Create Account</h1>
                    <p className="text-gray-500 text-sm">Join StackMatch today</p>
                </div>

                {error && (
                    <div className="bg-red-900/20 border border-red-600/40 rounded-xl p-3 mb-5 text-red-400 text-sm">
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    <div>
                        <label className="text-gray-400 text-sm mb-1.5 block">Name</label>
                        <div className="relative">
                            <User size={15} className="absolute left-3.5 top-3.5 text-green-500" />
                            <input type="text" placeholder="Sakshi Madkar" value={name}
                                onChange={e => setName(e.target.value)}
                                className="w-full bg-gray-800 border border-gray-700 hover:border-gray-600 focus:border-green-500 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none transition text-sm" />
                        </div>
                    </div>
                    <div>
                        <label className="text-gray-400 text-sm mb-1.5 block">Email</label>
                        <div className="relative">
                            <Mail size={15} className="absolute left-3.5 top-3.5 text-green-500" />
                            <input type="email" placeholder="sakshi@example.com" value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="w-full bg-gray-800 border border-gray-700 hover:border-gray-600 focus:border-green-500 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none transition text-sm" />
                        </div>
                    </div>
                    <div>
                        <label className="text-gray-400 text-sm mb-1.5 block">Password</label>
                        <div className="relative">
                            <Lock size={15} className="absolute left-3.5 top-3.5 text-green-500" />
                            <input type="password" placeholder="••••••••" value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="w-full bg-gray-800 border border-gray-700 hover:border-gray-600 focus:border-green-500 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none transition text-sm" />
                        </div>
                    </div>

                    <div>
                        <label className="text-gray-400 text-sm mb-1.5 block">Your Skills</label>
                        <div className="flex gap-2">
                            <input type="text" placeholder="e.g. React, Node.js" value={skillInput}
                                onChange={e => setSkillInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && addSkill()}
                                className="flex-1 bg-gray-800 border border-gray-700 hover:border-gray-600 focus:border-green-500 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none transition text-sm" />
                            <button onClick={addSkill}
                                className="bg-green-600 hover:bg-green-500 px-4 py-3 rounded-xl text-white transition">
                                <Plus size={16} />
                            </button>
                        </div>
                        {skills.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                                {skills.map((skill, i) => (
                                    <span key={i} className="bg-green-900/30 border border-green-600/50 text-green-300 px-3 py-1 rounded-full text-xs flex items-center gap-1">
                                        {skill}
                                        <button onClick={() => setSkills(skills.filter(s => s !== skill))}>
                                            <X size={11} className="hover:text-red-400" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <button onClick={handleRegister} disabled={loading}
                    className="w-full bg-green-600 hover:bg-green-500 disabled:opacity-50 py-3 rounded-xl text-white font-semibold mt-6 transition text-sm">
                    {loading ? 'Creating account...' : 'Create Account'}
                </button>

                <p className="text-center text-gray-500 mt-4 text-sm">
                    Already have an account?{' '}
                    <Link to="/login" className="text-green-400 hover:text-green-300 transition">Login here</Link>
                </p>
            </div>
        </div>
    )
}