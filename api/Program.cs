using System.Net.WebSockets;
using System.Text;
using System.Text.Json;


var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();
const int mapWidth = 600;
const int mapHeight = 600;

Stack<string> playerNames = new Stack<string>();


Dictionary<string,Player> playerDict = new Dictionary<string,Player>();


List<Position> positions = new();

void buildMap()
{
    int wallGridWidth = mapWidth/10;
    int wallGridHeight = mapHeight/10;
    
    for (int x = 0; x < wallGridWidth; x ++)
    {
        for (int y = 0; y<wallGridHeight; y ++)
        {
            Random rand = new Random();
            int buildWall = rand.Next(10);
            if(buildWall == 1)
            {
                Position newWall = new Position(x*10,y*10,"Wall",null,null,null,null);
                positions.Add(newWall);
            }
        }
    }
}

buildMap();


app.UseWebSockets();
app.Use(async (context,next) =>{
    if (context.WebSockets.IsWebSocketRequest)
    {
        await WebSocketHandler.HandleWebSocket(context,positions,playerNames,playerDict);
    }
    else
    {
        await next(context);
    }
});

app.MapGet("/", () => "Hello World!");

app.Run();


public class Player
{
    public int HP { get; set; }

    public Player()
    {
        HP = 1000;
    }
}

public class WebSocketHandler
{


    public static async Task HandleWebSocket(HttpContext context,List<Position> positions, Stack<string> playerNames,Dictionary<string,Player> playerDict )
    {
        using var socket = await context.WebSockets.AcceptWebSocketAsync();
        string requestRoute = context.Request.Path.ToString();
        string token = context.Request.Query["token"];

        bool connectionAlive = true;
        List<byte> webSocketPayload = new List<byte>(1024 *4);
        byte[] tempMessage = new byte[1024 *4];

        string newPlayerName = "";
        
        object LockingThings = new object();

        async Task sendPositions(List<Position> message)
        {

            var bytes = Encoding.UTF8.GetBytes(JsonSerializer.Serialize(message));
            var ArraySegment = new ArraySegment<byte>(bytes, 0, bytes.Length);

            if (socket.State == WebSocketState.Open)
            {
                await socket.SendAsync(ArraySegment,WebSocketMessageType.Text,true,CancellationToken.None);
            }
        }
        async Task SendPlayerData(Player player)
        {
            var bytes = Encoding.UTF8.GetBytes(JsonSerializer.Serialize(player));
            var ArraySegment = new ArraySegment<byte>(bytes,0,bytes.Length);

            if (socket.State == WebSocketState.Open)
            {
                await socket.SendAsync(ArraySegment,WebSocketMessageType.Text,true,CancellationToken.None);
            }
        }
        async Task addPlayer(string potentialPlayerName)
        {
            var message = "";
            if(playerNames.Count > 0)
            {
                if (playerNames.Contains(potentialPlayerName))
                {
                    message = "Invalid";
                    newPlayerName = "Invalid";
                }
                else
                {
                    playerNames.Push(potentialPlayerName);
                    message = potentialPlayerName;
                    newPlayerName = potentialPlayerName;
                    Player newPlayer = new Player();
                    playerDict.Add(potentialPlayerName,newPlayer);
                }
            }
            else if (playerNames.Count == 0)
            {
                playerNames.Push(potentialPlayerName);
                message = potentialPlayerName;
                newPlayerName = potentialPlayerName;
                Player newPlayer = new Player();
                playerDict.Add(potentialPlayerName,newPlayer);
            }

            var bytes = Encoding.UTF8.GetBytes(JsonSerializer.Serialize(message));
            var ArraySegment = new ArraySegment<byte>(bytes,0,bytes.Length);

            if (socket.State == WebSocketState.Open)
            {
                await socket.SendAsync(ArraySegment,WebSocketMessageType.Text,true,CancellationToken.None);
            }
            
        }

        

        while(connectionAlive)
        {
            webSocketPayload.Clear();

            WebSocketReceiveResult? webSocketResponse;

            do
            {
                webSocketResponse = await socket.ReceiveAsync(tempMessage,CancellationToken.None);

                webSocketPayload.AddRange(new ArraySegment<byte>(tempMessage,0,webSocketResponse.Count));
            }
            while(webSocketResponse.EndOfMessage == false);

            if (webSocketResponse.MessageType == WebSocketMessageType.Text)
            {
                string json = Encoding.UTF8.GetString(webSocketPayload.ToArray());
                
                Request? request = JsonSerializer.Deserialize<Request>(json);

                
                if(request != null)
                {
                    if(request.request == "getPositions")
                    {
                        await sendPositions(positions);
                    }
                    else if(request.request == "sendNewPosition")
                    {
                        if (request.position != null)
                        {
                            lock(LockingThings)
                            {
                                positions.Add(request.position);
                            }
                            
                        }
                    }
                    else if(request.request == "updatePosition")
                    {
                        if (request.position != null)
                        {
                            for(int i = 0; i < positions.Count; i++)
                            {
                                if(positions[i].whatIsThere == request.position.whatIsThere)
                                {
                                    Position newPosition = new Position(request.position.xCordinate,request.position.yCordinate,newPlayerName,request.position.color,playerDict[request.position.whatIsThere].HP,request.position.lengthOfPath,request.position.kills);
                                    lock(LockingThings)
                                    {
                                        positions[i] = newPosition;
                                    }
                                    
                                }
                            }
                        }
                    }
                    else if(request.request == "GetPlayerStats")
                    {
                        if(request.position != null)
                        {
                            if(playerNames.Contains(request.position.whatIsThere))
                            {
                                SendPlayerData(playerDict[request.position.whatIsThere]);
                            }
                            else
                            {
                                SendPlayerData(null);
                            }
                        }
                    }
                    else if(request.request == "TakeDamage")
                    {
                        if(request.position != null)
                        {
                            playerDict[request.position.whatIsThere].HP -=1;
                            Position newPosition = new Position(request.position.xCordinate,request.position.yCordinate,newPlayerName,request.position.color,playerDict[request.position.whatIsThere].HP,request.position.lengthOfPath,request.position.kills);
                            Position removedPosition = null;
                            for(int i = 0; i < positions.Count; i++)
                            {
                                if(positions[i].whatIsThere == newPosition.whatIsThere)
                                {
                                    removedPosition = positions[i];
                                    break;
                                }
                            }
                            if(removedPosition != null)
                            {
                                lock(LockingThings)
                                {
                                    positions.Remove(removedPosition);
                                }
                                
                            }  
                            lock(LockingThings)
                            {
                                positions.Add(newPosition);   
                            }
                                                 

                        }
                    }
                    else if(request.request == "addProjectile")
                    {
                        if(request.position != null)
                        {
                            Position newProjectile = new Position(request.position.xCordinate, request.position.yCordinate, request.position.whatIsThere,request.position.color,null,null,null);
                            lock(LockingThings) 
                            {
                                positions.Add(newProjectile);
                            }
                            
                        }
                    }
                    else
                    {
                        
                        await addPlayer(request.request);
                        if(newPlayerName != "Invalid")
                        {
                            if(request.position != null)
                            {
                                Position newPosition = new Position(request.position.xCordinate,request.position.yCordinate,newPlayerName,request.position.color,playerDict[request.request].HP,request.position.lengthOfPath,request.position.kills);
                                lock(LockingThings)
                                {
                                    positions.Add(newPosition);
                                }
                                
                            }
                        }
                        
                    }
                }
            }
            else if(webSocketResponse.MessageType == WebSocketMessageType.Close)
            {
                connectionAlive = false;
                Console.WriteLine(" -> A client disconnected.");
            }
        }

    }
}
public record Position( long xCordinate, long yCordinate, string whatIsThere,string? color, long? HP,long? lengthOfPath,long? kills);
public record Request(string request, Position position);
public record Message(string type, string message);