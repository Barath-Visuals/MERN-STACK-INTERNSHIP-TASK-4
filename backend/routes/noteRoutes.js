import express from 'express';
import {
    createNote,
    getNotes,
    updateNote,
    deleteNote
} from '../controllers/noteController.js';

import {protect} from '../middleware/authMiddleware.js';

const router = express.Router()

router.use(protect)

router.route('/')
    .post(createNote)
    .get(getNotes)

router.route('/:id')
    .post(updateNote)
    .delete(deleteNote)

export default router