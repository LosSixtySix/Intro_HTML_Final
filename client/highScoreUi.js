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

    var params = []

    if (!filterValue )
    {
        uglyParams.forEach(element => {
            params.push(element.split(`=`)[0])
        });
    }
    else
    {
        uglyParams.forEach(element => {
            const param = element.split(`=`)[0]
            
            if(param.includes(filterValue))
            {
                params.push(param)
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

    params.forEach(element =>{
        const newPlayer = document.createElement("p")
        newPlayer.textContent = `Player: ${element}`

        playerContainer.appendChild(newPlayer)
    })

    articleContainer.appendChild(playerContainer)

}
formSetup()
articleSetup()
addPlayers(null)

