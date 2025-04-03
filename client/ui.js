import { dataRecieved, FirstConnection,firstConnection, player, setDataRecieved, setFirstConnection, socketData } from "./domain.js";
import {loadPlayer, loadPositions, updatePosition} from "./service.js"
var myGameArea = {
    canvas : document.createElement("canvas"),
    start: function() {
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        document.body.appendChild(this.canvas)
    }
}

var settingUp = true
var gettingPositions = true
var updatingPosition = true

export const startGame = () =>{
    myGameArea.start()
    console.log("Game started....")
    //update()
}
const drawCircle = (x,y)=>{
    myGameArea.context.beginPath();
    myGameArea.context.arc(x,y,5,0,2*Math.PI);
    myGameArea.context.stroke();
}
const renderCircles = async() => {
    const positions = socketData.data
    if (positions != [])
        myGameArea.context.clearRect(0,0,myGameArea.canvas.width,myGameArea.canvas.height)
        positions.forEach(element => {
            drawCircle(element.xCordinate,element.yCordinate)
        });
}

const pressedKeys = new Set();
const isKeyDown = (key) => pressedKeys.has(key);
document.addEventListener('keydown',(e)=> pressedKeys.add(e.key))
document.addEventListener('keyup',(e)=> pressedKeys.delete(e.key))

const updatePhysics = async()=>{
    if(isKeyDown('w')){
        player.moveUp();
    }
    if(isKeyDown('s')){
        player.moveDown();
    }
    if(isKeyDown('a')){
        player.moveLeft();
    }
    if(isKeyDown('d')){
        player.moveRight();
    }
}


const update =  async() =>{
    requestAnimationFrame(()=>{
        if(FirstConnection)
        {
            loadPlayer()
            setFirstConnection()
        }
        if(dataRecieved && settingUp)
        {
            player.setName(socketData.data)
            setDataRecieved()
            startGame()
            settingUp = false
        }
        if(player.name === "Player1" || player.name === "Player2")
        {
            updatePhysics()
            updatePosition()
            if(gettingPositions)
            {
                loadPositions()
                gettingPositions = false
            }
            if(dataRecieved)
            {
                renderCircles()
                setDataRecieved()
                gettingPositions = true
            }
            
        }
        update();
    })
}
firstConnection()
update()