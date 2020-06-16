const FoldersService = {
  getAllFolders(knex) {
    return knex.select('*').from('folders')
  },
  createFolder(knex, folder) {
    return knex
      .insert(folder)
      .into('folders')
      .returning('*')
      .then(rows => {
        return rows[0]
      })
  },
  deleteFolder(knex, id) {
    return knex('folders')
      .where({id})
      .delete()
  }
  
}

module.exports = FoldersService