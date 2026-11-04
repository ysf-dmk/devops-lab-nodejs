const hospitalName = 'Central Hospital'
const numberOfDoctors = 12
let isOpen = true

if (isOpen) {
  console.log(`Welcome to ${hospitalName}! We have ${numberOfDoctors} doctors currently available.`)
}
isOpen = false
if (!isOpen) {
  console.log(`Sorry, ${hospitalName} is currently closed. Please visit us during our working hours.`)
}

const doctors = ['Dr. Lee', 'Dr. Khan', 'Dr. Smith', 'Dr. Martin', 'Dr. Brown']

let index = 1
for (const doctor of doctors) {
  console.log(`Doctor #${index}: ${doctor}`)
  index++
}

doctors.push('Dr. Julie')
console.log(`Total doctors: ${doctors.length}`)

function findDoctor (name) {
  return doctors.includes(name) ? 'Doctor found' : 'Doctor not found'
}
console.log(findDoctor('Dr. Lee'))
console.log(findDoctor('Dr. Nobody'))

const patient = {
  name: 'Alice Martin',
  age: 34,
  conditions: ['diabetes', 'hypertension'],
  doctor: { name: 'Dr. Lee', specialty: 'Cardiology' }
}

console.log(patient.doctor.name)
console.log(patient.conditions.length)
console.log(`${patient.name} is treated by ${patient.doctor.name} (${patient.doctor.specialty}).`)

patient.conditions.push('anxiety')
console.log(patient)

const patients = [
  { id: 1, name: 'Alice', age: 34 },
  { id: 2, name: 'John', age: 45 },
  { id: 3, name: 'Marie', age: 29 }
]

function filterByAge (minAge) {
  return patients.filter(p => p.age > minAge)
}

function addPatient (name, age) {
  patients.push({ id: patients.length + 1, name, age })
}

console.log('Older than 30:', filterByAge(30))
addPatient('Karim', 52)
console.log('Updated patients:', patients)

function createAppointment (doctor, patient, date) {
  if (!doctor || !patient || !date) {
    throw new Error('Missing required fields')
  }
  return { doctor, patient, date }
}

try {
  console.log(createAppointment('Dr. Lee', 'Alice', '2025-03-15'))
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
