import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api/axios'
import loginBg from '../assets/login-bg.jpg'
import logo from '../assets/ai.png'

function Login() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      if (isLogin) {
        const res = await API.post('/auth/login', { email, password })
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('user', JSON.stringify(res.data.user))
        navigate('/dashboard')
      } else {
        await API.post('/auth/register', { name, email, password, company })
        setIsLogin(true)
        setError('')
        alert('Account Created! Now try Logging in.')
      }
    } catch (err) {
      setError(isLogin ? 'Email or password is incorrect!' : 'Registration failed!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden bg-surface-950">

      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${loginBg})` }}
      ></div>

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-surface-950/80"></div>

      {/* Brand glow accent */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative bg-surface-900/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl shadow-black/50 w-full max-w-md border border-surface-700">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-25 h-25 rounded-2xl mb-4 overflow-hidden border border-brand-500/30 shadow-lg shadow-brand-900/40">
            <img src={logo} alt="Hire IQ" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-3xl font-bold text-white">Hire IQ</h1>
          <p className="text-gray-400 mt-1">AI-Powered Hiring System</p>
        </div>

        {/* Tabs */}
        <div className="flex bg-surface-800 rounded-xl p-1 mb-6">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
              isLogin ? 'bg-brand-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
              !isLogin ? 'bg-brand-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Register
          </button>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-400 p-3 rounded-lg mb-4 text-sm">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-surface-800 text-white p-3 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 border border-surface-700"
                  placeholder="Hassan Ahmad"
                  required
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Company Name</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full bg-surface-800 text-white p-3 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 border border-surface-700"
                  placeholder="Company name"
                  required
                />
              </div>
            </>
          )}

          <div>
            <label className="text-gray-400 text-sm mb-1 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-surface-800 text-white p-3 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 border border-surface-700"
              placeholder="email@company.com"
              required
            />
          </div>

          <div>
            <label className="text-gray-400 text-sm mb-1 block">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-surface-800 text-white p-3 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 border border-surface-700"
              placeholder="********"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-500 hover:to-brand-600 text-white font-semibold p-3 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-brand-900/30"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                {isLogin ? 'Logging in...' : 'Registering Account...'}
              </>
            ) : (
              isLogin ? '🚀 Login' : '✨ Register'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
