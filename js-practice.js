const hospitalName = 'Central Hospital'
const numberOfDoctors = 12
let isOpen = true

console.log(`Welcome to ${hospitalName}! We have ${numberOfDoctors} doctors currently available.`)
console.log(`Hospital open: ${isOpen}`)

isOpen = false

if (!isOpen) {
  console.log(`${hospitalName} is currently closed.`)
}

const doctors = [
  'Dr. Lee',
  'Dr. Khan',
  'Dr. Garcia',
  'Dr. Martin',
  'Dr. Smith'
]

for (const [index, name] of doctors.entries()) {
  console.log(`Doctor #${index + 1}: ${name}`)
}

doctors.push('Dr. Julie')
console.log(`Updated doctor count: ${doctors.length}`)

function findDoctor (name) {
  return doctors.includes(name) ? 'Doctor found' : 'Doctor not found'
}

console.log(findDoctor('Dr. Lee'))
console.log(findDoctor('Dr. Dupont'))

const patient = {
  name: 'Alice Martin',
  age: 34,
  conditions: ['diabetes', 'hypertension'],
  doctor: {
    name: 'Dr. Lee',
    specialty: 'Cardiology'
  }
}

console.log(`Doctor: ${patient.doctor.name}`)
console.log(`Number of conditions: ${patient.conditions.length}`)
console.log(`${patient.name} is treated by ${patient.doctor.name} (${patient.doctor.specialty}).`)

patient.conditions.push('anxiety')
console.log('Updated patient:', patient)

const patients = [
  { id: 1, name: 'Alice', age: 34 },
  { id: 2, name: 'John', age: 45 },
  { id: 3, name: 'Marie', age: 29 }
]

function filterByAge (minAge) {
  return patients.filter(patient => patient.age > minAge)
}

function addPatient (name, age) {
  const newPatient = {
    id: patients.length + 1,
    name,
    age
  }

  patients.push(newPatient)
  return newPatient
}

console.log('Patients older than 30:', filterByAge(30))

addPatient('Lucas', 25)
console.log('Updated patients:', patients)

function createAppointment (doctor, patient, date) {
  if (!doctor || !patient || !date) {
    throw new Error('Missing required fields')
  }

  return { doctor, patient, date }
}

try {
  console.log(createAppointment('Dr. Lee', 'Alice', '2026-11-15'))

  // Faltan el paciente y la fecha: provoca un error intencionado.
  console.log(createAppointment('Dr. Lee'))
} catch (err) {
  console.error('Error:', err.message)
}

function getHospitalData () {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ name: 'Central Hospital', uptime: 1234 })
    }, 1000)
  })
}

async function showData () {
  console.log('Fetching hospital data...')

  const data = await getHospitalData()

  console.log('Data loaded:', data)
}

showData()
