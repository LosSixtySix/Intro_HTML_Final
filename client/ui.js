import { CurrentPositions, dataRecieved, FirstConnection,firstConnection, player, setDataRecieved, setFirstConnection, socketData } from "./domain.js";
import {addProjectile, loadPlayer, loadPlayerStats, loadPositions, updatePosition} from "./service.js"

const pressedKeys = new Set();
const isKeyDown = (key) => pressedKeys.has(key);

var myGameArea = {
    canvas : document.createElement("canvas"),
    start: function() {
        this.canvas.width = 600;
        this.canvas.height = 600;
        this.context = this.canvas.getContext("2d");

        this.canvas.onmousedown = (event) =>{
            if (event.button === 0)
            {
                pressedKeys.add('m1')
            }
        }
        this.canvas.onmouseup = (event)=>{
            if (event.button === 0)
            {
                pressedKeys.delete('m1')
            }
        }

        document.body.appendChild(this.canvas)
    }
}

var settingUp = true
var gettingPositions = true
var positionsRecieved = false
var firstStepFinsished = false
var printPositions = false
var writeDeadMessage = true
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
const drawFilledCircle = (x,y)=>{
    myGameArea.context.beginPath();
    myGameArea.context.arc(x,y,5,0,2*Math.PI);
    myGameArea.context.fill();
    myGameArea.context.stroke();
}
const drawImage = (x,y) =>{
    const img = document.createElement("img")
    img.src = "/images/Bishop.png"

    myGameArea.context.drawImage(img,x,y,5,5)
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
            drawFilledCircle(positions[i].xCordinate,positions[i].yCordinate,10,10)
        }
        else if(positions[i].whatIsThere == "projectile")
        {
            myGameArea.context.fillStyle = positions[i].color
            drawRectangle(positions[i].xCordinate,positions[i].yCordinate,5,5)
            myGameArea.context.fillStyle = 'black'
        }
        else if(positions[i].whatIsThere == player.name)
        {
            myGameArea.context.strokeStyle = player.color
            drawFilledCircle(positions[i].xCordinate,positions[i].yCordinate)

            myGameArea.context.fillStyle = 'red'
            drawRectangle(player.x- 2.5, player.y - 8,5,2)

            myGameArea.context.fillStyle = 'black'
            myGameArea.context.strokeStyle = 'black'
        }
        else
        {
            myGameArea.context.strokeStyle = positions[i].color
            drawFilledCircle(positions[i].xCordinate,positions[i].yCordinate)
            myGameArea.context.strokeStyle = 'black'
        }    
    }
    //if (positions != [])
    //    
    //    positions.forEach(element => {
    //        
    //    });
}


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
    submitButton.classList.add("submitButton")
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
    if(player.HP > 0)
    {
        if(isKeyDown('w') && player.y > 0){
            player.moveUp();
            if(isKeyDown('m1'))
                {
                    const newProjectile = {
                        x: player.x,
                        y: player.y + 1,
                    }
                    addProjectile(newProjectile)
                    player.lengthOfPath += 1
                }
        }
        if(isKeyDown('s') && player.y < myGameArea.canvas.height){
            player.moveDown();
            if(isKeyDown('m1'))
                {
                    const newProjectile = {
                        x: player.x,
                        y: player.y -1,
                    }
                    addProjectile(newProjectile)
                    player.lengthOfPath += 1
                }
        }
        if(isKeyDown('a') && player.x > 0){
            player.moveLeft();
            if(isKeyDown('m1'))
                {
                    const newProjectile = {
                        x: player.x +1,
                        y: player.y,
                    }
                    addProjectile(newProjectile)
                    player.lengthOfPath += 1
                }
        }
        if(isKeyDown('d') && player.x < myGameArea.canvas.width){
            player.moveRight();
            if(isKeyDown('m1'))
            {
                const newProjectile = {
                    x: player.x -1,
                    y: player.y,
                }
                addProjectile(newProjectile)
                player.lengthOfPath += 1
            }
        }
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
            if(socketData.data != "Invalid" && firstStepFinsished === false)
            {
                const errorMessage = document.getElementById('nameError')
                errorMessage.textContent = "" 
                player.setName(socketData.data)
                setDataRecieved()
                startGame()
                
                const form = document.getElementById("navForm")
                const nav = document.getElementById("navFormContainer")
                nav.removeChild(form)

                const playerInfoSection = document.createElement("ul")
                playerInfoSection.id = "navPlayerInfo"

                const playerNameListItem = document.createElement('li')
                playerNameListItem.textContent = `PlayerName: ${player.name}`

                playerInfoSection.appendChild(playerNameListItem)

                const highScorePageLink = document.createElement('a')

                const addQueryString = (event)=>{
                    if(CurrentPositions.positions != null)
                    {
                        const params = new URLSearchParams();
                        CurrentPositions.positions.forEach(element => {
                            if(element.whatIsThere != "Wall" && element.whatIsThere != "projectile")
                            {
                                params.append(element.whatIsThere,element.lengthOfPath)
                                params.append(element.whatIsThere,element.kills)
                            }
                        });
                        const queryString = params.toString()
                        highScorePageLink.href = `/highScore.html?${queryString}`
                    }
                    else
                    {
                        highScorePageLink.href = `/highScore.html`
                    }
                }

                highScorePageLink.textContent = "High Scores"
                highScorePageLink.addEventListener('click',addQueryString)

                
                nav.appendChild(playerInfoSection)
                nav.appendChild(highScorePageLink)
                firstStepFinsished = true
                loadPositions()  
            }
            else if (socketData.data === "Invalid" )
            {
                const errorMessage = document.getElementById('nameError')
                errorMessage.textContent = "Name already in use"
            }
            if(dataRecieved && firstStepFinsished)
                {
                    var notFound = true
                    while(notFound)
                    {
                        const testX = Math.floor(Math.random() * 600)
                        const testY = Math.floor(Math.random() * 600)
                        const positions = socketData.data
                        CurrentPositions.setPosition(positions)

                        for(let i = 0; i < positions.length; i++) {
                            const element = positions[i]
                            if(testX != element.xCordinate && testY != element.yCordinate)
                            {
                                player.start(testX,testY)
                                notFound = false
                                break;
                            }
                        };
                    }
                }
                if(player.x != undefined)
                {
                    console.log("setting up done...")
                    setDataRecieved()
                    settingUp = false
                    printPositions = true
                }
        }
        if(player.name != null && settingUp === false)
        {
            updatePhysics()
            updatePosition()
            if(gettingPositions)
            {
                loadPositions()
                gettingPositions = false
                positionsRecieved = true
            } 
            if(dataRecieved)
            {
                if(positionsRecieved)
                {
                    
                    renderBoard()
                    setDataRecieved()
                    positionsRecieved = false
                    gettingPositions = true

                    const playerInfoSection = document.getElementById("navPlayerInfo")

                    if (CurrentPositions.positions)
                    {
                        CurrentPositions.positions.forEach(element => {
                            if(element.whatIsThere === player.name)
                            {
                                const playerHPPrevious = document.getElementById("PlayerHP")
                                if(playerHPPrevious)
                                {
                                    playerInfoSection.removeChild(playerHPPrevious)
                                }

                                const PlayerHP = document.createElement('li')
                                PlayerHP.id = "PlayerHP"
                                PlayerHP.textContent = `HP: ${element.HP}`

                                playerInfoSection.appendChild(PlayerHP)

                                player.HP = element.HP
                           }
                        });
                        if(player.HP <= 0)
                        {
                            const PlayerDeadMessagePrevious = document.getElementById("DeadMessage")
                            if(PlayerDeadMessagePrevious)
                            {
                                playerInfoSection.removeChild(PlayerDeadMessagePrevious)
                            }

                            const PlayerDeadMessage = document.createElement("p")
                            PlayerDeadMessage.id = "DeadMessage"
                            PlayerDeadMessage.textContent = "You have Died!"

                            playerInfoSection.appendChild(PlayerDeadMessage)
                            writeDeadMessage = false

                        }
                    }
                }
                
            }
        }
        update();
    })
}
formSetup()
firstConnection()
update()