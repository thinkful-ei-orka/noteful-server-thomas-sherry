const express = require('express');
const NotesService = require('./notes-service')

const notesRouter = express.Router()
const jsonParser = express.json()

notesRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    NotesService.getAllNotes(knexInstance)
      .then(notes => {
        res.json(notes)
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { note_name, content, date_modified, folder_id } = req.body
    const newNote = { note_name, content, date_modified, folder_id }

    for (const [key, value] of Object.entries(newNote)) {
      if (!value) {
        return res
          .status(400)
          .json({
            error: { message: `${key} is required`}
          });
      }
    }

    const knexInstance = req.app.get('db')
    NotesService.createNote(knexInstance, newNote)
      .then(note => {
          res
            .status(201)
            .json(note)
      })
      .catch(next)


  })

notesRouter
  .route('/:id')
  .get((req, res, next) => {
    const { id } = req.params;
    const knexInstance = req.app.get('db')
    NotesService.getById(knexInstance, id)
      .then(note => {
        res.status(200)
          .send(note)
      })
      .catch(next)
  })
  .patch(jsonParser, (req, res, next) => {
    const { id } = req.params
    const knexInstance = req.app.get('db')
    const { note_name, content } = req.body
    const noteToUpdate = { note_name, content }

    const numberOfValues = Object.values(noteToUpdate).filter(Boolean).length
    if(numberOfValues == 0) {
      return res.status(400).json({
        error: { message: `Request body must contain either 'name' or 'content'` }
      })
    }

    NotesService.updateNote(knexInstance, id, noteToUpdate)
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })
  .delete((req, res, next) => {
    const { id } = req.params
    const knexInstance = req.app.get('db')
    NotesService.deleteNote (knexInstance, id)
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })

module.exports = notesRouter