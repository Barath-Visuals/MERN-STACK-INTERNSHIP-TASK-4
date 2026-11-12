import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Please add a title"],
            trim: true,
            maxlength: 100,
        },

        content: {
            type: String,
            required : [true, "Note content is required"],
            trim: true,
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,
        collection: 'Notes',
    }
)

const Note = mongoose.model('Note', noteSchema)

export default Note