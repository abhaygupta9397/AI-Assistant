import React from 'react'
import im from './ai-human.avif'
const App = () => {
  return (
    <div>
      <div className="voice-assistant">
        <img src={im} alt="ai" className='ai-image'/>
        <h2>Voice Assistant (Friday)</h2>
        <button className='btn'><i className='fas fa microphone'></i>
        Start Listening
        </button>
        <p className="transcript">Bill Gates</p>
        <p className="information">Lorem ipsum, dolor sit amet consectetur adipisicing elit.
           Necessitatibus blanditiis tempore molestias!</p>
      </div>
    </div>
  )
}
export default App