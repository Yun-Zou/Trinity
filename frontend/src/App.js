// Importing modules
import React, { useState, useEffect } from "react";

// CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";
import "./styles/styles.css"

// React Bootstrap Libraries
import Form from 'react-bootstrap/Form';
import Fade from 'react-bootstrap/Fade'
import Alert from 'react-bootstrap/Alert'

// Custom Components
import OptionButton from "./OptionButton";
import Dictaphone1 from "./Dictaphone1";

class Message {
  constructor(text, role) {
    this.text = text;
    this.role = role;
  }
}


const addBodyClass = className => document.body.classList.add("mobile-background");
const splitLines = str => str.split(/\r?\n/);

function TextBox({value}) {
  
  if (value == null) {
    return <div class="py-4 px-4 scrollview"></div>;
  }

  let size = value.length - 1;
  let text = value.map((item, index) => {
    return (
      <Alert 
        key={index}
        id={'textbox'+index}
        variant={item.role == 'system' ? 'light' : 'primary'}
        className={index == size ? 'shadow text-last text-options mb-4'  : 'shadow text-options mb-4' }>
        {item.text}
        </Alert>
        // <div key={index} class="text-options text-light mb-4">
        //   {item.text}
        // </div>

    )
  });

  return ( 
    <div class="py-4 px-4 scrollview">
      {text}
    </div>
  );
}

function App() {

  addBodyClass()

  // // Using useEffect for single rendering
  useEffect(() => {

    // Using fetch to fetch the api from 
    // flask server it will be redirected to proxy
    fetch("/initialsuggestions").then((res) =>
      res.json().then((data) => {
        // Setting a data from api
        let text = splitLines(data["content"])
        setAutosuggest({
          text1: text[0].slice(3),
          text2: text[1].slice(3),
          text3: text[2].slice(3),
          show: true
        })
      })
    );
  }, []);

  // Chat History
  const [chatHistory, setChatHistory] = useState(new Array())

  const [autosuggest, setAutosuggest] = useState({
    text1: "",
    text2: "",
    text3: "",
    show: false
  })

  const [message, setMessage] = useState({
    text: ""
  })

  function handleFormInput(event) {
    const nextMessage = message
    nextMessage.text = event.target.value
    console.log(nextMessage)
    setMessage({
      text: nextMessage.text
    })
  }

  function handleListen(transcript) {
    const nextMessage = message
    nextMessage.text += transcript
    console.log(transcript)
    setMessage({
      text: nextMessage.text
    })
  }

  function scrollToMyRef(id) {
    var ref = document.getElementById(id);
    setTimeout(function () {
      ref.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  function onListenClick() {
    setTimeout(() => {}, 1000);

    const nextHistory = chatHistory.slice();
    nextHistory.push(new Message(message.text, "user"))
    setChatHistory(nextHistory)

    setAutosuggest({
      show: false
    })

    getResponse(nextHistory)
    getSuggestions(nextHistory)

    setMessage({
      text: ""
    })

    if (chatHistory.length) {
      scrollToMyRef('textbox' + (chatHistory.length - 1))
    }
  }

  function handleAutoSuggestClick(event) {
    const nextHistory = chatHistory.slice();
    nextHistory.push(new Message(autosuggest[event],"user"))
    console.log(nextHistory)
    setChatHistory(nextHistory)

    setAutosuggest({
      show: false
    })

    getResponse(nextHistory)
    getSuggestions(nextHistory)    

    if (chatHistory.length) {
      scrollToMyRef('textbox' + (chatHistory.length - 1))
    }

  }

  function getSuggestions(nextHistory) {
    fetch("/followupsuggestions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify(nextHistory),
    }).then((res) =>
      res.json().then((data) => {
        // Setting a data from api
        let text = splitLines(data["content"])
        if (text.length != 3) {
          return;
        }

        if (text[0][0] == '1') {
          text[0] = text[0].slice(3)
          text[1] = text[1].slice(3)
          text[2] = text[2].slice(3)
        }
        setAutosuggest({
          text1: text[0],
          text2: text[1],
          text3: text[2],
          show: true
        })

      })
    );
  }

  function getResponse(chatHistory) {
    console.log(JSON.stringify(chatHistory))

    fetch("/response", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify(chatHistory),
    }).then((res) =>
      res.json().then((data) => {
        const nextHistory = chatHistory.slice();
        nextHistory.push(new Message(data['content'], "system"))
        setChatHistory(nextHistory)

        if (chatHistory.length) {
          scrollToMyRef('textbox' + (chatHistory.length - 1))
        }

      })
    );
  }

  return (
    <>

      <TextBox value={chatHistory}></TextBox>
      <div class="bottom-of-page px-4">
        <Fade in={autosuggest.show}>
          <div className="d-grid gap-2 mb-2">
            <OptionButton value={autosuggest.text1} onButtonClick={() => handleAutoSuggestClick('text1')}></OptionButton>
            <OptionButton value={autosuggest.text2} onButtonClick={() => handleAutoSuggestClick('text2')}></OptionButton>
            <OptionButton value={autosuggest.text3} onButtonClick={() => handleAutoSuggestClick('text3')}></OptionButton>
          </div>
        </Fade>
        <Form>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Control
              as="textarea"
              name="message"
              value={message.text}
              placeholder="Type Here"
              rows={2}
              onChange={(e) => handleFormInput(e)} />
          </Form.Group>
        </Form>
        <Dictaphone1 onListen={(transcript) => handleListen(transcript)} onListenClick={() => onListenClick()}></Dictaphone1>
      </div>

      <link
        rel="stylesheet"
        href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
        integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
        crossorigin="anonymous"
      />
    </>


  );
}

export default App;