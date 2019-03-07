import React, { Component, useState, useEffect } from 'react';
import logo from './logo.svg';
import injectJSS from 'react-jss'

const styles = {
  app: {
    textAlign: 'center'
  },
  appHeader: {
    backgroundColor: '#282c34',
    minHeight: '20vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 'calc(10px + 2vmin)',
    color: 'white'
  }
}

const App = ({ classes }) => {
  const [isRecognizing, setIsRecognizing] = useState(false)
  const [words, setWords] = useState('')
  const [speechRecognition, setSpeechRecognition] = useState(null)
  const [speechSynth, setSpeechSynth] = useState(null)
  const [gotBingo, setGotBingo] = useState(false)

  const addWords = newWords => {
    setWords(prevWords => {
      console.log('previous:', prevWords)
      console.log('next: ', newWords)
      return prevWords + newWords + ' '
    })
  }

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('No speech recognition available')
    } else {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = true
      recognition.interimResults = false
      recognition.lang = 'en-US'
    
      recognition.onstart = () => setIsRecognizing(true)
      recognition.onresult = event => {
        console.log(event)
        let resultWords = ''
        if(event.results.length){
          const result = event.results[event.results.length - 1]
          for(let n = 0; n < result.length; n++){
            const resultPart = result[n]
            resultWords += resultPart.transcript
          }
        }
        
        addWords(resultWords)
      }
      recognition.onerror = event => {
        console.log('error', event)
        if(event.error === 'no-speech'){
          setTimeout(() => {
            recognition.start() //Keep it coming
          })
          
        }
      }
      recognition.onend = () => {
        console.log('has ended')
        setIsRecognizing(false)
      }

      recognition.start();

      setSpeechRecognition(recognition)
    }

    if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) {
      alert('No speech synthesizer available')
    }
    else{
      setSpeechSynth(window.speechSynthesis)
    }
  }, [])

  const toggleRecognition = () => speechRecognition
    && (isRecognizing
      ? speechRecognition.stop()
      : speechRecognition.start()
    )

  const bingoWords = ['I', 'like', 'bingo']

  const hasWordBeenSaid = word => (new RegExp(`(\\s${word}\\s|^${word}\\s|\\s${word})`, 'gi')).test(words)

  const haveAllWordsBeenSaid = () => bingoWords.every(hasWordBeenSaid)

  useEffect(() => {
    if(speechSynth && !gotBingo && haveAllWordsBeenSaid()){
      setGotBingo(true)
      const utterance = new window.SpeechSynthesisUtterance('BINGO!')
      speechSynth.speak(utterance)
    }
  })

  return (
    <div className={classes.app}>
      <header className={classes.appHeader}>
        Say stuff!
      </header>
      <main>
        <div>
          <button onClick={toggleRecognition}>{isRecognizing ? 'Stop' : 'Start'}</button>
        </div>
        {bingoWords.map((word, i) =>
          <div key={i}>
            {`${word}: ${hasWordBeenSaid(word) ? 'true' : 'false'}`}
          </div>
        )}
        <div>{words}</div>
        <div>{gotBingo ? 'BINGO!' : ''}</div>
      </main>
    </div>
  )
}

export default injectJSS(styles)(App);
