import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { allUsersRoute } from '../utils/APIRoutes';
import Contacts from '../components/Contacts';
import Welcome from '../components/Welcome';
import ChatContainer from '../components/ChatContainer';
import {io} from "socket.io-client";
import { host } from '../utils/APIRoutes';

function Chat() {

  const socket = useRef();

  const navigate = useNavigate();
  const [contacts, setContacts] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentChat, setCurrentChat] = useState(undefined);

  const handleCurrentChat = (chat) => {
    setCurrentChat(chat);
  }

  useEffect(() => {
    async function fetch1(){
      if(!localStorage.getItem("chat-app-user"))
        navigate("/login");
      else{
        setCurrentUser(await JSON.parse(localStorage.getItem("chat-app-user")));
      }
    }
    fetch1();
  }, []);

  useEffect(() => {
    if(currentUser){
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser])

  useEffect(() => {
    async function fetch2(){
      if(currentUser){
        if(currentUser.isAvatarImageSet){
          const {data} = await axios.get(`${allUsersRoute}/${currentUser._id}`)
          setContacts(data);
        }else{
          navigate("/setAvatar");
        }
      }
    }
    fetch2(); 
  }, [currentUser]);

  if(currentUser && contacts){
   return(
    <Container>
      <div className="container">
        <Contacts className="contactDiv" 
        contacts={contacts} 
                  currentUser={currentUser}
                  changeChat={handleCurrentChat} />
        {
          currentChat === undefined?
          <Welcome className="restDiv" currentUser={currentUser}/>:
          <ChatContainer  className="restDiv" currentChat={currentChat} currentUser={currentUser} socket={socket}/>
        }      
      </div>
    </Container>
   );     
  }
  }


const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column; 
  justify-content: center;
  gap:1rem;
  align-items: center;
  background-color: #131324;

  .container{
    height: 90vh;
    width: 95vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;

    @media screen and (min-width: 720px) and (max-width:1080px){
      grid-template-columns: 35% 65%;
    }

    @media screen and (min-width: 200px) and (max-width: 720px){
      height: 100vh;
      width: 100vw;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      .contactDiv{
        padding-top: 5%;
        height: 45%;
      }

      .restDiv{
        height: 55%;
      }
    }
  }
`;
export default Chat