import { CurrentPositions, dataRecieved, FirstConnection,firstConnection, player, setDataRecieved, setFirstConnection, socketData } from "./domain.js";
import {loadPlayer, loadPlayerStats, loadPositions, updatePosition} from "./service.js"
var myGameArea = {
    canvas : document.createElement("canvas"),
    start: function() {
        this.canvas.width = 600;
        this.canvas.height = 600;
        this.context = this.canvas.getContext("2d");
        document.body.appendChild(this.canvas)
    }
}

var settingUp = true
var gettingPositions = false
var statsChange = false
var loadingPlayerStats = true
var positionsRecieved = false
var statsRecieved = false

export const startGame = () =>{
    myGameArea.start()
    console.log("Game started....")
    //update()
}
const drawCircle = (x,y)=>{
    myGameArea.context.beginPath();
    myGameArea.context.arc(x,y,5,0,2*Math.PI);
    myGameArea.context.stroke();
}
const drawImage = (x,y) =>{
    const img = document.createElement("img")
    img.src = "/images/BigBishop.png"

    myGameArea.context.drawImage(img,x,y,25,25)
}
const drawRectangle = (x,y,width,height)=>{
    myGameArea.context.fillRect(x,y,width,height)
}
const renderBoard = () => {
    const positions = socketData.data
    CurrentPositions.setPosition(positions)
    myGameArea.context.clearRect(0,0,myGameArea.canvas.width,myGameArea.canvas.height)
    for(let i = 0; i < positions.length; i++)
    {
        if(positions[i].whatIsThere == "Wall")
        {
            drawRectangle(positions[i].xCordinate,positions[i].yCordinate,70,70)
        }
        else
        {
            drawImage(positions[i].xCordinate,positions[i].yCordinate)
        }    
    }
    //if (positions != [])
    //    
    //    positions.forEach(element => {
    //        
    //    });
}

const pressedKeys = new Set();
const isKeyDown = (key) => pressedKeys.has(key);
document.addEventListener('keydown',(e)=> pressedKeys.add(e.key))
document.addEventListener('keyup',(e)=> pressedKeys.delete(e.key))

const formSetup = async()=>{
    const formContainer = document.createElement('nav')
    formContainer.id = 'navFormContainer'

    const submitPlayerNameForm = document.createElement('form')
    submitPlayerNameForm.id = 'navForm'

    const handleForm = (event)=>{
        event.preventDefault()

        const children = submitPlayerNameForm.children

        for(const child of children)
        {
            if (child.id === 'navInput')
            {
                if(child.value != undefined)
                {
                    loadPlayer(child.value)
                }
                child.value = ""
            }
        }
        

    }

    submitPlayerNameForm.addEventListener(`submit`,handleForm);

    const playerNameLabel = document.createElement(`label`)
    playerNameLabel.htmlFor = `nameInput`
    playerNameLabel.textContent = `Player Name: `

    const nameInput = document.createElement('input')
    nameInput.type = `text`
    nameInput.id = `navInput`

    const submitButton = document.createElement('input')
    submitButton.type = `submit`
    submitButton.value = `Submit`

    const errorMessage = document.createElement('p')
    errorMessage.id = 'nameError'

    submitPlayerNameForm.appendChild(playerNameLabel)
    submitPlayerNameForm.appendChild(nameInput)
    submitPlayerNameForm.appendChild(submitButton)
    submitPlayerNameForm.appendChild(errorMessage)

    formContainer.appendChild(submitPlayerNameForm)

    document.body.appendChild(formContainer)

}

const updatePhysics = async()=>{
    if(isKeyDown('w') && player.y > 0){
        player.moveUp();
    }
    if(isKeyDown('s') && player.y < myGameArea.canvas.height){
        player.moveDown();
    }
    if(isKeyDown('a') && player.x > 0){
        player.moveLeft();
    }
    if(isKeyDown('d') && player.x < myGameArea.canvas.width){
        player.moveRight();
    }
}


const update =  async() =>{
    requestAnimationFrame(()=>{
        if(FirstConnection)
        {
            setFirstConnection()
        }
        if(dataRecieved && settingUp)
        {
            if(socketData.data != "Invalid")
            {
                const errorMessage = document.getElementById('nameError')
                errorMessage.textContent = "" 
                player.setName(socketData.data)
                setDataRecieved()
                startGame()
                settingUp = false
                
                const form = document.getElementById("navForm")
                const nav = document.getElementById("navFormContainer")
                nav.removeChild(form)

                const playerInfoSection = document.createElement("ul")
                playerInfoSection.id = "navPlayerInfo"

                const playerNameListItem = document.createElement('li')
                playerNameListItem.textContent = `PlayerName: ${player.name}`

                playerInfoSection.appendChild(playerNameListItem)
                nav.appendChild(playerInfoSection)
            }
            else
            {
                const errorMessage = document.getElementById('nameError')
                errorMessage.textContent = "Name already in use"
            }
        }
        if(player.name != null)
        {
            updatePhysics()
            updatePosition()
            if(statsChange)
            {
                gettingPositions = false
                positionsRecieved = false
                looadingPlayerStats = true
                statsChange = false
            }
            if(gettingPositions)
            {
                loadPositions()
                gettingPositions = false
                positionsRecieved = true
            }
            if(loadingPlayerStats)
            {
                loadPlayerStats()
                loadingPlayerStats = false
                gettingPositions = true
                statsRecieved = true
            }    
            if(dataRecieved)
            {
                
                if(positionsRecieved)
                {
                    
                    renderBoard()
                    setDataRecieved()
                    positionsRecieved = false
                    gettingPositions = true
                }
                if(statsRecieved)
                {
                    setDataRecieved()
                    const navPlayerInfo = document.getElementById("navPlayerInfo")
                    
                    const playerHPStat = document.createElement("li")
                    playerHPStat.textContent = `HP: ${socketData.data.HP}`

                    navPlayerInfo.appendChild(playerHPStat)

                    statsRecieved = false
                }
                
            }
            
            
        }
        update();
    })
}
formSetup()
firstConnection()
update()