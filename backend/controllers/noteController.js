import Note from '../models/Note.js';

export const createNote = async (req, res) => {
    try{
        const { title, content } = req.body;

        if(!title || !content) {
            return res.status(400).json({
                success: false,
                message: "Please provide title and content"
            })
        }

        const note = await Note.create({
            title,
            content,
            user: req.user._id,
        })

        return res.status(201).json({
            success: true,
            message: 'Note created successfully',
            note
        })
    } catch (error) {
        console.error(`Create note error : ${error.message}`)
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

export const getNotes = async (req, res) => {
    try{
        let notes

        if(req.user.role === 'admin') {
            notes = await Note.find()
            .populate('user', 'name email')
            .sort({createdAt: -1})
        } else {
            notes = await Note.find({
                user: req.user._id
            }).sort({createdAt: -1})
        }

        return res.status(200).json({
            success: true,
            count: notes.length,
            notes
        })
    } catch (error) {
        console.error('Get notes error :', error.message)

        return res.status(500).json({
            success: false,
            message: 'Failed to fetch notes.'
        })
    }
}

export const updateNote = async (req, res) => {
    try{
        const {title, content} = req.body;

        const note = await Note.findById(req.params.id)

        if(!note) {
            return res.status(404).json({
                success: false,
                message: 'Note not found'
            })
        }

        if(
            note.user.toString() !== req.user._id.toString() &&
            req.user.role !== 'admin'
        ) {
            return res.status(403).json({
                success: false,
                message: 'You cannot update this note.'
            })
        }

        if(title !== undefined) note.title = title
        if(content !== undefined) note.content = content

        await note.save()

        return res.status(200).json({
            success: true,
            message: 'Note updated successfully.'
        })
    } catch (error) {
        console.error('Update note error:', error.message)

        return res.status(500).json({
            success: false,
            message: 'Failed to update note',
        })
    }
}

export const deleteNote = async (req, res) => {
    try{
        const note = await Note.findById(req.params.id)

        if(!note) {
            return res.status(404).json({
                success: false,
                message: 'Note not found'
            })
        }

        if(
            note.user.toString() !== req.user._id.toString() &&
            req.user.role !== 'admin'
        ) {
            return res.status(403).json({
                success: false,
                message: 'You cannot delete this note.'
            })
        }

        await note.deleteOne()

        return res.status(200).json({
            success: true,
            message: 'Note deleted successfully.'
        })
    } catch (error) {
        console.error('Delete note error:', error.message)

        return res.status(500).json({
            success: false,
            message: 'Failed to delete note.'
        })
    }
}