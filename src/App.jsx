import {BrowserRouter as Router, Route, Routes, Link, useNavigate} from "react-router-dom"
import React, { useEffect, useState } from 'react'
import {io} from "socket.io-client"
import axios from "axios"

let socket;

function App() {
  const [messages,setmessages] = useState([]);
  // const [socket, setsocket] = useState(null);
  const navigate = useNavigate();

  useEffect(function(){
    const socketio = io('http://192.168.1.3:3000');
    socket = socketio;
    let name = localStorage.getItem("name")
    let roomid = localStorage.getItem("roomid")
    if(name&&roomid){
      autojoin(roomid,name)
    }
  },[])


  function sendmsg(){
    let msg = document.querySelector("#chatvalue")
    let roomid = localStorage.getItem("roomid")
    let name = localStorage.getItem("name")
    socket.emit("chat",{
      room:roomid,
      msg:{
        name:localStorage.getItem("name"),
        value:msg.value,
      }
    })
    msg.value = ""
  }

  if(socket){
    socket.on("chat",function(msg){
      console.log(msg)
      setmessages([...messages,{name:msg.name,value:msg.value}])
    })
  }

  function leaveroom(){
    localStorage.removeItem("roomid")
    localStorage.removeItem("name")
    tofirstsection()
    setmessages([])
  }

  function tofirstsection(){
    navigate("/")
  }

  function tochatsection(){
    navigate("/chat")
  }

  function createroom(){
    let roomid = parseInt(Math.random()*10000+1000)
    let input = document.querySelector("#createusername");
    axios.post("http://192.168.1.3:3000/chat",{
      "event":"createroom",
      "username":input.value,
      "room":roomid
    }).then(function(res){
      if(res.data=="Room already exist")
        createroom()
      else{
        localStorage.setItem("roomid",`${roomid}`)
        localStorage.setItem("name",`${input.value}`)
        autojoin(localStorage.getItem("roomid"),localStorage.getItem("name"))
        tochatsection()
      }
    }).catch(function(err){
      console.log(err)
    })
  }

  function joinroom(){
    let input = document.querySelector("#joinroomid")
    let input1 = document.querySelector("#joinusername")
    axios.post("http://192.168.1.3:3000/chat",{
      "event":"joinroom",
      "room":input.value,
      "name":input1.value,
    }).then(function(res){
      if(res.data.msg == 'ok'){
        localStorage.setItem("roomid",input.value)
        localStorage.setItem("name",input1.value)   
        setmessages(res.data.msgarr)
        socket.emit("joinroom",input.value);
        tochatsection();
      }else{
        console.log("Room does not exist");
        leaveroom()
      }
    })
  }

  function autojoin(room,name){
    axios.post("http://192.168.1.3:3000/chat",{
      "event":"joinroom",
      "room":room,
      "name":name,
    }).then(function(res){
      if(res.data.msg == 'ok'){ 
        setmessages(res.data.msgarr)
        socket.emit("joinroom",room);
        tochatsection();
      }else{
        console.log("Room does not exist");
        leaveroom()
      }
    })
  }


  return (
    <div className="grid w-full h-screen place-content-center bg-slate-950">
      <Routes>
        <Route path='/' element={<Firstsection createroom = {createroom} joinroom = {joinroom}></Firstsection>}></Route>
        <Route path='/chat' element={<Chatsection messages={messages} leaveroom = {leaveroom} sendmsg = {sendmsg}></Chatsection>}></Route>
      </Routes>
      
    </div>
  )
}

function Firstsection(props){
  return (
    <div className="flex w-[70vw] justify-between">
        <div>
          <h1 className="text-2xl text-white mb-14">Join Room</h1>
          <input id="joinroomid" className="block pt-2 pb-2 pl-6 pr-6 text-white border-none rounded-full outline-none bg-slate-700" placeholder="Enter room id" type="text" />
          <input id='joinusername' className="pt-2 pb-2 pl-6 pr-6 mt-1 text-white border-none rounded-full outline-none text-clipt-white bg-slate-700" placeholder="Enter your name..." type="text" />
          
          <button  onClick={props.joinroom} className="pt-2 pb-2 pl-6 pr-6 ml-1 text-gray-400 bg-black rounded-full">Join</button>
        </div>
        <div>
          <h1 className="text-2xl text-white mb-14">Create Room</h1>
          <input id='createusername' className="pt-2 pb-2 pl-6 pr-6 text-white border-none rounded-full outline-none bg-slate-700" placeholder="Enter your name..." type="text" />
          <button onClick={props.createroom} className="pt-2 pb-2 pl-6 pr-6 ml-1 text-gray-400 bg-black rounded-full">Create</button>
        </div>
    </div>
  )
}

function Chatsection(props){
  let roomid = localStorage.getItem("roomid")
  return (
    <>
    <div className="flex justify-between">
      <h1 className="text-white">RoomId:{roomid}</h1>
      <button onClick={props.leaveroom} className="ml-1 text-gray-400 rounded-[50px] bg-slate-800 pr-1 pl-1">Escape</button>
    </div>

    
      <div className="flex w-[40vw] h-[80vh]  border-white border-2 rounded-xl overflow-y-scroll ">
        
        <div className="mt-auto w-[100%] p-8">

          {
            
            props.messages.map(function(obj){
              if(obj.name == localStorage.getItem("name")){
                return (
                  <div className="p-2 ml-auto text-black max-w-[50%] bg-gray-500 rounded-xl w-fit mt-1">You:{obj.value}</div>
                )
              }else{
                return (
                  <div className="p-2 mr-auto text-black max-w-[50%] bg-gray-500 rounded-xl w-fit mt-1">{obj.name}:{obj.value}</div>
                )
              }
            })
          }

        </div>
        
      </div>
        <div className="w-[100%]  h-fit">
         <input id="chatvalue" className="pt-2 pb-2 pl-6 pr-6 text-white border-none rounded-full outline-none bg-slate-700 w-[30vw] " placeholder="Enter your msg..." type="text" />
         <button onClick={props.sendmsg} className="pt-2 pb-2 pl-6 pr-6 ml-1 text-gray-400 bg-black rounded-full w-[10vw]">Send</button>
        </div>
    </>
  )
}


export default App
