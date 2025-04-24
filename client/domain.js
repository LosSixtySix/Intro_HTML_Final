import { playerTakeDamage } from "./service.js"

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
        this.HP = 1000
    },
    start: function (x,y) {
        this.x = x
        this.y = y
        this.setColor()
    },
    setColor: function (){
        const randColor = Math.floor(Math.random() * 10)
        if(randColor === 0)
        {
            this.color = "#f000ff"
        }
        else if(randColor === 1)
        {
            this.color = "#4deeea"
        }
        else if(randColor === 2)
        {
            this.color = "#006d91"
        }
        else if(randColor ===3)
        {
            this.color = "#74ee15"
        }
        else if(randColor ===4)
        {
            this.color = "#88ffa5"
        }
        else if (randColor === 5)
        {
            this.color = "#ee008c"
        }
        else if (randColor === 6)
        {
            this.color = "#80c028"
        }
        else if (randColor === 7)
        {
            this.color = "#932b3d"
        }
        else if (randColor === 8)
        {
            this.color = "#9c7bfc"
        }
        else if( randColor === 9)
        {
            this.color = "#ff8100"
        }   
    },
    moveLeft: function(){
        if (CurrentPositions.positions != null)
        {
            var moveBool = true
            CurrentPositions.positions.forEach(element => {
                if(element.whatIsThere != "projectile")
                {
                    if (this.x -11 < element.xCordinate && this.x >= element.xCordinate  && this.y +8 > element.yCordinate && this.y-8<= element.yCordinate && element.whatIsThere != playerName)
                    {
                        moveBool = false
                    }
                }
                else if(element.whatIsThere === "projectile")
                {
                    if (this.x -8 < element.xCordinate && this.x >= element.xCordinate  && this.y +3 > element.yCordinate && this.y-3<= element.yCordinate && element.whatIsThere != playerName)
                        {
                            playerTakeDamage()
                        }  
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
                    if(element.whatIsThere != "projectile")
                    {
                        if (this.x +11 > element.xCordinate && this.x <= element.xCordinate  && this.y +8 > element.yCordinate && this.y -8 <= element.yCordinate && element.whatIsThere != playerName)
                        {
                            moveBool = false
                        }
                    }
                    else if(element.whatIsThere === "projectile")
                    {
                        if (this.x +8 > element.xCordinate && this.x <= element.xCordinate  && this.y +3 > element.yCordinate && this.y -3 <= element.yCordinate && element.whatIsThere != playerName)
                            {
                                playerTakeDamage()
                            }    
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
                    if(element.whatIsThere != "projectile")
                    {
                        if (this.x +8 > element.xCordinate && this.x -8 <= element.xCordinate  && this.y -11 < element.yCordinate && this.y >= element.yCordinate && element.whatIsThere != playerName)
                        {
                            moveBool = false

                        }
                    }
                    else if (element.whatIsThere === "projectile")
                    {
                        if (this.x +3 > element.xCordinate && this.x -3 <= element.xCordinate  && this.y -8 < element.yCordinate && this.y >= element.yCordinate && element.whatIsThere != playerName)
                            {
                                playerTakeDamage()
                            }
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
                    if(element.whatIsThere != "projectile")
                    {
                        if (this.x +8 > element.xCordinate && this.x-8 <= element.xCordinate  && this.y +11 > element.yCordinate && this.y <= element.yCordinate && element.whatIsThere != playerName)
                        {
                            moveBool = false
                        }
                    }
                    else if(element.whatIsThere === "projectile")
                    {
                        if (this.x +3 > element.xCordinate && this.x-3 <= element.xCordinate  && this.y +8 > element.yCordinate && this.y <= element.yCordinate && element.whatIsThere != playerName)
                            {
                                playerTakeDamage()
                            }
                    }
                });
                if (moveBool)
                {
                    this.y +=1
                }
            } 
        
    },

}
