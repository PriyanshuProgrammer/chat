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
import { useRecoilValue, useSetRecoilState } from 'recoil';
import {hitclient, messages, roomId, username, view} from '../store/atoms'
import {useState} from 'react'
import {Socket} from '../store/socket'
import { useContext } from 'react';

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


function RenderChatRoom(){
  const [currentMessage, setCurrentMessage] = useState([])
  const roomIdvalue = useRecoilValue(roomId)  
  const setMessages = useSetRecoilState(messages)
  const messagelist = useRecoilValue(messages)
  const usernamevalue = useRecoilValue(username)
  const setView = useSetRecoilState(view)
  const socket = useContext(Socket)
  const sethitclient = useSetRecoilState(hitclient)

  function handleSendMessage(){
    sethitclient(value => value+1)
    socket.emit("chat",{
      room:roomIdvalue,
      msg:{
        name:usernamevalue,
              value:currentMessage,
            }
          })
    setCurrentMessage("")
  }

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100vh' 
      }}
    >
      {/* Room Header */}
      <AppBar position="static">
        <Toolbar>
          <IconButton 
            edge="start" 
            color="inherit" 
            aria-label="back"
            onClick={() => setView('home')}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, ml: 2 }}>
            Room: {roomIdvalue}
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Message List */}
      <Box 
        sx={{ 
          flexGrow: 1, 
          overflowY: 'auto', 
          p: 2,
          backgroundColor: 'background.default'
        }}
      >
        {messagelist.map((msg, index) => (
          <Box 
            key={index} 
            sx={{ 
              mb: 1, 
              display: 'flex', 
              justifyContent: msg.name === usernamevalue ? 'flex-end' : 'flex-start' 
            }}
          >
            <Paper 
              sx={{ 
                p: 1, 
                maxWidth: '70%',
                backgroundColor: msg.name === usernamevalue ? 'primary.main' : 'background.paper'
              }}
            >
              {msg.name !== usernamevalue && (
                <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
                  {msg.name}
                </Typography>
              )}
              <Typography variant="body2">
                {msg.value}
              </Typography>
            </Paper>
          </Box>
        ))}
      </Box>

      {/* Message Input */}
      <Box sx={{ p: 2, backgroundColor: 'background.paper' }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type a message"
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') handleSendMessage();
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton 
                  color="primary" 
                  onClick={handleSendMessage}
                  edge="end"
                >
                  <SendIcon />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      </Box>
    </Box>
    )
}

export default RenderChatRoom