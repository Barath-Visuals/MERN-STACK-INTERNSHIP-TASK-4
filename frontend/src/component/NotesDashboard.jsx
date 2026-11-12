
import { useEffect, useState } from 'react'
import api from '../service/api'

export default function NotesDashboard({ user, onLogout }) {
    const [notes, setNotes] = useState([])
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')

    const [activeView, setActiveView] = useState('all')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [newNotesCount, setNewNotesCount] = useState(0)

    const [editingId, setEditingId] = useState(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [toast, setToast] = useState(null)
    const [deletingId, setDeletingId] = useState(null)
    const [noteToDelete, setNoteToDelete] = useState(null)

    const [searchQuery, setSearchQuery] = useState('')
    const [tagFilter, setTagFilter] = useState('')
    const [tagsInput, setTagsInput] = useState('')

    const [page, setPage] = useState(1)
    const [limit] = useState(10)
    const [total, setTotal] = useState(0)
    const [pages, setPages] = useState(0)

    // Fetch notes
    const fetchNotes = async () => {
        try {
            setError('')
            setLoading(true)

            const response = await api.get('/api/notes', {
                params: {
                    search: searchQuery,
                    tag: tagFilter,
                    page,
                    limit,
                }
            })
            setNotes(response.data.data)
            setTotal(response.data.total)
            setPages(response.data.pages)
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
    }, [searchQuery, tagFilter, page])

    // Automatically dismiss toast after 3 seconds
    useEffect(() => {
        if (!toast) return

        const timer = setTimeout(() => {
            setToast(null)
        }, 3000)

        return () => clearTimeout(timer)
    }, [toast])

    // Display toast notification
    const showToast = (type, message) => {
        setToast({ type, message })
    }

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
            showToast('error', 'Please enter a title and content.')
            return
        }

        const tags = tagsInput
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean)

        try {
            setSaving(true)
            setError('')
            setSuccess('')

            if (editingId) {
                await api.post(`/api/notes/${editingId}`, {
                    title,
                    content,
                    tags,
                })

                setSuccess('Note updated successfully.')
                showToast('success', 'Note updated successfully.')
            } else {
                await api.post('/api/notes', {
                    title,
                    content,
                    tags,
                })

                setNewNotesCount((prev) => prev + 1)
                setSuccess('Note created successfully.')
                showToast('success', 'Note created successfully.')
            }

            setTitle('')
            setContent('')
            setTagsInput('')
            setEditingId(null)
            setIsModalOpen(false)

            // Refresh notes immediately
            if(page !== 1) {
                setPage(1)
            } else {
                await fetchNotes()
            }

        } catch (err) {
            setError(
                err.response?.data?.message || 'Failed to save note.'
            )
            showToast('error', message)
        } finally {
            setSaving(false)
        }
    }

    // Edit note
    const handleEdit = (note) => {
        setEditingId(note._id)
        setTitle(note.title)
        setContent(note.content)
        setTagsInput(note.tags?.join(', ') || '')
        setActiveView('all')
        setError('')
        setSuccess('')
        setIsModalOpen(true)

        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    // Delete note
    const handleDelete = async () => {
        if (!noteToDelete) return

        try {
            setDeletingId(noteToDelete._id)
            setError('')

            await api.delete(`/api/notes/${noteToDelete._id}`)

            setSuccess('Note deleted successfully.')
            showToast('success', 'Note deleted successfully.')

            setNoteToDelete(null)
            await fetchNotes()

        } catch (err) {
            const message =
                err.response?.data?.message || 'Failed to delete note.'

            setError(message)
            showToast('error', message)

        } finally {
            setDeletingId(null)
        }
    }

    // Cancel editing
    const cancelEdit = () => {
        setIsModalOpen(false)
        setEditingId(null)
        setTitle('')
        setContent('')
        setError('')
        setSuccess('')
        setTagsInput('')
    }

    // const filteredNotes = notes.filter((note) => {
    //     const query = searchQuery.toLowerCase()

    //     return (
    //         note.title.toLowerCase().includes(query) ||
    //         note.content.toLowerCase().includes(query) ||
    //         note.user?.name?.toLowerCase().includes(query)
    //     )
    // })

    return (
        <>
            <main className="flex h-screen flex-col overflow-hidden bg-[#f5f5f7] text-neutral-900">

                <nav className="flex h-20 shrink-0 items-center justify-between border-b border-black/5 bg-white px-6 md:px-10">

                    <div className="flex items-center gap-3">
                        <span className="text-xl font-semibold tracking-tight">
                            notely
                        </span>
                    </div>

                    <div className="flex items-center gap-4">

                        {/* Hover Profile Card */}
                        <div className="group relative">

                            <button
                                type="button"
                                className="rounded-full px-3 py-2 text-sm text-neutral-500 transition hover:bg-neutral-100 hover:text-black"
                            >
                                {user.name}
                            </button>

                            <div className="invisible absolute right-0 top-full z-50 w-64 pt-3 opacity-0 translate-y-2 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">

                                <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-xl">

                                    {/* User identity */}
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-lg font-semibold text-white">
                                            {user.name?.charAt(0).toUpperCase()}
                                        </div>

                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-semibold text-neutral-900">
                                                {user.name}
                                            </p>

                                            <p className="mt-1 text-xs capitalize text-neutral-400">
                                                {user.role}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="my-4 border-t border-neutral-100" />

                                    {/* Profile details */}
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-[10px] font-semibold tracking-wider text-neutral-400">
                                                EMAIL ADDRESS
                                            </p>

                                            <p className="mt-1 break-all text-sm text-neutral-700">
                                                {user.email}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-[10px] font-semibold tracking-wider text-neutral-400">
                                                ACCOUNT TYPE
                                            </p>

                                            <p className="mt-1 text-sm capitalize text-neutral-700">
                                                {user.role}
                                            </p>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>

                        {/* Logout */}
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
                                onClick={() => {
                                    setActiveView('all')
                                    setEditingId(null)
                                    setTitle('')
                                    setContent('')
                                    setTagsInput('')
                                    setError('')
                                    setSuccess('')
                                    setIsModalOpen(true)
                                }}
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

                                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                    <h2 className="text-xl font-semibold">
                                        All notes
                                    </h2>

                                    <span className="rounded-full bg-white px-4 py-2 text-xs text-neutral-500">
                                        {total} {total === 1 ? 'note' : 'notes'}
                                    </span>
                                </div>

                                <div className='mb-8 grid gap-3 sm:grid-cols-2'>
                                    <input
                                        type="text"
                                        placeholder='Search notes...'
                                        value={searchQuery}
                                        onChange={(e) => {
                                            setSearchQuery(e.target.value)
                                            setPage(1)
                                        }}
                                        className='w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition'
                                    />
                                    <input
                                        type="text"
                                        placeholder='Filter by tag (e.g. javascript)'
                                        value={tagFilter}
                                        onChange={(e) => {
                                            setTagFilter(e.target.value)
                                            setPage(1)
                                        }}
                                        className='w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition'
                                    />
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
                                                    <div className='flex items-center justify-between w-full'>
                                                        <h3 className="break-words text-lg font-semibold">
                                                            {note.title}
                                                        </h3>
                                                        {note.tags?.length > 0 && (
                                                            <div className="flex flex-wrap gap-2">
                                                                {note.tags.map((tag) => (
                                                                    <span
                                                                        key={tag}
                                                                        className="rounded-full bg-neutral-100 px-3 py-1 text-[11px] font-medium text-neutral-600"
                                                                    >
                                                                        #{tag}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>

                                                    <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-7 text-neutral-500">
                                                        {note.content}
                                                    </p>
                                                </div>

                                                {user.role === 'admin' && note.owner && (
                                                    <p className="mt-5 border-t border-neutral-100 pt-4 text-xs text-neutral-400">
                                                        By: {note.owner.name || 'Unknown user'}
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
                                                            onClick={() => setNoteToDelete(note)}
                                                            disabled={deletingId === note._id}
                                                            className="text-xs font-medium text-red-500 transition hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            </article>
                                        ))}

                                    </div>

                                )}
                                {pages > 0 && (
                                    <div className="mt-10 flex items-center justify-between border-t border-neutral-200 pt-6">
                                        <p className="text-sm text-neutral-500">
                                            Page {page} of {pages}
                                        </p>

                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => setPage((prev) => prev - 1)}
                                                disabled={page <= 1 || loading}
                                                className="rounded-xl border border-neutral-200 bg-white px-5 py-2.5 text-sm transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40"
                                            >
                                                Previous
                                            </button>

                                            <button
                                                onClick={() => setPage((prev) => prev + 1)}
                                                disabled={page >= pages || loading}
                                                className="rounded-xl bg-neutral-900 px-5 py-2.5 text-sm text-white transition hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-40"
                                            >
                                                Next
                                            </button>
                                        </div>
                                    </div>
                                )}

                            </div>
                        )}

                        {/* Create Notes View */}
                        {/* {activeView === 'create' && (
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

                                        <input
                                            type="text"
                                            placeholder="Tags (comma separated, e.g. javascript, react)"
                                            value={tagsInput}
                                            onChange={(e) => setTagsInput(e.target.value)}
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
                        )} */}

                    </section>
                </div>

                {noteToDelete && (
                    <div
                        className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
                        onClick={() => {
                            if (!deletingId) setNoteToDelete(null)
                        }}
                    >
                        <div
                            className="w-full max-w-sm rounded-2xl border border-black/5 bg-white p-6"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h2 className="text-lg font-semibold text-neutral-900">
                                Delete this note?
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-neutral-500">
                                Are you sure you want to delete "{noteToDelete.title}"?
                                This action cannot be undone.
                            </p>

                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setNoteToDelete(null)}
                                    disabled={deletingId !== null}
                                    className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-600 transition hover:bg-neutral-50 disabled:opacity-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    disabled={deletingId !== null}
                                    className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {deletingId ? 'Deleting...' : 'Delete Note'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {isModalOpen && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
                        onClick={cancelEdit}
                    >
                        <div
                            className="w-full max-w-2xl rounded-2xl border border-black/5 bg-white p-6 md:p-8"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="mb-7 flex items-start justify-between">
                                <div>
                                    <span className="text-xs font-semibold tracking-[0.2em] text-neutral-400">
                                        YOUR WORKSPACE
                                    </span>

                                    <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                                        {editingId ? 'Edit note.' : 'Create a note.'}
                                    </h2>

                                    <p className="mt-2 text-sm text-neutral-500">
                                        Write down your thoughts before you forget them.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={cancelEdit}
                                    className="flex h-9 w-9 items-center justify-center rounded-full text-xl text-neutral-400 transition hover:bg-neutral-100 hover:text-black"
                                    aria-label="Close modal"
                                >
                                    ×
                                </button>
                            </div>

                            {/* Modal Form */}
                            <form onSubmit={handleSubmit}>
                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        placeholder="Note title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        maxLength={120}
                                        required
                                        className="w-full rounded-xl border border-neutral-200 px-4 py-3.5 text-sm outline-none transition focus:border-black"
                                    />

                                    <input
                                        type="text"
                                        placeholder="Tags (comma separated, e.g. javascript, react)"
                                        value={tagsInput}
                                        onChange={(e) => setTagsInput(e.target.value)}
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

                                {/* Error Message */}
                                {error && (
                                    <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                                        {error}
                                    </p>
                                )}

                                {/* Success Message */}
                                {success && (
                                    <p className="mt-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
                                        {success}
                                    </p>
                                )}

                                {/* Actions */}
                                <div className="mt-6 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={cancelEdit}
                                        disabled={saving}
                                        className="rounded-xl border border-neutral-200 px-5 py-3 text-sm font-medium text-neutral-600 transition hover:bg-neutral-100 disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="rounded-xl bg-neutral-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {saving
                                            ? 'Saving...'
                                            : editingId
                                                ? 'Save changes'
                                                : 'Create note'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {toast && (
                    <div
                        className={`fixed right-6 top-24 z-[100] flex items-center gap-3 rounded-xl border bg-white px-5 py-4 shadow-lg transition-all duration-300 ${
                            toast.type === 'success'
                                ? 'border-green-200'
                                : 'border-red-200'
                        }`}
                    >
                        <span className={`flex h-8 w-8 items-center justify-center rounded-full text-sm ${
                            toast.type === 'success'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                        }`}>
                            {toast.type === 'success' ? '✓' : '!'}
                        </span>

                        <p className="text-sm font-medium text-neutral-800">
                            {toast.message}
                        </p>

                        <button
                            onClick={() => setToast(null)}
                            className="ml-3 text-neutral-400 hover:text-black"
                        >
                            ×
                        </button>
                    </div>
                )}
            </main>
        </>
    )
}
