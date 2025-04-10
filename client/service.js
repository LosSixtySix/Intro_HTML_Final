import {socketData, player} from "./domain.js"

const url = "http://localhost:5069"

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
export const loadPlayerStats = () =>{
    const newPosition = {
        xCordinate: player.x,
        yCordinate: player.y,
        whatIsThere: player.name
    }
    const msg = {
        request: "GetPlayerStats",
        position: newPosition
    }
    console.log(msg)
    socketData.socket.send(JSON.stringify(msg))
}
export const loadPositions =  () =>{
    const msg = {
        request: "getPositions",
        position: null,
    }
    socketData.socket.send(JSON.stringify(msg))
}
export const loadPlayer =  (name) =>{
    const newPosition ={
        xCordinate: player.x,
        yCordinate: player.y,
        whatIsThere: ""
    }
    const msg ={
        request: name,
        position: newPosition,
    }
    socketData.socket.send(JSON.stringify(msg))
}
export const updatePosition = () =>{
    const newPosition ={
        xCordinate: player.x,
        yCordinate: player.y,
        whatIsThere: player.name,
    }
    const msg = {
        request: "updatePosition",
        position: newPosition,
    }
    socketData.socket.send(JSON.stringify(msg))
}
