const express = require('express');


const foldersRouter = express.Router()
const jsonParser  = express.json()

foldersRouter
  .route('/')
  .get((req, res) => {
    res.json([])
  })

module.exports = foldersRouter