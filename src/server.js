const knex = require('knex')
const app = require('./app')
const { PORT } = require('./config')

const db = knex({
  client: "pg",
  connection: DB_URL,
})

app.set('db', db);

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`)
})