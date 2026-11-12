import { useState } from "react";
import api from './service/api';
import NotesDashboard from "./component/NotesDashboard";

export default function App () {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    })
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user')
        return savedUser ? JSON.parse(savedUser) : null
    })

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name] : e.target.value,
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        setError('')
        setSuccess('')
        setLoading(true)

        try{
            const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register'
            const payload = isLogin
                ? {
                    email: formData.email,
                    password: formData.password,
                } : formData
            const response = await api.post(endpoint, payload)
            const data = response.data

            localStorage.setItem('token', data.token)
            localStorage.setItem('user', JSON.stringify(data.user))

            setUser(data.user)
            setSuccess(
                isLogin
                    ? 'Login Successful!'
                    : 'Account created successfully!'
            )
        } catch (error) {
            setError(
                err.response?.data?.message || 'Something went wrong.'
            )
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')

        setUser(null)

        setFormData({
            name: '',
            email: '',
            password: '',
        })

        setIsLogin(true)
        setError('')
        setSuccess('')
    }
    // user page
    if(user) {
        return(

            <NotesDashboard user={user} onLogout={handleLogout}/>
            // <main className="min-h-screen bg-[#f5f5f7] text-[#171717] ">
            //     <nav className="flex items-center justify-between border-b border-black/5 bg-white px-6 py-5 md:px-12">
            //         <div className="flex items-center gap-3">
            //             <span className="text-xl font-semibold tracking-tight">
            //                 notely
            //             </span>
            //         </div>

            //         <button
            //             onClick={handleLogout}
            //             className="rounded-full border border-black/10 px-5 py-2 text-sm font-medium transition hover:bg-black hover:text-white"
            //         >
            //             Logout
            //         </button>
            //     </nav>

            //     <section className="mx-auto max-w-5xl px-6 py-20 md:px-12">
            //         <span className="text-xs font-semibold tracking-[0.1em] text-neutral-400">
            //             Your Workspace
            //         </span>
            //         <h1 className="mt-5 text-4xl font-semibold tracking-tight md:text-6xl">Welcome back, {user.name}</h1>
            //         <p className="mt-4 max-w-lg text-base leading-7 text-neutral-500">you're successfully connected to your Notes account</p>

            //         <div className="mt-12 flex flex-wrap items-center gap-5 rounded-2xl border border-black/5 bg-white p-6">
            //             <div className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-900 text-xl font-semibold text-white">
            //                 {user.name?.charAt(0).toUpperCase()}
            //             </div>
            //             <div className="min-w-0 flex-1">
            //                 <h3 className="font-semibold">
            //                     {user.name}
            //                 </h3>
            //                 <p className="mt-1 text-sm text-netural-500">
            //                     {user.email}
            //                 </p>
            //             </div>
            //             <span className="rounded-full bg-neutral-100 px-4 py-2 text-xs font-medium capitalize text-neutral-600">
            //                 {user.role}
            //             </span>
            //         </div>

            //         <p className="mt-8 text-sm text-neutral-400">
            //             {user.role === 'admin'
            //                 ? 'Admin workspace will be built in the next step.'
            //                 : 'Your personal Notes dashboard will be built in the next step.'
            //             }
            //         </p>
            //     </section>
            // </main>
        )
    }

    return(
        <main className="grid min-h-screen bg-white lg:grid-cols-2">
            {/* left side content on account portal */}
            <section className="relative hidden min-h-screen overflow-hidden bg-[#171717] text-white lg:block">
                <div className="flex h-full min-h-screen flex-col justify-between p-12 xl:p-16">
                    <div className="flex items-center gap-3">
                        <span className="text-xl font-semibold tracking-tight">
                            notely
                        </span>
                    </div>

                    <div className="flex flex-1 items-center justify-center py-16">
                        <div className="w-full max-w-md -rotate-2 rounded-2xl border border-white/10 bg-[#222222] p-8 shadow-2xl transition duration-500 hover:rotate-0">
                            <div className="flex gap-2">
                                <span className="h-2 w-2 rounded-full bg-white/30" />
                                <span className="h-2 w-2 rounded-full bg-white/30" />
                                <span className="h-2 w-2 rounded-full bg-white/30" />
                            </div>

                            <span className="mt-12 block text-[10px] font-semibold tracking-[0.15em] text-neutral-500">
                                Your Ideas, Organized
                            </span>

                            <h2 className="mt-5 text-5xl font-medium leading-[1.1] tracking-tight">
                                Make space
                                <br/>
                                for your ideas
                            </h2>

                            <p className="mt-5 max-w-xs text-sm leading-7 text-neutral-400">
                                Capture thoughts, organize your work,
                                and keep everything in one place.
                            </p>

                            <div className="mt-10 space-y-3">
                                <div className="h-2 w-full rounded-full bg-white/10" />
                                <div className="h-2 w-4/5 rounded-full bg-white/10" />
                                <div className="h-2 w-3/5 rounded-full bg-white/10" />
                            </div>

                            <div className="mt-12 flex items-center justify-between border-t border-white/10 pt-5 text-xs text-neutral-500">
                                <span>My workspace</span>
                                <span className="text-lg">✳</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-neutral-500">
                        <p>Less clutter. More clarity.</p>
                        <span>© 2026 NOTELY</span>
                    </div>
                </div>
            </section>
            
            {/* right side account portal heading, inputs */}
            <section className="flex min-h-screen items-center justify-center px-6 py-12 sm:px-12">
                <div className="w-full max-w-md">
                    <div className="mb-16 flex items-center gap-3 lg:hidden">
                        <span className="text-xl font-semibold tracking-tight">
                            notely
                        </span>
                    </div>
                    <div>
                        <span className="text-xs font-semibold text-neutral-400">{isLogin ? 'Welcome Back' : 'Get Started'}</span>
                        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">{isLogin ? 'Sign in to your account' : 'Create your account'}</h1>
                        <p className="mt-3 text-sm leading-6 text-neutral-500">
                            {isLogin ? 'Enter your details to access your workspace.' : 'Create an account to start organizing your notes.'}
                        </p>
                    </div>
                    <div className="mt-10 grid grid-cols-2 rounded-xl bg-neutral-100 p-1">
                        <button
                            type="button"
                            onClick={() => {
                                setIsLogin(true)
                                setError('')
                                setSuccess('')
                            }}
                            className={`rounded-lg py-3 text-sm font-medium transition ${
                                isLogin
                                    ? 'bg-white text-black shadow-sm'
                                    : 'text-neutral-500 hover:text-black'
                            }`}
                        >
                            Sign in
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setIsLogin(false)
                                setError('')
                                setSuccess('')
                            }}
                            className={`rounded-lg py-3 text-sm font-medium transition ${
                                !isLogin
                                    ? 'bg-white text-black shadow-sm'
                                    : 'text-neutral-500 hover:text-black'
                            }`}
                        >
                            Create account
                        </button>
                    </div>
                    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                        {!isLogin && (
                            <div>
                                <label
                                    htmlFor="name"
                                    className="mb-2 block text-sm font-medium text-neutral-700"
                                >
                                    Full name
                                </label>

                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    placeholder="Enter your name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    minLength={2}
                                    maxLength={50}
                                    required
                                    className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3.5 text-sm outline-none transition placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/5"
                                />
                            </div>
                        )}

                        <div>
                            <label
                                htmlFor="email"
                                className="mb-2 block text-sm font-medium text-neutral-700"
                            >
                                Email address
                            </label>

                            <input
                                id="email"
                                type="email"
                                name="email"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3.5 text-sm outline-none transition placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/5"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="password"
                                className="mb-2 block text-sm font-medium text-neutral-700"
                            >
                                Password
                            </label>

                            <input
                                id="password"
                                type="password"
                                name="password"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                                minLength={8}
                                required
                                className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3.5 text-sm outline-none transition placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/5"
                            />

                            {!isLogin && (
                                <span className="mt-2 block text-xs text-neutral-400">
                                    Use at least 8 characters.
                                </span>
                            )}
                        </div>

                        {error && (
                            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                                {success}
                            </div>
                        )}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-xl bg-neutral-900 px-5 py-4 text-sm font-medium text-white transition hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading
                                ? 'Please wait...'
                                : isLogin
                                    ? 'Sign in to your account'
                                    : 'Create my account'}
                        </button>
                    </form>
                    <p className="mt-8 text-center text-sm text-neutral-500">

                        {isLogin
                            ? "Don't have an account?"
                            : 'Already have an account?'}

                        <button
                            type="button"
                            onClick={() => {
                                setIsLogin(!isLogin)
                                setError('')
                                setSuccess('')
                            }}
                            className="ml-2 font-semibold text-neutral-900 hover:underline"
                        >
                            {isLogin ? 'Sign up' : 'Sign in'}
                        </button>

                    </p>
                </div>
            </section>
        </main>
    )
}