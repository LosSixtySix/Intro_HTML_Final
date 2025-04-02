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
    document.body.addEventListener("keydown", async(event) =>{
        if (event.key === 'w'){
            player.y -= 1
            await updatePosition([player.x,player.y],player.name)
        }
        else if(event.key === 's')
        {
            player.y += 1
            await updatePosition([player.x,player.y],player.name)
        }
        else if(event.key === 'a')
        {
            player.x -= 1
            await updatePosition([player.x,player.y],player.name)
        }
        else if(event.key === 'd')
        {
            player.x +=1
            await updatePosition([player.x,player.y],player.name)
        }
        
        renderCircles()
    })

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

const update =  async() =>{
    
    requestAnimationFrame(()=>{
        renderCircles();
        update();
    })
}



var running = true
console.log(player.name)
startGame()
renderCircles()
update()