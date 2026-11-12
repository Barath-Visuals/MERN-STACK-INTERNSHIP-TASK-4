
import { useEffect, useState } from 'react'
import api from '../service/api'

export default function NotesDashboard({ user, onLogout }) {
    const [notes, setNotes] = useState([])
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')

    const [activeView, setActiveView] = useState('all')
    const [newNotesCount, setNewNotesCount] = useState(0)

    const [editingId, setEditingId] = useState(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    // Fetch notes
    const fetchNotes = async () => {
        try {
            setError('')
            const response = await api.get('/api/notes')
            setNotes(response.data.notes)
        } catch (err) {
            setError(
                err.response?.data?.message || 'Failed to load notes.'
            )
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchNotes()
    }, [])

    // Sidebar navigation
    const handleNavigation = (view) => {
        setActiveView(view)
        setError('')
        setSuccess('')

        if (view === 'all') {
            setNewNotesCount(0)
        }
    }

    // Create / Update note
    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!title.trim() || !content.trim()) {
            setError('Please enter a title and content.')
            return
        }

        try {
            setSaving(true)
            setError('')
            setSuccess('')

            if (editingId) {
                await api.post(`/api/notes/${editingId}`, {
                    title,
                    content,
                })

                setSuccess('Note updated successfully.')
            } else {
                await api.post('/api/notes', {
                    title,
                    content,
                })

                setNewNotesCount((prev) => prev + 1)
                setSuccess('Note created successfully.')
            }

            setTitle('')
            setContent('')
            setEditingId(null)

            // Refresh notes immediately
            await fetchNotes()

        } catch (err) {
            setError(
                err.response?.data?.message || 'Failed to save note.'
            )
        } finally {
            setSaving(false)
        }
    }

    // Edit note
    const handleEdit = (note) => {
        setEditingId(note._id)
        setTitle(note.title)
        setContent(note.content)
        setActiveView('create')
        setError('')
        setSuccess('')

        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    // Delete note
    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this note?')) {
            return
        }

        try {
            setError('')
            await api.delete(`/api/notes/${id}`)
            await fetchNotes()
            setSuccess('Note deleted successfully.')
        } catch (err) {
            setError(
                err.response?.data?.message || 'Failed to delete note.'
            )
        }
    }

    // Cancel editing
    const cancelEdit = () => {
        setEditingId(null)
        setTitle('')
        setContent('')
        setError('')
        setSuccess('')
    }

    return (
        <main className="flex h-screen flex-col overflow-hidden bg-[#f5f5f7] text-neutral-900">

            <nav className="flex h-20 shrink-0 items-center justify-between border-b border-black/5 bg-white px-6 md:px-10">

                <div className="flex items-center gap-3">
                    <span className="text-xl font-semibold tracking-tight">
                        notely
                    </span>
                </div>

                <div className="flex items-center gap-4">
                    <span className="hidden text-sm text-neutral-500 sm:block">
                        {user.name}
                    </span>

                    <button
                        onClick={onLogout}
                        className="rounded-full border border-black/10 px-5 py-2 text-sm font-medium transition hover:bg-black hover:text-white"
                    >
                        Logout
                    </button>
                </div>
            </nav>

            <div className="flex min-h-0 flex-1 overflow-hidden">

                <aside className="flex h-full w-60 shrink-0 flex-col overflow-y-auto border-r border-black/5 bg-white px-4 py-8 max-md:w-16 max-md:px-2">

                    <p className="mb-5 px-3 text-[10px] font-semibold tracking-[0.2em] text-neutral-400 max-md:hidden">
                        WORKSPACE
                    </p>

                    <div className="space-y-2">

                        {/* All Notes */}
                        <button
                            onClick={() => handleNavigation('all')}
                            className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-sm transition ${
                                activeView === 'all'
                                    ? 'bg-neutral-900 font-medium text-white'
                                    : 'text-neutral-500 hover:bg-neutral-100 hover:text-black'
                            }`}
                        >
                            <span className="flex items-center gap-3">
                                <span className="text-lg">▤</span>
                                <span className="max-md:hidden">
                                    All Notes
                                </span>
                            </span>

                            {newNotesCount > 0 && (
                                <span className={`rounded-full px-2 py-1 text-[10px] font-semibold max-md:absolute max-md:ml-8 ${
                                    activeView === 'all'
                                        ? 'bg-white text-black'
                                        : 'bg-red-500 text-white'
                                }`}>
                                    <span className="max-md:hidden">
                                        {newNotesCount} New
                                    </span>
                                    <span className="md:hidden">
                                        {newNotesCount}
                                    </span>
                                </span>
                            )}
                        </button>

                        {/* Create Notes */}
                        <button
                            onClick={() => handleNavigation('create')}
                            className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${
                                activeView === 'create'
                                    ? 'bg-neutral-900 font-medium text-white'
                                    : 'text-neutral-500 hover:bg-neutral-100 hover:text-black'
                            }`}
                        >
                            <span className="text-lg">＋</span>
                            <span className="max-md:hidden">
                                Create Notes
                            </span>
                        </button>

                    </div>

                    {/* Sidebar footer */}
                    <div className="mt-auto border-t border-neutral-100 pt-5 max-md:hidden">
                        <p className="px-3 text-xs text-neutral-400">
                            Logged in as
                        </p>

                        <p className="mt-2 truncate px-3 text-sm font-medium">
                            {user.name}
                        </p>

                        <p className="mt-1 px-3 text-xs capitalize text-neutral-400">
                            {user.role}
                        </p>
                    </div>

                </aside>

                <section className="h-full min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain px-6 py-10 md:px-10 lg:px-14">
                    {activeView === 'all' && (
                        <div className="mx-auto max-w-6xl">

                            <div className="mb-10">
                                <span className="text-xs font-semibold tracking-[0.2em] text-neutral-400">
                                    YOUR WORKSPACE
                                </span>

                                <h1 className="mt-3 text-4xl font-semibold tracking-tight">
                                    {user.role === 'admin'
                                        ? 'All notes.'
                                        : 'Your notes.'}
                                </h1>

                                <p className="mt-3 text-sm text-neutral-500">
                                    All your thoughts, organized in one place.
                                </p>
                            </div>

                            <div className="mb-6 flex items-center justify-between">
                                <h2 className="text-xl font-semibold">
                                    All notes
                                </h2>

                                <span className="rounded-full bg-white px-4 py-2 text-xs text-neutral-500">
                                    {notes.length} {notes.length === 1 ? 'note' : 'notes'}
                                </span>
                            </div>

                            {loading ? (
                                <p className="py-16 text-center text-sm text-neutral-400">
                                    Loading notes...
                                </p>
                            ) : notes.length === 0 ? (
                                <div className="rounded-2xl border border-dashed border-neutral-300 bg-white py-20 text-center">
                                    <h3 className="text-lg font-medium">
                                        No notes yet
                                    </h3>

                                    <p className="mt-2 text-sm text-neutral-400">
                                        Start by creating your first note.
                                    </p>

                                    <button
                                        onClick={() => handleNavigation('create')}
                                        className="mt-6 rounded-xl bg-neutral-900 px-5 py-3 text-sm text-white hover:bg-neutral-700"
                                    >
                                        Create your first note
                                    </button>
                                </div>
                            ) : (
                                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

                                    {notes.map((note) => (
                                        <article
                                            key={note._id}
                                            className="flex flex-col rounded-2xl border border-black/5 bg-white p-6 transition hover:-translate-y-1 hover:border-black/10"
                                        >
                                            <div className="flex-1">
                                                <h3 className="break-words text-lg font-semibold">
                                                    {note.title}
                                                </h3>

                                                <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-7 text-neutral-500">
                                                    {note.content}
                                                </p>
                                            </div>

                                            {user.role === 'admin' && note.user && (
                                                <p className="mt-5 border-t border-neutral-100 pt-4 text-xs text-neutral-400">
                                                    By: {note.user.name || 'Unknown user'}
                                                </p>
                                            )}

                                            <div className="mt-5 flex items-center justify-between border-t border-neutral-100 pt-4">
                                                <span className="text-xs text-neutral-400">
                                                    {new Date(note.createdAt).toLocaleDateString()}
                                                </span>

                                                <div className="flex gap-3">
                                                    <button
                                                        onClick={() => handleEdit(note)}
                                                        className="text-xs font-medium text-neutral-600 hover:text-black"
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        onClick={() => handleDelete(note._id)}
                                                        className="text-xs font-medium text-red-500 hover:text-red-700"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </article>
                                    ))}

                                </div>
                            )}

                        </div>
                    )}

                    {/* Create Notes View */}
                    {activeView === 'create' && (
                        <div className="mx-auto max-w-4xl">

                            <div className="mb-10">
                                <span className="text-xs font-semibold tracking-[0.2em] text-neutral-400">
                                    YOUR WORKSPACE
                                </span>

                                <h1 className="mt-3 text-4xl font-semibold tracking-tight">
                                    {editingId ? 'Edit note.' : 'Create a note.'}
                                </h1>

                                <p className="mt-3 text-sm text-neutral-500">
                                    Write down your thoughts before you forget them.
                                </p>
                            </div>

                            <form
                                onSubmit={handleSubmit}
                                className="rounded-2xl border border-black/5 bg-white p-6 md:p-8"
                            >
                                <div className="mb-6 flex items-center justify-between">
                                    <h2 className="text-lg font-semibold">
                                        {editingId ? 'Edit your note' : 'New note'}
                                    </h2>

                                    {editingId && (
                                        <button
                                            type="button"
                                            onClick={cancelEdit}
                                            className="text-sm text-neutral-500 hover:text-black"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        placeholder="Note title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        maxLength={100}
                                        required
                                        className="w-full rounded-xl border border-neutral-200 px-4 py-3.5 text-sm outline-none transition focus:border-black"
                                    />

                                    <textarea
                                        placeholder="Write your thoughts here..."
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        rows={8}
                                        required
                                        className="w-full resize-y rounded-xl border border-neutral-200 px-4 py-3.5 text-sm leading-7 outline-none transition focus:border-black"
                                    />
                                </div>

                                {error && (
                                    <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                                        {error}
                                    </p>
                                )}

                                {success && (
                                    <p className="mt-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
                                        {success}
                                    </p>
                                )}

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="mt-6 rounded-xl bg-neutral-900 px-6 py-3.5 text-sm font-medium text-white transition hover:bg-neutral-700 disabled:opacity-50"
                                >
                                    {saving
                                        ? 'Saving...'
                                        : editingId
                                            ? 'Save changes'
                                            : 'Create note'}
                                </button>
                            </form>

                        </div>
                    )}

                </section>
            </div>
        </main>
    )
}
