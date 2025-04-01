export var player = {
    start: function(x,y) {
        this.name= `player${Math.floor(Math.random()*1001)}`
        this.x = x
        this.y = y
    }
}
player.start(50,50)