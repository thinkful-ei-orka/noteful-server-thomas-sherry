require('dotenv').config();
const app = require('../src/app');
const FoldersService = require('../src/folders/folders-service');
const { expect } = require('chai');
const { TEST_DB_URL } = require('../src/config');
const knex = require('knex');
const supertest = require('supertest');

describe('Folders Endpoints', () => {
  let db;

  before(() => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    })
    app.set('db', db)
  })
 
  before(() => db('folders').truncate());
  afterEach(() => db('folders').truncate());
  after(() => db.destroy());
 
  it('GET /folders responds with 200 containing an empty array', () => {
    return supertest(app)
      .get('/folders')
      .expect(200, [])
  })

  context('Given noteful has data', () => {
    const testFolders = [
      {
        "id": "1",
        "name": "Important"
      },
      {
        "id": "2",
        "name": "Super"
      },
      {
        "id": "3",
        "name": "Spangley"
      }
    ]

    it('GET should respond with 200 and all the folders', () => {
      return FoldersService.getAllFolders(db)
        .then(actual => {
          expect(actual).to.eql(testFolders);
        })
    })
  })
})