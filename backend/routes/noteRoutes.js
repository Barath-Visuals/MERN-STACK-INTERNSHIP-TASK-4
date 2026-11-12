import express from 'express';
import {
    createNote,
    getNotes,
    updateNote,
    deleteNote
} from '../controllers/noteController.js';

import {protect} from '../middleware/authMiddleware.js';
import { validateNote } from '../middleware/validateNote.js'

const router = express.Router()

router.use(protect)

router.route('/')
    .post(validateNote, createNote)
    .get(getNotes)

router.route('/:id')
    .post(validateNote, updateNote)
    .delete(deleteNote)

export default router