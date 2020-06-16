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
 
  before( () => db.raw("TRUNCATE TABLE folders, notes CASCADE"));
  afterEach(() => db.raw("TRUNCATE TABLE folders, notes CASCADE"));
  after(() => db.destroy());
 
  it('GET /folders responds with 200 containing an empty array', () => {
    return supertest(app)
      .get('/folders')
      .expect(200, [])
  })

  context('Given noteful has data', () => {
    const testFolders = [
      {
        "id": 1,
        "folder_name": "Important"
      },
      {
        "id": 2,
        "folder_name": "Super"
      },
      {
        "id": 3,
        "folder_name": "Spangley"
      }
    ]

    beforeEach(() => {
      return db 
        .into('folders')
        .insert(testFolders)
    })

    it('GET should respond with 200 and all the folders', () => {
      return supertest(app)
        .get('/folders')
        .expect(200, testFolders);
    })
  })
})