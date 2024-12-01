import React, { createContext, useContext, useEffect, useState } from 'react';
import { Send, UserCircle2 } from 'lucide-react';
import { RecoilRoot, useRecoilValue, useRecoilValueLoadable, useSetRecoilState } from 'recoil';
import { server } from './assets/store/atoms';
import {io} from 'socket.io-client'
import {Socket} from './assets/store/Socket'
import { SoupKitchenTwoTone } from '@mui/icons-material';

// Main App Component
const App = () => {
  const [username, setUsername] = useState('');
  const [roomId, setRoomId] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const [socket, setsocket] = useState()
  useEffect(function(){
    const socketserver = io("https://chatbackend-cdp3.onrender.com")
    setsocket(socketserver)
  },[])
  
  const handleJoin = () => {
    if (username.trim() && roomId.trim()) {
      setIsJoined(true);
      socket.emit("joinroom",roomId)
    }
  };

  // Render join screen or chat room
  return (
    <Socket.Provider value={socket}>
    <RecoilRoot>
        
    <div className="flex items-center justify-center min-h-screen text-white bg-gray-900">
      {!isJoined ? (
        <JoinScreen 
          username={username}
          roomId={roomId}
          onUsernameChange={setUsername}
          onRoomIdChange={setRoomId}
          onJoin={handleJoin}
        />
      ) : (
        <ChatRoom 
          username={username}
          roomId={roomId}
          onLeave={() => setIsJoined(false)}
        />
      )}
    </div>
    </RecoilRoot>
    </Socket.Provider>
  );
};

// Join Screen Component
const JoinScreen = ({ 
  username, 
  roomId, 
  onUsernameChange, 
  onRoomIdChange, 
  onJoin 
}) => {
    const servervalue = useRecoilValueLoadable(server)    
    return (
    <div className="p-8 bg-gray-800 shadow-2xl rounded-xl w-96">
        {servervalue.state == 'hasValue' ? 
        <>
        
      <h1 className="mb-6 text-2xl font-bold text-center">Join Chat Room</h1>
      <div className="mb-4">
        <label htmlFor="username" className="block mb-2 text-sm font-medium">
          Username
        </label>
        <input 
          type="text"
          id="username"
          value={username}
          onChange={(e) => onUsernameChange(e.target.value)}
          placeholder="Enter your username"
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-6">
        <label htmlFor="roomId" className="block mb-2 text-sm font-medium">
          Room ID
        </label>
        <input 
          type="text"
          id="roomId"
          value={roomId}
          onChange={(e) => onRoomIdChange(e.target.value)}
          placeholder="Enter room ID"
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button 
        onClick={onJoin}
        disabled={!username.trim() || !roomId.trim()}
        className="w-full py-2 font-bold text-white transition duration-300 ease-in-out bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Join Room
      </button>
      </>
      : <h1 className="mb-6 text-2xl font-bold text-center">Loading....</h1>}
    </div>
  );
};

// Chat Room Component
const ChatRoom = ({ username, roomId, onLeave }) => {
    const socket = useContext(Socket)
    
  const [messages, setMessages] = useState([
    { room:roomId, text: `Welcome to room ${roomId}!`, sender: 'System' },
  ]);
  
  const [newMessage, setNewMessage] = useState('');
  
  useEffect(function(){
      socket.on("chat",function(obj){
          console.log(obj)
          setMessages(messagelist=>[...messagelist,{room:roomId,text:obj.msg,sender:obj.user}])
      })
      return function(){
        socket.off("chat")
    }
  },[socket,roomId])
  
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        room: roomId,
        text: newMessage,
        sender: username
      };
      socket.emit("chat",{
            room:roomId,
            text: newMessage,
            sender:username
      })
      setNewMessage('');
      
    }
  };

  return (
    <div className="flex flex-col w-full h-screen max-w-2xl bg-gray-900">
      {/* Header */}        
      <div className="flex items-center justify-between p-4 bg-gray-800">
        <div className="flex items-center">
          <UserCircle2 className="mr-3 text-blue-400" size={40} />
          <div>
            <h2 className="font-bold">{roomId}</h2>
          </div>
        </div>
        <button 
          onClick={onLeave}
          className="px-3 py-1 text-sm text-white bg-red-600 rounded-md hover:bg-red-700"
        >
          Leave Room
        </button>
      </div>

      {/* Messages */}
      <div className="flex-grow p-4 space-y-4 overflow-y-auto">
        {messages.map((msg,index) => (
          <MessageBubble 
          key={index}
            message={msg} 
            isOwnMessage={msg.sender === username} 
          />
        ))}
      </div>

      {/* Message Input */}
      <div className="flex items-center p-4 bg-gray-800">
        <input 
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message"
          className="flex-grow px-3 py-2 mr-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <button 
          onClick={handleSendMessage}
          disabled={!newMessage.trim()}
          className="p-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

// Message Bubble Component
const MessageBubble = ({ message, isOwnMessage }) => {
  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
      <div 
        className={`max-w-xs p-3 rounded-lg ${
          isOwnMessage 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-700 text-white'
        } ${isOwnMessage ? 'rounded-br-none' : 'rounded-bl-none'}`}
      >
        {!isOwnMessage && (
          <div className="mb-1 text-xs text-gray-300">{message.sender}</div>
        )}
        <p>{message.text}</p>
        <div className="mt-1 text-xs text-right text-gray-300">
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};

export default App;