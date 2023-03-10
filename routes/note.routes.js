const { Router, json } = require("express")
const bcrypt = require("bcryptjs")
const Note = require("../models/Note")
const auth = require("../middlewares/auth.middleware")
const router = Router()


// /api/notes

router.get(
    '/getNotes',
    auth,
    async (req, res) => {
    try {
        const notes = await Note.find({ owner: req.user.userId })
        res.json(notes)
    } catch (e) {
        res.status(500).json({ message: " something went wrong on the server... " })
    }
})

//router to add new notes

router.post(
    '/newNote',
    auth,
    async (req, res) => {
    try {
        const newNote = new Note({
             title : req.body.title,
             content : req.body.content,
             owner : req.user.userId
            })

        await newNote.save()

        res.json({message: "note created"})

    } catch (e) {
        res.status(500).json({ message: " something went wrong on the server... " })
    }
})

//router to delete notes

router.delete(
    '/deleteNote',
    auth,
    async (req, res) => {
    try {
        await Note.findByIdAndDelete(req.body.id)
        res.json({message: "note deleted"})
    } catch (e) {
        res.status(500).json({ message: " something went wrong on the server... " })
    }
})

module.exports = router

//router to update notes

router.put(
    '/updateNote',
    auth,
    async (req, res) => {
    try {

        const {title, content, id} = req.body

        const currentNote = await Note.findById(id)
        
        if (!currentNote) {
            return res.status(500).json({message: "Note doesn't exist"})
        }

        update = { title: title, content: content }

        await currentNote.updateOne(update);

        res.json({message: "Note updated"})
    } catch (e) {
        res.status(500).json({ message: " something went wrong on the server... " })
    }
})

module.exports = router