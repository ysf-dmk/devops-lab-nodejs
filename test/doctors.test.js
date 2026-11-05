import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../src/app.js'

const baseUrl = '/api/doctors'
const invalidIds = ['abc', '0', '-1', '1.5', '9007199254740992']
const invalidBodies = [
  {},
  { name: 'Dr. Lee' },
  { specialty: 'Cardiology' },
  { name: 123, specialty: 'Cardiology' },
  { name: 'Dr. Lee', specialty: 123 },
  { name: '   ', specialty: 'Cardiology' },
  { name: 'Dr. Lee', specialty: '   ' }
]

async function createDoctor () {
  const res = await request(app)
    .post(baseUrl)
    .send({ name: 'Dr. Test', specialty: 'Cardiology' })

  expect(res.status).toBe(201)
  return res.body
}

describe('Doctors API', () => {
  it('GET returns the doctor list', async () => {
    const res = await request(app).get(baseUrl)

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body).toContainEqual({
      id: 1,
      name: 'Dr. Sarah Lee',
      specialty: 'Cardiology'
    })
  })

  it('GET by ID returns the requested doctor', async () => {
    const doctor = await createDoctor()
    const res = await request(app).get(`${baseUrl}/${doctor.id}`)

    expect(res.status).toBe(200)
    expect(res.body).toEqual(doctor)
  })

  it('POST creates a doctor and trims the fields', async () => {
    const res = await request(app)
      .post(baseUrl)
      .send({ name: ' Dr. Julie ', specialty: ' Neurology ' })

    expect(res.status).toBe(201)
    expect(res.body).toEqual({
      id: expect.any(Number),
      name: 'Dr. Julie',
      specialty: 'Neurology'
    })

    const list = await request(app).get(baseUrl)

    expect(list.body).toContainEqual(res.body)
    expect(list.body.filter(doctor => doctor.id === res.body.id))
      .toHaveLength(1)
  })

  it.each(invalidBodies)('POST rejects invalid fields: %j', async (body) => {
    const before = await request(app).get(baseUrl)
    const res = await request(app).post(baseUrl).send(body)

    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty('error')

    const after = await request(app).get(baseUrl)
    expect(after.body).toEqual(before.body)
  })

  it('POST rejects a request without a body', async () => {
    const res = await request(app).post(baseUrl)

    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty('error')
  })

  it('PUT updates a doctor and preserves its ID', async () => {
    const doctor = await createDoctor()

    const res = await request(app)
      .put(`${baseUrl}/${doctor.id}`)
      .send({
        id: 999999,
        name: ' Dr. Updated ',
        specialty: ' Neurology '
      })

    expect(res.status).toBe(200)
    expect(res.body).toEqual({
      id: doctor.id,
      name: 'Dr. Updated',
      specialty: 'Neurology'
    })

    const saved = await request(app).get(`${baseUrl}/${doctor.id}`)
    expect(saved.status).toBe(200)
    expect(saved.body).toEqual(res.body)
  })

  it.each(invalidBodies)('PUT rejects invalid fields: %j', async (body) => {
    const doctor = await createDoctor()

    const res = await request(app)
      .put(`${baseUrl}/${doctor.id}`)
      .send(body)

    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty('error')

    const unchanged = await request(app).get(`${baseUrl}/${doctor.id}`)
    expect(unchanged.body).toEqual(doctor)
  })

  it('PUT rejects a request without a body', async () => {
    const doctor = await createDoctor()
    const res = await request(app).put(`${baseUrl}/${doctor.id}`)

    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty('error')

    const unchanged = await request(app).get(`${baseUrl}/${doctor.id}`)
    expect(unchanged.body).toEqual(doctor)
  })

  it('DELETE removes a doctor and returns an empty response', async () => {
    const doctor = await createDoctor()
    const res = await request(app).delete(`${baseUrl}/${doctor.id}`)

    expect(res.status).toBe(204)
    expect(res.text).toBe('')

    const removed = await request(app).get(`${baseUrl}/${doctor.id}`)
    expect(removed.status).toBe(404)

    const list = await request(app).get(baseUrl)
    expect(list.body.some(item => item.id === doctor.id)).toBe(false)

    const repeated = await request(app).delete(`${baseUrl}/${doctor.id}`)
    expect(repeated.status).toBe(404)
  })

  it('POST keeps IDs unique after a deletion', async () => {
    const first = await createDoctor()
    const second = await createDoctor()

    const deleted = await request(app).delete(`${baseUrl}/${first.id}`)
    expect(deleted.status).toBe(204)

    const third = await createDoctor()
    expect(third.id).toBeGreaterThan(second.id)

    const list = await request(app).get(baseUrl)
    const ids = list.body.map(doctor => doctor.id)

    expect(new Set(ids).size).toBe(ids.length)
  })

  describe.each(['get', 'put', 'delete'])('%s by ID', (method) => {
    it.each(invalidIds)('rejects invalid ID: %s', async (id) => {
      const before = await request(app).get(baseUrl)
      const res = await request(app)[method](`${baseUrl}/${id}`)

      expect(res.status).toBe(400)
      expect(res.body).toEqual({ error: 'Invalid doctor ID' })

      const after = await request(app).get(baseUrl)
      expect(after.body).toEqual(before.body)
    })

    it('returns 404 for a missing doctor', async () => {
      const res = await request(app)[method](`${baseUrl}/999999`)

      expect(res.status).toBe(404)
      expect(res.body).toEqual({ error: 'Doctor not found' })
    })
  })
})
