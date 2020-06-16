const NotesService = {
  getAllNotes(knex) {
    return knex.select('*').from('notes')
  },

  getById(knex, id) {
    return knex('notes')
      .select('*')
      .where({ id })
      .first()
  },

  createNote(knex, newNote) {
    return knex
      .insert(newNote)
      .into('notes')
      .returning('*')
      .then(rows => {
        return rows[0]
      })
  },

  updateNote(knex, id, newNoteFields) {
    return knex('notes')
      .where({ id })
      .update(newNoteFields)
  },

}

module.exports = NotesService