import {
  doctors,
  patients,
  addDoctor,
  findDoctor,
  filterByAge,
  addPatient,
  createAppointment
} from './hospitalData.js'

addDoctor('Dr. Julie')
console.log('Updated doctors:', doctors)
console.log(findDoctor('Dr. Julie'))
console.log(findDoctor('Dr. Nobody'))

console.log('Patients older than 30:', filterByAge(30))
addPatient('Karim', 52)
console.log('Updated patients:', patients)

try {
  console.log(createAppointment('Dr. Lee', 'Alice', '2026-11-10'))
  console.log(createAppointment('Dr. Lee'))
} catch (err) {
  console.error('Error:', err.message)
}
