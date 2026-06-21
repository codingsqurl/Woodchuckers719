// createuser — CLI parity with `go run . createuser`. Seeds an account without
// the web UI (no public signup).
//   npm run createuser <email> "<full name>" <employee|admin> <password>
// Leave <password> blank ("") for an SSO-only account.
import './load-env'
import { createEmployee, isDuplicateEmail } from '../lib/employees'

const [email, fullName, role, password] = process.argv.slice(2)

if (process.argv.slice(2).length !== 4) {
  console.error('usage: npm run createuser <email> "<full name>" <employee|admin> <password>')
  process.exit(1)
}
if (role !== 'employee' && role !== 'admin') {
  console.error('role must be employee or admin')
  process.exit(1)
}

try {
  const e = createEmployee(email.toLowerCase(), fullName, role, password)
  console.log(`created ${e.email} (id=${e.id}, role=${e.role})`)
} catch (err) {
  if (isDuplicateEmail(err)) {
    console.error(`an account with email ${email} already exists`)
    process.exit(1)
  }
  throw err
}
