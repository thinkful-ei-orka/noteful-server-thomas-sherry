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
  
}

module.exports = NotesService