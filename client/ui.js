import { loadPositions, updatePosition } from "./service.js";
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

const startGame = () =>{
    myGameArea.start()
}
const drawCircle = (x,y)=>{
    myGameArea.context.beginPath();
    myGameArea.context.arc(x,y,5,0,2*Math.PI);
    myGameArea.context.stroke();
}
const renderCircles = async() => {
    const positions = await loadPositions()
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
        await updatePosition([player.x,player.y],player.name)
    }
    if(isKeyDown('s')){
        player.moveDown();
        await updatePosition([player.x,player.y],player.name)
    }
    if(isKeyDown('a')){
        player.moveLeft();
        await updatePosition([player.x,player.y],player.name)
    }
    if(isKeyDown('d')){
        player.moveRight();
        await updatePosition([player.x,player.y],player.name)
    }
}


const update =  async() =>{
    
    requestAnimationFrame(()=>{
        updatePhysics();
        renderCircles();
        update();
    })
}



var running = true
console.log(player.name)
startGame()
renderCircles()
update()