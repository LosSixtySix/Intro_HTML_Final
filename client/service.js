import { player} from "./domain.js"
import {startGame} from "./ui.js"

const url = "http://localhost:5069"

export var socketData = null
export var finishedGettingInfo = false
export var finsishedUsingInfo = true

export const setFinishedGettingInfo = () =>{
    if(finishedGettingInfo)
    {
        finishedGettingInfo = false
    }
    else{
        finishedGettingInfo = true
    }
}
export const setfinsishedUsingInfo = () =>{
    if(finsishedUsingInfo)
    {
        finsishedUsingInfo = false
    }
    else{
        finsishedUsingInfo = true
    }
}

export const setupSocketData =  () =>{
   socketData = {
        socket : new WebSocket(url),
        data: null,
    } 
    socketData.socket.addEventListener('open',function(event){
        console.log('Connected to '+ url)
        startGame()
    })
    socketData.socket.addEventListener('message',function(event){
        const json = JSON.parse(event.data)
        socketData.data = json
        finishedGettingInfo = true
        finsishedUsingInfo = false
    })
}


export const loadPositions =  () =>{
    console.log("getting positions...")
    const msg = {
        request: "getPositions",
        position: null,
    }
    socketData.socket.send(JSON.stringify(msg))
}
export const loadPlayer =  () =>{
    const newPosition ={
        xCordinate: player.xCordinate,
        yCordinate: player.yCordinate,
        whatIsThere: player.name
    }
    const msg ={
        request: "firstConnection",
        position: newPosition,
    }
    socketData.socket.send(JSON.stringify(msg))
}
export const updatePosition = (position,whatsThere) =>{
    const newPosition ={
        xCordinate: position[0],
        yCordinate: position[1],
        whatIsThere: whatsThere,
    }
    const msg = {
        request: "updatePosition",
        position: newPosition,
    }
    socketData.socket.send(JSON.stringify(msg))
}
