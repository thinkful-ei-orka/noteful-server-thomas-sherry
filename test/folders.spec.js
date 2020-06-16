const app = require('../src/app')

describe('Folders Endpoints', () => {
  it('GET / responds with 200 containing an empty array', () => {
    return supertest(app)
      .get('/folders')
      .expect(200, [])
  })
})