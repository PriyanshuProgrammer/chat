import React, { useEffect, useInsertionEffect, useState } from 'react';
import RenderHomeView from './components/Home'
import RenderJoinRoomView from './components/Join';
import { 
  ThemeProvider, 
  createTheme, 
  CssBaseline, 
  Container,
  useStepContext, 

} from '@mui/material';
import { RecoilRoot, useRecoilValue, useSetRecoilState } from 'recoil';
import { view } from './store/atoms';
import {Socket} from './store/socket'
import RenderCreateRoomView from './components/Create';
import RenderChatRoom from './components/Chatroom';
import {io} from 'socket.io-client'

// Dark theme configuration
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#34556f',
    },
    background: {
      default: '#121212',
      paper: '#1d1d1d',
    },
  },
});

// Main Chat App Component
function App(){
  const [socket, setsocket] = useState();
  useEffect(function(){
    const socketserver = io("https://chatbackend-cdp3.onrender.com")
    setsocket(socketserver)
    return ()=>{
      socketserver.disconnect()
    }
  },[])
  return (
    <Socket.Provider value={socket}>
      <RecoilRoot>
        <Chatapp></Chatapp>
      </RecoilRoot>
    </Socket.Provider>
  );
};

function Chatapp(){
  
  const viewval = useRecoilValue(view)
  return (
  <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container maxWidth='xs' >
        {viewval === 'home' && <RenderHomeView/> }
        {viewval === 'join' && <RenderJoinRoomView/>}
        {viewval === 'create' && <RenderCreateRoomView/>}
        {viewval === 'chatroom' && <RenderChatRoom/>}
      </Container>
    </ThemeProvider>
  )
}

export default App; 