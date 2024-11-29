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
import { useSetRecoilState } from 'recoil';
import {view} from '../store/atoms'

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

function RenderHomeView() {
    
    const setView = useSetRecoilState(view)
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
      <Typography variant="h4" gutterBottom>
        Chat Application
      </Typography>
      <Grid container spacing={2} justifyContent="center">
        <Grid item>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => setView('join')}
          >
            Join Room
          </Button>
        </Grid>
        <Grid item>
          <Button 
            variant="outlined" 
            color="primary" 
            onClick={() => setView('create')}
          >
            Create Room
          </Button>
        </Grid>
      </Grid>
    </Box>
  )
}

export default RenderHomeView