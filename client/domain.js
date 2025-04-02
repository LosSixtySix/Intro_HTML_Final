import { loadPlayer } from "./service.js"

const playerName = await loadPlayer()
export var player = {
    start: function(x,y) {
        if (playerName != null){
            this.name= playerName[0]
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