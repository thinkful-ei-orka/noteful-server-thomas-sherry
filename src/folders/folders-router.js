const express = require('express');
const foldersService = require('./folders-service');

const foldersRouter = express.Router()
const jsonParser  = express.json()

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

module.exports = foldersRouter