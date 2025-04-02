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
    }
}
player.start(50,50)