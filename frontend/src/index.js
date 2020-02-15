import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import NumberEntry from './NumberEntry'

const AlertBox = ({ alert, closeAlert }) => {

  const handleClose = () => {
    closeAlert()
  }

  let classList = alert.type
  if (alert.text.length > 0) 
    classList = classList + ' alert-fadein' 
  else 
    classList = classList + ' alert-fadeout'

  return (
    <div id="alerttext" className={classList} >
      <span className="closeX" onClick={handleClose}>
        &times;
      </span>
      {alert.text} 
    </div>
  )
}

const ServiceSelector = ({ updatePortNumber, portNumber }) => {

  const handleChange = (ev) => {
    console.log('handleChange', ev.target.id);
    switch(ev.target.id) {
      case 'golang':
        updatePortNumber(3002)
        break
      case 'python':
        updatePortNumber(3003)
        break
      case 'nodejs':
      default:
        updatePortNumber(3001)
        break
    }
  }
        
  return (
    <div>
      <label>
        <input type="radio" name="portNumber" id="golang" value="3002" 
          onChange={handleChange}
          checked={portNumber === 3002} />
        Golang backend
      </label>
      <br/>
      <label>
        <input type="radio" name="portNumber" id="nodejs" value="3001" 
          onChange={handleChange} 
          checked={portNumber === 3001} />
        NodeJS backend
      </label>
      <br/>
      <label>
        <input type="radio" name="portNumber" id="python" value="3003" 
          onChange={handleChange} 
          checked={portNumber === 3003} />
        Python/Flask backend
      </label>
    </div>
  )
}

const App = () => {
  const [alert, setAlert] = useState({ text: '', type: ''} )
  const [portNumber, setPortNumber] = useState(3001)

  const alertUser = (text, type) => {
    setAlert({ text: text, type: type })
  }

  const updatePortNumber = (newNumber) => {
    setPortNumber(newNumber)
  }

  const closeAlert = () => {
    setAlert( { ...alert, text: '' } )
  }

  return (
    <>
      <h2>Enter comma separated number(s)</h2>
      <ServiceSelector updatePortNumber={updatePortNumber} portNumber={portNumber} />
      <NumberEntry alertUser={alertUser} portNumber={portNumber} />
      <AlertBox alert={alert} closeAlert={closeAlert} />
    </>
  )
}

ReactDOM.render(<App />, document.getElementById('root'));
