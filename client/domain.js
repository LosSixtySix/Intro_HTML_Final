var url = "http://localhost:5069"

var playerName = ""

export var socketData = null
export var dataRecieved = null
export var FirstConnection = false
export var CurrentPositions =  {
    positions: null,
    setPosition: function(position){
        this.positions = position
    }
}

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
        playerName = name
    },
    start: function (x,y) {
        this.x = x
        this.y = y
    },
    moveLeft: function(){
        if (CurrentPositions.positions != null)
        {
            var moveBool = true
            CurrentPositions.positions.forEach(element => {
                if (this.x -11 < element.xCordinate && this.x >= element.xCordinate  && this.y +8 > element.yCordinate && this.y-8<= element.yCordinate && element.whatIsThere != playerName)
                {
                    moveBool = false
                }
            });
            if (moveBool)
            {
                this.x -=1
            }
        } 
    },  
    moveRight: function(){
        if (CurrentPositions.positions != null)
            {
                var moveBool = true
                CurrentPositions.positions.forEach(element => {
                    if (this.x +11 > element.xCordinate && this.x <= element.xCordinate  && this.y +8 > element.yCordinate && this.y -8 <= element.yCordinate && element.whatIsThere != playerName)
                    {
                        moveBool = false
                    }
                });
                if (moveBool)
                {
                    this.x +=1
                }
            }   
    },
    moveUp: function(){
        if (CurrentPositions.positions != null)
            {
                var moveBool = true
                CurrentPositions.positions.forEach(element => {
                    if (this.x +8 > element.xCordinate && this.x -8 <= element.xCordinate  && this.y -11 < element.yCordinate && this.y >= element.yCordinate && element.whatIsThere != playerName)
                    {
                        moveBool = false

                    }
                });
                if (moveBool)
                {
                    this.y -=1
                }
            }   
        
    },
    moveDown: function(){
        if (CurrentPositions.positions != null)
            {
                var moveBool = true
                CurrentPositions.positions.forEach(element => {
                    if (this.x +8 > element.xCordinate && this.x-8 <= element.xCordinate  && this.y +11 > element.yCordinate && this.y <= element.yCordinate && element.whatIsThere != playerName)
                    {
                        moveBool = false
                    }
                });
                if (moveBool)
                {
                    this.y +=1
                }
            } 
        
    },

}
