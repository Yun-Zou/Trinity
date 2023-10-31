import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Fade from 'react-bootstrap/Fade'

import Dictaphone1 from './Dictaphone1';
import OptionButton from './OptionButton';

function InputForm({props}) {

    const [autosuggest, setAutosuggest] = useState({
        text1: "test1",
        text2: "test2",
        text3: "test3",
        show: true
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

    function handleAutoSuggestClick(event) {
        const nextSuggestions = autosuggest;
        setMessage({
            text: autosuggest[event]
        })

        setAutosuggest({
            text1: " ",
            text2: " ",
            text3: " ",
            show: false
        })

    }

    return (
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
                        onChange={(e) => handleFormInput(e)}/>
                </Form.Group>
            </Form>
            <Dictaphone1></Dictaphone1>
        </div>

    )
}

export default InputForm;