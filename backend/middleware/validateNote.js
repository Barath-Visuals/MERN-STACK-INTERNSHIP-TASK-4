
export const validateNote = (req, res, next) => {
    const { title, content, tags } = req.body

    // Validate title
    if (title !== undefined) {
        if (typeof title !== 'string' || title.trim().length < 3) {
            return res.status(400).json({
                success: false,
                message: 'Title must contain at least 3 characters.',
            })
        }

        if (title.trim().length > 120) {
            return res.status(400).json({
                success: false,
                message: 'Title cannot exceed 120 characters.',
            })
        }
    }

    // Validate content
    if (content !== undefined) {
        if (typeof content !== 'string' || !content.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Content cannot be empty.',
            })
        }
    }

    // Validate tags
    if (tags !== undefined) {
        if (!Array.isArray(tags)) {
            return res.status(400).json({
                success: false,
                message: 'Tags must be an array.',
            })
        }

        if (tags.length > 10) {
            return res.status(400).json({
                success: false,
                message: 'You can add a maximum of 10 tags.',
            })
        }

        const invalidTag = tags.some(
            (tag) =>
                typeof tag !== 'string' ||
                !tag.trim() ||
                tag.trim().length > 30
        )

        if (invalidTag) {
            return res.status(400).json({
                success: false,
                message: 'Each tag must be a non-empty string of up to 30 characters.',
            })
        }

        req.body.tags = [...new Set(
            tags.map((tag) => tag.trim().toLowerCase())
        )]
    }

    next()
}
