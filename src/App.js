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
  },
  appLogo: {
    animation: 'App-logo-spin infinite 20s linear',
    height: '10vmin',
    pointerEvents: 'none',
  },
  appLink: {
    color: '#61dafb'
  },
  '@keyframes App-logo-spin': {
    from: {
      transform: 'rotate(0deg)'
    },
    to: {
      transform: 'rotate(360deg)'
    }
  }
}

const App = ({ classes }) => {
  const [isRecognizing, setIsRecognizing] = useState(false)
  const [words, setWords] = useState('')
  const [speechRecognition, setSpeechRecognition] = useState(null)

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) {
      console.log('no speech recognition')
    } else {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = true
      recognition.interimResults = false
      recognition.lang = 'en-US'
    
      recognition.onstart = () => setIsRecognizing(true)
      recognition.onresult = event => {
        console.log(event)
        let resultWords = ''
        for(let i = 0; i < event.results.length; i++){
          const result = event.results[i]
          for(let n = 0; n < result.length; n++){
            const resultPart = result[n]
            resultWords += resultPart.transcript
          }
        }
        console.log(resultWords)
        setWords(words + resultWords + ' ')
      }
      recognition.onerror = event => {
        console.log('error', event)
        if(event.error === 'no-speech'){
          setTimeout(() => {
            recognition.start() //Keep it coming
          })
          
        }
        //setWords('error')
      }
      recognition.onend = () => setIsRecognizing(false)

      recognition.start();

      setSpeechRecognition(recognition)
    }
  }, [])

  const toggleRecognition = () => speechRecognition
    && (isRecognizing
      ? speechRecognition.stop()
      : speechRecognition.start()
    )

  return (
    <div className={classes.app}>
      <header className={classes.appHeader}>
        <img src={logo} className={classes.appLogo} alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className={classes.appLink}
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <main>
        <div>
          <button onClick={toggleRecognition}>{isRecognizing ? 'Stop' : 'Start'}</button>
        </div>
        <div>{words}</div>
      </main>
    </div>
  )
}

export default injectJSS(styles)(App);
