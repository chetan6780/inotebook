const express = require('express');
const router = express.Router();
const Note = require('../models/Note')
var fetchuser = require('../middleware/fetchuser');
const { body, validationResult } = require('express-validator');


// ROUTE 1: Get all the note : POST "/api/notes/fetchallnotes". Login required.
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id });
        res.json(notes);
    } catch (error) {
        console.error(err.message);
        res.status(500).send('Internal server error');
    }

})

// ROUTE 2: Add new note : POST "/api/notes/addnote". Login required.
router.post('/addnote', fetchuser, [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'Description must be atleast 5 characters').isLength({ min: 5 })],
    async (req, res) => {
        try {
            const { title, description, tag } = req.body;

            const errors = validationResult(req);
            // If there are errors, return bad request and errors
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const note = new Note({
                title, description, tag, user: req.user.id
            });
            const saveNote = await note.save();
            res.json(saveNote);
        } catch (error) {
            console.error(err.message);
            res.status(500).send('Internal server error');
        }


    }
)

// ROUTE 3: Update an existing note: PUT "/api/notes/updatenote". Login required.
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;
    try {
        // Create newNote object
        let newNote = {}
        if (title) newNote.title = title;
        if (description) newNote.description = description;
        if (tag) newNote.tag = tag;

        // find the note to be updates and then uupdate it 
        let note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).json({ msg: 'Note not found' });
        }
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send({ msg: 'Not authorized' });
        }
        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
        res.json({ note });
    }

    catch (error) {
        console.error(err.message);
        res.status(500).send('Internal server error');
    }
})

// ROUTE 4: Delete an existing note: DELETE "/api/notes/deletenote". Login required.
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        // find the note to be updates and then uupdate it 
        let note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).json({ msg: 'Note not found' });
        }
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send({ msg: 'Not authorized' });
        }
        note = await Note.findByIdAndDelete(req.params.id);
        res.json({ "Success": "Note has been deleted successfully.", note: note });
    }

    catch (error) {
        console.error(err.message);
        res.status(500).send('Internal server error');
    }
})

module.exports = router;