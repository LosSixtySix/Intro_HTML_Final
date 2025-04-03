var url = "http://localhost:5069"

var playerName = ""

export var socketData = null
export var dataRecieved = null
export var FirstConnection = false

export const firstConnection = ()=>{
    socketData = {
        socket: new WebSocket(url),
        data: null,
    }
    socketData.socket.addEventListener('open',function(event){
        console.log(`Connected to ${url}`)
        FirstConnection = true
    })
    socketData.socket.addEventListener('message',function(event){
        const json = JSON.parse(event.data)
        socketData.data = json
        dataRecieved = true
    }) 
    player.start(50,50)
}
export const setDataRecieved = ()=>{
    dataRecieved = false
}
export const setFirstConnection = () =>{
    FirstConnection = false
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


export var player = {
    setName: function(name){
        this.name = name
    },
    start: function (x,y) {
        if (playerName != null){
            this.name= playerName
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
