
import Note from '../models/Note.js'

export const createNote = async (req, res, next) => {
    try {
        const { title, content, tags = [] } = req.body

        if (!title || !content) {
            return res.status(400).json({
                success: false,
                message: 'Please provide title and content.',
            })
        }

        const note = await Note.create({
            title,
            content,
            tags,
            owner: req.user._id,
        })

        return res.status(201).json({
            success: true,
            message: 'Note created successfully.',
            note,
        })
    } catch (error) {
        return next(error)
    }
}

export const getNotes = async (req, res, next) => {
    try {
        const {
            search = '',
            tag = '',
            page = 1,
            limit = 10,
        } = req.query

        const currentPage = Math.max(1, parseInt(page, 10) || 1)
        const perPage = Math.min(
            50,
            Math.max(1, parseInt(limit, 10) || 10)
        )

        // Build database query
        const query = {}

        // Normal users see only their own notes.
        // Admins can see all notes.
        if (req.user.role !== 'admin') {
            query.owner = req.user._id
        }

        // Search title and content
        if (search.trim()) {
            const searchRegex = new RegExp(
                search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
                'i'
            )

            query.$or = [
                { title: searchRegex },
                { content: searchRegex },
            ]
        }

        // Filter by tag
        if (tag.trim()) {
            query.tags = tag.trim().toLowerCase()
        }

        // Count matching notes
        const total = await Note.countDocuments(query)

        // Calculate pages
        const pages = Math.ceil(total / perPage)

        // Fetch paginated notes
        const notes = await Note.find(query)
            .populate('owner', 'name email')
            .sort({ createdAt: -1 })
            .skip((currentPage - 1) * perPage)
            .limit(perPage)

        return res.status(200).json({
            data: notes,
            page: currentPage,
            total,
            pages,
        })
    } catch (error) {
        return next(error)
    }
}

export const updateNote = async (req, res, next) => {
    try {
        const { title, content, tags } = req.body

        const note = await Note.findById(req.params.id)

        if (!note) {
            return res.status(404).json({
                success: false,
                message: 'Note not found.',
            })
        }

        if (note.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You can only update your own notes.',
            })
        }

        if (title !== undefined) note.title = title
        if (content !== undefined) note.content = content
        if (tags !== undefined) note.tags = tags

        await note.save()

        return res.status(200).json({
            success: true,
            message: 'Note updated successfully.',
            note,
        })
    } catch (error) {
        return next(error)
    }
}

export const deleteNote = async (req, res, next) => {
    try {
        const note = await Note.findById(req.params.id)

        if (!note) {
            return res.status(404).json({
                success: false,
                message: 'Note not found.',
            })
        }

        const isOwner =
            note.owner.toString() === req.user._id.toString()

        const isAdmin = req.user.role === 'admin'

        if (!isOwner && !isAdmin) {
            return res.status(403).json({
                success: false,
                message: 'You cannot delete this note.',
            })
        }

        await note.deleteOne()

        return res.status(200).json({
            success: true,
            message: 'Note deleted successfully.',
        })
    } catch (error) {
        return next(error)
    }
}
