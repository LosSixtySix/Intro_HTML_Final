var socket = null;





var json = ""
var finishedGettingInfo = false

export var player = {
    start: function (x,y) {
        if (playerName != null){
            this.name= ""
            
        }
        else{
            this.name = null
        }
        this.x = x
        this.y = y
    },
    moveLeft: function(){
        this.x -=1
    },  
    moveRight: function(){
        this.x +=1
    },
    moveUp: function(){
        this.y -=1
    },
    moveDown: function(){
        this.y +=1
    },

}
player.start(50,50)

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

const drawCircle = (x,y)=>{
    myGameArea.context.beginPath();
    myGameArea.context.arc(x,y,5,0,2*Math.PI);
    myGameArea.context.stroke();
}

const setup = () =>{
    const connectButton = document.getElementById('connectButton')
    connectButton.onclick = function connect(){
        var url = 'http://localhost:5069';
    
        socket = new WebSocket(url);
    
        socket.addEventListener('open',function(event) {
            console.log('Connected to ' + url)
        });
        socket.addEventListener('message',async function(event){
            const Json = JSON.parse(event.data)
            json = Json
            finishedGettingInfo = true
        });
    }
    const loadPositions = () =>{
        console.log("getting positions")
        const msg = {
            request: "getPositions",
            position : null,
        }
    
        socket.send(JSON.stringify(msg))
    }
    const sendButton = document.getElementById("sendButton")
    sendButton.onclick = () => loadPositions()
}  
const update = async () => {
    requestAnimationFrame(() =>{
        if(finishedGettingInfo)
        {
            finishedGettingInfo = false
            console.log(json)
        }
        updatePhysics()
        update()
    })
}
setup()
update()

