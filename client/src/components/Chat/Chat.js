import React, { useState, useEffect } from 'react';
import querryString from'query-string';
import io from 'socket.io-client';

import Infobar from '../Infobar/Infobar';
import Input from '../Input/Input'
import Messages from '../Messages/Messages'
import TextContainer from '../TextContainer/TextContainer';

import './Chat.css';


let socket;

const Chat = ({ location }) => {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState('');
    const ENDPOINT = 'https://chat-app-re.herokuapp.com/'

    useEffect(() => {
        const { name, room } = querryString.parse(location.search);

        socket = io(ENDPOINT);

        setName(name);
        setRoom(room);
        socket.emit('join', { name, room }, () => {

        });

        return () => {
            socket.emit('disconnect');

            socket.off();
        }
    }, [ENDPOINT, location.search])

    useEffect(() => {
        socket.on('message', (message) => {
            setMessages(messages => [...messages, message]);
        });

        socket.on("roomData", ({ users }) => {
            setUsers(users);
        });
    }, []);

    

    //function for sending message
    const sendMessage = (event) => {
        event.preventDefault();  
        //prevent key press and not gonna restart the page
        
        if(message) {
            socket.emit('sendMessage', message, () => setMessage(''));
        }
    }
    console.log(message, messages);

    return (
        <div className="outerContainer">
            <div className="container">
                <Infobar room={ room }/>

                <Messages messages={messages} name={name} />

                <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />

            </div>
            <TextContainer users={users}/>
        </div>
    )
}

export default Chat;