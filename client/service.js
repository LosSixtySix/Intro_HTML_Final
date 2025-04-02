const url = "http://localhost:5069"

export const loadPositions = async () =>{
    const response = await fetch(url + "/positions")
    const body = await response.json()
    return body;
}
export const loadPlayer = async () =>{
    const response = await fetch(url + "/loadPlayer")
    const body = await response.json()
    return body;
}
export const updatePosition = async(position,whatsThere) =>{
    const newPosition ={
        xCordinate: position[0],
        yCordinate: position[1],
        whatIsThere: whatsThere,
    }
    await fetch(url + "/updatePosition",{
        method: "POST",
        body: JSON.stringify(newPosition),
        headers:{
            'Content-Type': 'application/json'
        }
    })
}
