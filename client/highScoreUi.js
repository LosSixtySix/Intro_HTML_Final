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

    var params = {}

    if (!filterValue )
    {
        var currentPlayer = null
        uglyParams.forEach(element => {
            const param = element.split(`=`)
            if(param[0] != currentPlayer)
            {
                currentPlayer = param[0]
                params[param[0]] = param[1]
            }
            else
            {
                params[param[0]+" k"] = param[1]
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
                        params[param[0]] = param[1]
                    }
                    else
                    {
                        params[param[0]+" k"] = param[1]
                    }
            }
        })
    }
    

    
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
    var currentPlayer = null
    var currentInternalPlayerContainer = null
    keys.forEach(element =>{
        if(element == currentPlayer + " k")
        {
            const newPlayerKills = document.createElement('p')
            newPlayerKills.textContent = `Kills: ${params[element]}`

            currentInternalPlayerContainer.appendChild(newPlayerKills)
        }
        else if(element != currentPlayer)
        {
            currentPlayer = element
            const internalplayerContainer = document.createElement('div')
            internalplayerContainer.classList.add("ScorePlayerContainer")

            currentInternalPlayerContainer = internalplayerContainer

            const newPlayer = document.createElement("p")
            newPlayer.textContent = `Player: ${element}`

            const newPlayerPathLength = document.createElement("p")
            newPlayerPathLength.textContent = `Path Length: ${params[element]}`

            internalplayerContainer.appendChild(newPlayer)
            internalplayerContainer.appendChild(newPlayerPathLength)

            playerContainer.appendChild(internalplayerContainer)
        }

    })

    articleContainer.appendChild(playerContainer)

}
formSetup()
articleSetup()
addPlayers(null)

