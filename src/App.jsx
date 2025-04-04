import React, { useEffect, useState } from 'react'
import img from './ai-human.avif'



const App = () => {

  const [transcript, setTarnscript] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [information, setInformation] = useState("")
  const [voices, setvoice] = useState([])


  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang= "en-IN";

  const loadVoice = () =>{
    const allVoice = window.speechSynthesis.getVoices();
    setvoice(allVoice)
  }

  useEffect(() => {
    if(window.speechSynthesis.onvoiceschanged !== undefined){
      window.speechSynthesis.onvoiceschanged = loadVoice
    }else{
      loadVoice();
    }
  }, [])

  const startListening = () =>{
    recognition.start();
    setIsListening(true);
  }

  recognition.onresult = (event) =>{
    const spokenText = event.results[0][0].transcript.toLowerCase();
    setTarnscript(spokenText)
    handleVoiceCommand(spokenText)
  }

 recognition.onend = () =>setIsListening(false)

  const speakText = (text)=>{
    if(voices.length === 0){
      console.warn("No voice available yet.")
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);

    const maleEnglishVoice = voices.find((voice)=>
    voice.lang.startsWith("en-") && voice.name.toLowerCase().includes("male"))|| voices.find((voice)=>voice.lang.startsWith("en-")) ||voices[0]

    utterance.voice = maleEnglishVoice;
    utterance.lang =  maleEnglishVoice.lang || "en-US";
    utterance.rate = 1;
    utterance.pitch = 1
    utterance.volume = 1;

    window.speechSynthesis.speak(utterance)

  }
  
  const handleVoiceCommand = async (command) =>{
    if (command.startsWith("open ")) {
      
      const site = command.split(" ").slice(1, 4).join(" ").trim().toLowerCase().replace(/\s+/g, ""); // Remove spaces
      
      const sitesMap = {
        leetcode : "https://leetcode.com/u/AbhayGupta9397/",
        gfg : "https://www.geeksforgeeks.org/user/abhaygup5ivc/",
        codeforces : "https://codeforces.com/profile/abhaygupta9397",
        codechef : "https://www.codechef.com/users/abhaygupta9397",
        github : "https://github.com/abhaygupta9397"
      };


      if (sitesMap[site]) {
        speakText(`Opening ${site}`);
        window.open(sitesMap[site], "_blank");
        setInformation(`Opened ${site}`);
      } else {
        speakText(`I don't know how to open ${site}`);
        setInformation(`Could not find the website for  ${site}`);
      }
      return;
    }

    if (command.includes("what is your name")) {
      const response =
        "Hello Sir I'm DevMate, Your voice assistant created by Abhay Gupta";
      speakText(response);
      setInformation(response);
      return;
    } else if (command.includes("hello DevMate")) {
      const response = "Hello Sir I'm DevMate, How can i help you";
      speakText(response);
      setInformation(response);
      return;
    } 

    // List of famous people
    const famousPeople = [
      "bill gates",
      "mark zuckerberg",
      "elon musk",
      "steve jobs",
      "warren buffet",
      "barack obama",
      "jeff bezos",
      "sundar pichai",
      "mukesh ambani",
      "virat kohli",
      "sachin tendulkar",
      "brian lara",
    ];

    if(famousPeople.some((person)=>command.includes(person))){
      const person = famousPeople.find((person)=>command.includes(person))
      const personData = await fetchPersonData(person)

      if(personData){
        const infoText = `${personData.name}, ${personData.extract}`
        setInformation(infoText)
        speakText(infoText)

        performGoogleSeach(command)
      }else{
        const fallbackMessage = "I couldn't find detailed information"
      
        speakText(fallbackMessage)
        performGoogleSeach(command)
      }

    }else{
      const fallbackMessage = `Here is the information about ${command}`;

      speakText(fallbackMessage);
      performGoogleSeach(command);
    }
  }

  const fetchPersonData = async (person) =>{
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
      person
    )}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if(data && data.title && data.extract){
        return {
          name:data.title,
          extract:data.extract.split('.')[0]
        }
      }else{
        return null
      }
      
    } catch (error) {
      console.error('error')
      return null
    }

  }

  const performGoogleSeach = (query) =>{
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;

    window.open(searchUrl,"_blank");

  }


  return (
    <div>
      <div className="voice-assistant">
        <img src={img} alt="AI" className="ai-image" />
        <h2>Voice Assistant (DevMate)</h2>

        <button className="btn" onClick={startListening} disabled={isListening}>
          <i className="fas fa-microphone"></i>
          {isListening ? "Listening..." : "Start Listening"}
        </button>
        <p className="tarnscript">{transcript}</p>
        <p className="information">
         {information}
        </p>
      </div>
    </div>
  );
}

export default App