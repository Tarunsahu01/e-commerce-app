import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <h1>E-Commerce Application</h1>
        <p>React Frontend is set up and ready!</p>
        <p>Backend API: http://localhost:8080</p>
      </div>
    </>
  )
}

export default App
