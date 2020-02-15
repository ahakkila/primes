/* eslint semi: [0, "never"], no-console: 0  */
/* eslint-env node,browser */

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

const corsOptions = {
  origin: 'http://localhost:3000',
  preflightContinue: true,
  optionsSuccessStatus: 200
}

morgan.token('bodyJson', (req) => JSON.stringify(req.body))

app.use(cors(corsOptions))
app.use('/api', express.json())
app.use(morgan(':method :url :status :response-time :res[content-length] :bodyJson'))

function checkPrime(num) {
  if (num < 2)
    return { success: false, isPrime: false, err: 'Number smaller than 2' }

  if (num > Number.MAX_SAFE_INTEGER)
    return { success: false, isPrime: false, err: `Number '${num}' larger than 2^53-1` }

  let i 
  for (i = 2; i < num; i++)
    if (num % i === 0)
      break

  if (i === num)
    return { success: true, isPrime: true }
  else
    return { success: true, isPrime: false, err: `Number has a divisor of ${i}` }
}

app.post('/api/sum', (req, res) => {
  const numArray = req.body.numberList
    .split(',')
    .map (n => ( Number(n)))

  const sum = numArray
    .reduce( (total, num) => {
      return total + num
    })

  const checkResult = checkPrime(sum)
  res.json({ ...checkResult, sum: sum })
})

app.post('/api/isprime', (req, res) => {
  const number = Number(req.body.primeCandidate)
  if (isNaN(number))
    return res.json({ 
      success: false, 
      isPrime: false, 
      err: `Not a number '${req.body.primeCandidate}'` 
    })

  const checkResult = checkPrime(number)
  res.json(checkResult)
})

app.get('/', (req, res) => {
  res.status(404).send('Not found')
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
