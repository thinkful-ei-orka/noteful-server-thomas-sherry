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
 
  describe('GET Endpoint', () => {
    context('Givent Noteful has no folder data', () => {
      it('GET /api/folders responds with 200 containing an empty array', () => {
        return supertest(app)
          .get('/api/folders')
          .expect(200, [])
      })
  
      
    })
    
    context('Given noteful has data', () => {
  
      beforeEach(() => {
        return db 
          .into('folders')
          .insert(testFolders)
      })
  
      it('GET should respond with 200 and all the folders', () => {
        return supertest(app)
          .get('/api/folders')
          .expect(200, testFolders);
      })

      it('GET should respond with a single folder when requesting specific Id', () => {
        const idToGet = 1;
        const testFolder = testFolders[idToGet - 1];

        return supertest(app)
          .get(`/api/folders/${idToGet}`)
          .expect(200, testFolder)
      })
    })

   

  })

  describe('POST Endpoint', () => {
    context('given Noteful has no folder data', () => {
      it('creates a new folder, returning with 201', () => {
        const newFolder = {
          name: 'foldername'
        }

        return supertest(app)
          .post('/api/folders')
          .send(newFolder)
          .expect(201)
      })
    })

  })

  describe('DELETE endpoint', () => {
    context('given Noteful has folder data', () => {
        
      beforeEach(() => {
        return db 
          .into('folders')
          .insert(testFolders)
      })
  
      it('deletes a folder, returning with 204', () => {
        const idToDelete = 1;
        const expectedFolders = testFolders.filter(folder => folder.id != idToDelete)

        return supertest(app)
          .delete(`/api/folders/${idToDelete}`)
          .expect(204)
          .then(() => FoldersService.getAllFolders(db))
          .then(allFolders => {
            expect(allFolders).to.eql(expectedFolders)
          })
      })
    })
  })

  
})