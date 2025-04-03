import { loadPlayer } from "./service.js"

var url = "http://localhost:5069"



var playerName = ""

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