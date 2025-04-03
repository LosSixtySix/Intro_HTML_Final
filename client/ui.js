import { loadPositions, updatePosition,socketData,setupSocketData,finishedGettingInfo,finsishedUsingInfo, loadPlayer, setfinsishedUsingInfo } from "./service.js";
import {player} from "./domain.js"
var myGameArea = {
    canvas : document.createElement("canvas"),
    start: function() {
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        document.body.appendChild(this.canvas)
    }
}

export const startGame = () =>{
    myGameArea.start()
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
        updatePhysics();
        updatePosition([player.x,player.y],player.name);
        loadPositions();
        if(finishedGettingInfo && finsishedUsingInfo)
        {
            renderCircles();
        }
        if(finsishedUsingInfo === false)
        {
            loadPlayer()
            setfinsishedUsingInfo()
        }
        update();
    })
}


setupSocketData()

