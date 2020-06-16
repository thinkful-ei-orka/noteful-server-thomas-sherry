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
  })

module.exports = notesRouter