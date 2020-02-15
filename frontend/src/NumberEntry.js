import React, { useState } from 'react'

import axios from 'axios'

const NumberEntry = ({ alertUser, portNumber }) => {

  const [data, setData] = useState("")

  const handleChange = (ev) => {
    console.log('field:', ev.target.value);

    // filter other chars except numbers and commas
    const value = ev.target.value
      .split('')
      .filter(c => {
        switch (c) {
          case '1': 
          case '2': 
          case '3': 
          case '4': 
          case '5':
          case '6': 
          case '7': 
          case '8': 
          case '9': 
          case '0':
          case ',':
            return c
          default:
            return ''
        }
      })
      .join('')
    setData(value)
  }

  const handleSum = () => {
    const url = `http://localhost:${portNumber}/api/sum`
    const request = axios.post(url, { numberList: data })
    request
      .then( (response) => {
        const data = response.data
        if (!data.success)
          alertUser(`Sum request failed, server reply=${data.err}`, 'error')
        else {
          if (data.isPrime)
            alertUser(`Sum is ${data.sum}, number is a prime`, 'info')
          else 
            alertUser(`Not a prime, result:${data.err}`, 'info')
        }

      })
      .catch ( err => {
        alertUser(`Sum and prime check request failed, err=${err}`, 'error')
      })
  }

  const handlePrime = () => {
    const url = `http://localhost:${portNumber}/api/isprime`
    console.log('check prime url', url)
    const request = axios.post(url, { primeCandidate: data })
    request
      .then( (response) => {
        const data = response.data
        if (!data.success)
          alertUser(
            `Prime check request failed, server reply=${data.err}`, 'error')
        else {
          if (data.isPrime)
            alertUser(`Number is a prime`, 'info')
          else
            alertUser('Number is not a prime', 'info')
        }
      })
      .catch( err => {
        alertUser(`Prime check request failed, err=${err}`, 'error')
      })
  }


  return (
    <div>
      <input type="text" value={data} onChange={handleChange} />
      <button onClick={handleSum}>Sum and check prime</button>
      <button onClick={handlePrime}>Check prime</button>
    </div>
  )
}

export default NumberEntry
