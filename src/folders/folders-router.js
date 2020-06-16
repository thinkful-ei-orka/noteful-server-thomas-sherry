const express = require('express');
const foldersService = require('./folders-service');
const notesService = require('../notes/notes-service');

const foldersRouter = express.Router()
const jsonParser = express.json()

foldersRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    foldersService.getAllFolders(knexInstance)
      .then(folders => {
        res.json(folders)
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { name } = req.body

    if (!name) {
      return res.status(400)
        .json({ error: { message: 'No name detected' } })
    }

    const newFolder = {
      folder_name: name
    }

    const knexInstance = req.app.get('db')
    foldersService.createFolder(knexInstance, newFolder)
      .then(folder => {
        res
          .status(201)
          .send(folder)
      })
      .catch(next)
  })

foldersRouter
  .route('/:id')
  .get(jsonParser, (req, res, next) => {
    const { id } = req.params;
    const knexInstance = req.app.get('db')
    foldersService.getById(knexInstance, id)
      .then(folder => {
        notesService.getByFolderId(knexInstance, folder.id)
        .then(notes => {
          res.status(200)
          .returning(notes)  
        })
      })

  })

  .delete(jsonParser, (req, res, next) => {
    const { id } = req.params;
    const knexInstance = req.app.get('db')
    foldersService.deleteFolder(knexInstance, id)
      .then(folders => {
        res.status(204)
          .end();
      })
      .catch(next)

  })

module.exports = foldersRouter