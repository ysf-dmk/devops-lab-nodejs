import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../src/app.js'

describe('Doctors API', () => {
  it('GET returns the doctor list', async () => {
    const res = await request(app).get('/api/doctors')

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body).toContainEqual({
      id: 1,
      name: 'Dr. Sarah Lee',
      specialty: 'Cardiology'
    })
  })

  it('POST creates a doctor and makes it available through GET', async () => {
    const res = await request(app)
      .post('/api/doctors')
      .send({ name: ' Dr. Julie ', specialty: ' Neurology ' })

    expect(res.status).toBe(201)
    expect(res.body).toEqual({
      id: expect.any(Number),
      name: 'Dr. Julie',
      specialty: 'Neurology'
    })

    const list = await request(app).get('/api/doctors')

    expect(list.body).toContainEqual(res.body)
    expect(list.body.filter(doctor => doctor.id === res.body.id)).toHaveLength(1)
  })

  it.each([
    {},
    { name: 'Dr. Lee' },
    { specialty: 'Cardiology' },
    { name: 123, specialty: 'Cardiology' },
    { name: 'Dr. Lee', specialty: 123 },
    { name: '   ', specialty: 'Cardiology' },
    { name: 'Dr. Lee', specialty: '   ' }
  ])('POST rejects invalid fields: %j', async (body) => {
    const before = await request(app).get('/api/doctors')

    const res = await request(app)
      .post('/api/doctors')
      .send(body)

    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty('error')

    const after = await request(app).get('/api/doctors')

    expect(after.body).toEqual(before.body)
  })

  it('POST rejects a request without a body', async () => {
    const res = await request(app).post('/api/doctors')

    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty('error')
  })
})
