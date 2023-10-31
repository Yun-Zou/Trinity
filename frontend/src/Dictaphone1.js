import React, { useEffect, useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import Button from 'react-bootstrap/Button'
import microphone from './assets/images/microphone.png'

const Dictaphone1 = ({onListen, onListenClick}) => {
    const [message, setMessage] = useState('');
    const commands = [
        {
            command: 'reset',
            callback: () => resetTranscript()
        }
    ]
    const {
        transcript,
        interimTranscript,
        finalTranscript,
        resetTranscript,
        listening,
    } = useSpeechRecognition({ commands });

    useEffect(() => {
        if (finalTranscript !== '') {
            onListen(finalTranscript)
            console.log('Got final result:', finalTranscript);
            resetTranscript()
        }
    }, [interimTranscript, finalTranscript]);
    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
        return null;
    }

    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
        console.log('Your browser does not support speech recognition software! Try Chrome desktop, maybe?');
    }
    const listenContinuously = () => {
        if (listening) {
            SpeechRecognition.stopListening()
            resetTranscript()
            onListenClick()
        } else {
            SpeechRecognition.startListening({
                continuous: true,
                language: 'en-GB',
            });
        }

    };
    return (
        <div>
            <div>
                <div class="text-center">
                    {/* <button type="button" onClick={resetTranscript}>Reset</button> */}
                    <Button
                        className="rounded-circle p-3 microphone-button"
                        variant={listening ? 'danger': 'secondary'}
                        size="sm"
                        onClick={listenContinuously}
                    >
                        <img class="microphone" src={microphone}></img>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Dictaphone1;