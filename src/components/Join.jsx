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
import { useRecoilState, useSetRecoilState } from 'recoil';
import {messages, roomId, username, view} from '../store/atoms'
import axios from 'axios'
import { useContext } from 'react';
import { Socket } from '../store/socket'

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

  
function RenderJoinRoomView(){


    const [roomidvalue,setRoomId] = useRecoilState(roomId)
    const setView = useSetRecoilState(view)
    const [usernamevalue,setUsername]= useRecoilState(username)
    const setmessages = useSetRecoilState(messages)
    const socket = useContext(Socket)

    function handleJoinRoom(){
        axios.post("http://localhost:3000/chat",{
          "event":"joinroom",
          "room":roomidvalue,
          "name":usernamevalue,
        }).then(function(res){
          if(res.data.msg == 'ok'){
            setmessages(res.data.msgarr)
            socket.emit("joinroom",roomidvalue);
            setView("chatroom")
          }else{
            console.log("Room does not exist");
          }
        }).catch(function(err){
            console.log(err)
        })
      }

    return (
        <Box 
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
          Join a Room
        </Typography>
        <TextField
          fullWidth
          label="Username"
          variant="outlined"
          margin="normal"
          
          onChange={(e) => setUsername(e.target.value)}
          />
        <TextField
          fullWidth
          label="Room ID"
          variant="outlined"
          margin="normal"
          value={roomidvalue}
          onChange={(e) => setRoomId(e.target.value)}
          />
        <Button 
          fullWidth 
          variant="contained" 
          color="primary" 
          sx={{ mt: 2 }}
          onClick={handleJoinRoom}
          >
          Join Room
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

export default RenderJoinRoomView