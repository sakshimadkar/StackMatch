import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
    const [isDark, setIsDark] = useState(() => {
        const saved = localStorage.getItem('theme')
        return saved ? saved === 'dark' : false
    })

    useEffect(() => {
        localStorage.setItem('theme', isDark ? 'dark' : 'light')
        const root = document.documentElement
        if (isDark) {
            root.classList.add('dark')
            root.style.setProperty('--bg', '#1D3557')
            root.style.setProperty('--bg-card', '#162740')
            root.style.setProperty('--text', '#F1FAEE')
            root.style.setProperty('--text-muted', '#A8DADC')
            root.style.setProperty('--primary', '#A8DADC')
            root.style.setProperty('--border', '#2d4a6b')
        } else {
            root.classList.remove('dark')
            root.style.setProperty('--bg', '#F1FAEE')
            root.style.setProperty('--bg-card', '#ffffff')
            root.style.setProperty('--text', '#1D3557')
            root.style.setProperty('--text-muted', '#457B9D')
            root.style.setProperty('--primary', '#457B9D')
            root.style.setProperty('--border', '#A8DADC')
        }
    }, [isDark])

    const toggleTheme = () => setIsDark(!isDark)

    return (
        <ThemeContext.Provider value={{ isDark, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    return useContext(ThemeContext)
}