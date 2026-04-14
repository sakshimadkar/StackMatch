import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
    const { user, token } = useAuth()
    const [history, setHistory] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchHistory()
    }, [])

    const fetchHistory = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/analyze/history', {
                headers: { Authorization: `Bearer ${token}` }
            })
            setHistory(res.data.analyses)
        } catch (err) {
            console.log('History fetch error:', err.message)
        } finally {
            setLoading(false)
        }
    }

    const deleteAnalysis = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/analyze/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setHistory(history.filter(h => h._id !== id))
        } catch (err) {
            console.log('Delete error:', err.message)
        }
    }

    const getScoreColor = (score) => {
        if (score >= 75) return 'text-green-400'
        if (score >= 50) return 'text-yellow-400'
        return 'text-red-400'
    }

    const getScoreBg = (score) => {
        if (score >= 75) return 'bg-green-900/30 border-green-600'
        if (score >= 50) return 'bg-yellow-900/30 border-yellow-600'
        return 'bg-red-900/30 border-red-600'
    }

    return (
        <div className="min-h-screen bg-gray-950 px-6 py-10">
            <div className="max-w-5xl mx-auto">

                {/* Header */}
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-white">
                            Hey, {user?.name}! 👋
                        </h1>
                        <p className="text-gray-400 mt-1">Here are your past job analyses</p>
                    </div>
                    <Link
                        to="/analyze"
                        className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-xl text-white font-semibold transition"
                    >
                        + Analyze New Job
                    </Link>
                </div>

                {/* Skills Section */}
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8">
                    <h2 className="text-lg font-semibold text-white mb-3">🛠 Your Skills</h2>
                    {user?.skills?.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {user.skills.map((skill, i) => (
                                <span
                                    key={i}
                                    className="bg-purple-900/40 border border-purple-600 text-purple-300 px-3 py-1 rounded-full text-sm"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No skills added yet.</p>
                    )}
                </div>

                {/* History */}
                <h2 className="text-xl font-semibold text-white mb-4">📊 Analysis History</h2>

                {loading ? (
                    <div className="text-center text-purple-400 animate-pulse py-10">
                        Loading history...
                    </div>
                ) : history.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-lg mb-4">No analyses yet!</p>
                        <Link
                            to="/analyze"
                            className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-xl text-white font-semibold transition"
                        >
                            Analyze your first job
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {history.map((item) => (
                            <div
                                key={item._id}
                                className={`border rounded-2xl p-6 ${getScoreBg(item.matchScore)}`}
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="text-white font-semibold text-lg">
                                            {item.jobTitle}
                                        </h3>
                                        <p className="text-gray-400 text-sm mt-1">
                                            {item.jobLevel} Level • {new Date(item.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={`text-3xl font-bold ${getScoreColor(item.matchScore)}`}>
                                            {item.matchScore}%
                                        </span>
                                        <button
                                            onClick={() => deleteAnalysis(item._id)}
                                            className="text-gray-500 hover:text-red-400 transition text-xl"
                                        >
                                            🗑
                                        </button>
                                    </div>
                                </div>

                                {/* Missing Skills */}
                                {item.missingSkills?.length > 0 && (
                                    <div className="mt-4">
                                        <p className="text-gray-400 text-sm mb-2">Missing Skills:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {item.missingSkills.map((skill, i) => (
                                                <span
                                                    key={i}
                                                    className="bg-red-900/30 border border-red-600 text-red-300 px-2 py-1 rounded-full text-xs"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}