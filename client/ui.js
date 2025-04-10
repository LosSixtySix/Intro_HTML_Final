import { dataRecieved, FirstConnection,firstConnection, player, setDataRecieved, setFirstConnection, socketData } from "./domain.js";
import {loadPlayer, loadPositions, updatePosition} from "./service.js"
var myGameArea = {
    canvas : document.createElement("canvas"),
    start: function() {
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        document.body.appendChild(this.canvas)
    }
}

var settingUp = true
var gettingPositions = true
var updatingPosition = true

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
const renderCircles = async() => {
    const positions = socketData.data
    if (positions != [])
        myGameArea.context.clearRect(0,0,myGameArea.canvas.width,myGameArea.canvas.height)
        positions.forEach(element => {
            drawCircle(element.xCordinate,element.yCordinate)
        });
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

                const playerNameP = document.createElement('li')
                playerNameP.textContent = `PlayerName: ${player.name}`

                playerInfoSection.appendChild(playerNameP)
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
            console.log(player.name)
            updatePhysics()
            updatePosition()
            if(gettingPositions)
            {
                loadPositions()
                gettingPositions = false
            }
            if(dataRecieved)
            {
                renderCircles()
                setDataRecieved()
                gettingPositions = true
            }
            
        }
        update();
    })
}
formSetup()
firstConnection()
update()