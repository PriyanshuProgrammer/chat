import { 
    ThemeProvider, 
    createTheme, 
    CssBaseline, 
    Container, 
    Box, 
    Typography, 
    TextField, 
    Button, 
    Paper,
    Grid,
    AppBar,
    Toolbar,
    IconButton,
    InputAdornment
  } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {roomId, username, view} from '../store/atoms'
import axios from 'axios'
import {Socket} from '../store/socket'
import { createContext, useContext } from 'react';

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

  
function RenderCreateRoomView(){
    const setView = useSetRecoilState(view)
    const socket = useContext(Socket)
    const setroomid = useSetRecoilState(roomId)
    const roomIdvalue = useRecoilValue(roomId)

    function handleCreateRoom(){
        let roomid = parseInt(Math.random()*10000+1000)
        setroomid(roomid)
        axios.post("https://chatbackend-cdp3.onrender.com/chat",{
          "event":"createroom",
          "username":"User",
          "room":roomid
        }).then(function(res){
          if(res.data=="Room already exist")
            handleCreateRoom()
        }).catch(function(err){
          console.log(err)
        })
    }

    return (<Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '100vh' 
        }}
      >
        <Paper 
          elevation={3} 
          sx={{ 
            padding: 4, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            width: '100%',
            maxWidth: 400 
          }}
        >
          <Typography variant="h5" gutterBottom>
            Create a Room
          </Typography>
          <Typography variant="h6" sx={{ flexGrow: 1, ml: 2 }}>
            Room: {roomIdvalue}
          </Typography>
          <Button 
            fullWidth 
            variant="contained" 
            color="primary" 
            sx={{ mt: 2 }}
            onClick={handleCreateRoom}
          >
            Create Room
          </Button>
          <Button 
            fullWidth 
            variant="text" 
            color="primary" 
            sx={{ mt: 1 }}
            onClick={() => setView('home')}
          >
            Back
          </Button>
        </Paper>
      </Box>
  )
}

export default RenderCreateRoomView