const articleSetup  = () => {
    const ArticleContainer = document.createElement("article")
    ArticleContainer.id = "HighScoreArticle"

    const TitleHeading = document.createElement("h1")
    TitleHeading.textContent = "High Scores"

    ArticleContainer.appendChild(TitleHeading)

    document.body.appendChild(ArticleContainer)
}

const addPlayers = () =>{
    const urlString = window.location.href

    const paramString = urlString.split(`?`)[1];

    const uglyParams = paramString.split(`&`)

    var params = []

    uglyParams.forEach(element => {
        params.push(element.split(`=`)[0])
        
    });

    const ArticleContainer = document.getElementById("HighScoreArticle")
    params.forEach(element =>{
        const newPlayer = document.createElement("p")
        newPlayer.textContent = `Player: ${element}`

        ArticleContainer.appendChild(newPlayer)
    })

}

articleSetup()
addPlayers()