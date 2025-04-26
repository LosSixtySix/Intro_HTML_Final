const articleSetup  = () => {
    const ArticleContainer = document.createElement("article")
    ArticleContainer.id = "HighScoreArticle"

    const TitleHeading = document.createElement("h1")
    TitleHeading.textContent = "High Scores"

    const playerContainer = document.createElement(`div`)
    playerContainer.id = "PlayerContainer"

    ArticleContainer.appendChild(TitleHeading)
    ArticleContainer.appendChild(playerContainer)
    document.body.appendChild(ArticleContainer)
}

const addToSortedDictionary = (sortedDictionary, key,newValue) =>{
    const tempDict = {}

    var keys =Object.keys(sortedDictionary)

    const lengthOfPath = Number(newValue[0] *-1)
    const kills = Number(newValue[1])

    const score = kills + lengthOfPath
    var newValueAdded = false
    newValue.push(score)
    if(keys.length == 0)
    {
        tempDict[key] = newValue
    }
    else
    {
        keys.forEach(key1 =>{
            if(sortedDictionary[key1][2] <= score && !newValueAdded)
            {
                tempDict[key1] = (sortedDictionary[key1])
                
            }
            else if(!newValueAdded)
            {
                tempDict[key] = newValue
                newValueAdded = true
            }
            if(newValueAdded)
            {
                tempDict[key1] = (sortedDictionary[key1])
            }
        })
        if(!newValueAdded)
        {
            tempDict[key] = newValue
        }
    }


    return tempDict
}

const Filter = (filterValue,keyPress) =>{
    if (keyPress.length  === 1)
    {
        addPlayers(filterValue+keyPress)
    }
    else
    {
        const newFilterValue = filterValue.slice(0,-1)
        addPlayers(newFilterValue)
    }
}
const formSetup = () =>{
    const navContainer = document.createElement('nav')
    navContainer.id = `navFormContainerHighScore`

    const filterLabel = document.createElement('label')
    filterLabel.htmlFor = 'filter'
    filterLabel.textContent = 'Filter By Player: '

    const filter = document.createElement('input')
    filter.type = 'text'
    filter.id = 'filter'

    const handleFilter = (event) =>{
        Filter(filter.value,event.key)
    }

    filter.addEventListener('keydown',handleFilter)

    navContainer.appendChild(filterLabel)
    navContainer.appendChild(filter)

    document.body.appendChild(navContainer)
}

const addPlayers = (filterValue) =>{
    const urlString = window.location.href

    const paramString = urlString.split(`?`)[1];

    const uglyParams = paramString.split(`&`)


    var tempParams = {}

    if (!filterValue )
    {
        var currentPlayer = null
        uglyParams.forEach(element => {
            const param = element.split(`=`)
            if(param[0] != currentPlayer)
            {
                currentPlayer = param[0]
                tempParams[param[0]] = [param[1]]
            }
            else
            {
                tempParams[param[0]].push(param[1])
            }
            
        });
    }
    else
    {
        var currentPlayer = null
        uglyParams.forEach(element => {
            const param = element.split(`=`)
            
            if(param[0].includes(filterValue))
            {
                if(param[0] != currentPlayer)
                    {
                        currentPlayer = param[0]
                        tempParams[param[0]] = [param[1]]
                    }
                    else
                    {
                        tempParams[param[0]].push(param[1]) 
                    }
            }
        })
    }
    
    var tempParams2 = {}

    const keys1 = Object.keys(tempParams)

    keys1.forEach(element =>{
        tempParams2 = addToSortedDictionary(tempParams2,element,tempParams[element])
    })


    const params = tempParams2
 





    const articleContainer = document.getElementById("HighScoreArticle")

    const children = articleContainer.children
    for(const child of children)
    {
        if (child.textContent != "High Scores")
        {
            articleContainer.removeChild(child)
        }
    }
    const playerContainer = document.createElement(`div`)
    playerContainer.id = "PlayerContainer"

    const keys = Object.keys(params)

    while(keys.length > 0){

        const element = keys.pop()

        const newPlayerKills = document.createElement('p')
        newPlayerKills.textContent = `Kills: ${params[element][1]}`


        const internalplayerContainer = document.createElement('div')
        internalplayerContainer.classList.add("ScorePlayerContainer")


        const newPlayer = document.createElement("p")
        newPlayer.textContent = `Player: ${element}`

        const newPlayerPathLength = document.createElement("p")
        newPlayerPathLength.textContent = `Path Length: ${params[element][0]}`

        const newPlayerScore = document.createElement("p")
        newPlayerScore.textContent = `Score: ${params[element][2]}`

        internalplayerContainer.appendChild(newPlayer)
        internalplayerContainer.appendChild(newPlayerPathLength)
        internalplayerContainer.appendChild(newPlayerKills)
        internalplayerContainer.appendChild(newPlayerScore)

        playerContainer.appendChild(internalplayerContainer)

    }

    articleContainer.appendChild(playerContainer)

}
formSetup()
articleSetup()
addPlayers(null)

