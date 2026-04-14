import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts'

export default function Analyze() {
    const { user, token } = useAuth()
    const navigate = useNavigate()
    const [jobDescription, setJobDescription] = useState('')
    const [skills, setSkills] = useState(user?.skills || [])
    const [skillInput, setSkillInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState(null)
    const [error, setError] = useState(null)

    const addSkill = () => {
        const trimmed = skillInput.trim()
        if (trimmed && !skills.includes(trimmed)) {
            setSkills([...skills, trimmed])
            setSkillInput('')
        }
    }

    const removeSkill = (skill) => {
        setSkills(skills.filter(s => s !== skill))
    }

    const handleAnalyze = async () => {
        if (!jobDescription || skills.length === 0) {
            setError('Please enter job description and at least one skill')
            return
        }
        setLoading(true)
        setError(null)
        setResult(null)
        try {
            const res = await axios.post(
                'http://localhost:5000/api/analyze',
                { jobDescription, userSkills: skills },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setResult(res.data.result)
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    // Radar chart data बनव
    const getRadarData = () => {
        if (!result) return []
        const matched = skills.filter(s =>
            !result.missingSkills?.map(m => m.toLowerCase()).includes(s.toLowerCase())
        )
        return [
            { subject: 'Match Score', value: result.matchScore },
            { subject: 'Skills Known', value: Math.round((matched.length / skills.length) * 100) },
            { subject: 'Missing Skills', value: Math.max(0, 100 - (result.missingSkills?.length * 15)) },
            { subject: 'Job Level Fit', value: result.jobLevel === 'Junior' ? 90 : result.jobLevel === 'Mid' ? 65 : 40 },
            { subject: 'Resume Ready', value: result.resumeTips?.length > 0 ? 60 : 80 },
        ]
    }

    const getScoreColor = (score) => {
        if (score >= 75) return 'text-green-400'
        if (score >= 50) return 'text-yellow-400'
        return 'text-red-400'
    }

    return (
        <div className="min-h-screen bg-gray-950 px-6 py-10">
            <div className="max-w-5xl mx-auto">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white">🎯 Analyze a Job</h1>
                    <p className="text-gray-400 mt-1">Paste a job description and see how well you match</p>
                </div>

                {/* Input Section */}
                {!result && (
                    <div className="space-y-6">

                        {/* Job Description */}
                        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                            <label className="text-white font-semibold mb-3 block">📋 Job Description</label>
                            <textarea
                                rows={8}
                                placeholder="Paste the full job description here..."
                                value={jobDescription}
                                onChange={e => setJobDescription(e.target.value)}
                                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none"
                            />
                        </div>

                        {/* Skills */}
                        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                            <label className="text-white font-semibold mb-3 block">🛠 Your Skills</label>
                            <div className="flex gap-2 mb-4">
                                <input
                                    type="text"
                                    placeholder="Add a skill..."
                                    value={skillInput}
                                    onChange={e => setSkillInput(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && addSkill()}
                                    className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                                />
                                <button
                                    onClick={addSkill}
                                    className="bg-purple-600 hover:bg-purple-700 px-5 py-3 rounded-xl text-white transition"
                                >
                                    Add
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {skills.map((skill, i) => (
                                    <span
                                        key={i}
                                        className="bg-purple-900/40 border border-purple-600 text-purple-300 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                                    >
                                        {skill}
                                        <button onClick={() => removeSkill(skill)} className="hover:text-red-400 ml-1">×</button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="bg-red-900/30 border border-red-500 rounded-xl p-4 text-red-400">
                                ❌ {error}
                            </div>
                        )}

                        {/* Analyze Button */}
                        <button
                            onClick={handleAnalyze}
                            disabled={loading}
                            className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 py-4 rounded-xl text-white font-bold text-lg transition"
                        >
                            {loading ? '🔍 Analyzing...' : '⚡ Analyze My Match'}
                        </button>
                    </div>
                )}

                {/* Result Section */}
                {result && (
                    <div className="space-y-6">

                        {/* Score Card */}
                        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">
                            <h2 className="text-gray-400 mb-2">Match Score</h2>
                            <div className={`text-8xl font-bold mb-2 ${getScoreColor(result.matchScore)}`}>
                                {result.matchScore}%
                            </div>
                            <p className="text-white text-xl font-semibold">{result.jobTitle}</p>
                            <span className="bg-purple-900/40 border border-purple-600 text-purple-300 px-4 py-1 rounded-full text-sm mt-2 inline-block">
                                {result.jobLevel} Level
                            </span>
                            {result.salaryRange && (
                                <p className="text-gray-400 mt-3">💰 Salary: {result.salaryRange}</p>
                            )}
                        </div>

                        {/* Radar Chart */}
                        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                            <h2 className="text-white font-semibold mb-4">📊 Skills Radar</h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <RadarChart data={getRadarData()}>
                                    <PolarGrid stroke="#374151" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                                    <Radar dataKey="value" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                                        labelStyle={{ color: '#fff' }}
                                    />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Two Column */}
                        <div className="grid grid-cols-2 gap-6">

                            {/* Missing Skills */}
                            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                                <h2 className="text-white font-semibold mb-4">❌ Missing Skills</h2>
                                {result.missingSkills?.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {result.missingSkills.map((skill, i) => (
                                            <span key={i} className="bg-red-900/30 border border-red-600 text-red-300 px-3 py-1 rounded-full text-sm">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-green-400">🎉 No missing skills!</p>
                                )}
                            </div>

                            {/* Resume Tips */}
                            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                                <h2 className="text-white font-semibold mb-4">📝 Resume Tips</h2>
                                <ul className="space-y-2">
                                    {result.resumeTips?.map((tip, i) => (
                                        <li key={i} className="text-gray-300 text-sm flex gap-2">
                                            <span className="text-purple-400">→</span> {tip}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Learning Resources */}
                        {result.learningResources?.length > 0 && (
                            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                                <h2 className="text-white font-semibold mb-4">📚 Learning Resources</h2>
                                <div className="space-y-3">
                                    {result.learningResources.map((item, i) => (
                                        <div key={i} className="flex items-center justify-between bg-gray-800 rounded-xl px-4 py-3">
                                            <span className="text-purple-300 font-medium">{item.skill}</span>
                                            <span className="text-gray-400 text-sm">{item.resource}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Buttons */}
                        <div className="flex gap-4">
                            <button
                                onClick={() => setResult(null)}
                                className="flex-1 bg-gray-800 hover:bg-gray-700 py-3 rounded-xl text-white transition"
                            >
                                ← Analyze Another Job
                            </button>
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="flex-1 bg-purple-600 hover:bg-purple-700 py-3 rounded-xl text-white transition"
                            >
                                View Dashboard →
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}