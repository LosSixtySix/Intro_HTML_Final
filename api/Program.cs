using System.Net.WebSockets;
using System.Text;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

Stack<string> players = new Stack<string>();

players.Push("Player2");
players.Push("Player1");




List<Position> positions = new();


app.UseWebSockets();
app.Use(async (context,next) =>{
    if (context.WebSockets.IsWebSocketRequest)
    {
        await WebSocketHandler.HandleWebSocket(context,positions,players);
    }
    else
    {
        await next(context);
    }
});

app.MapGet("/", () => "Hello World!");

app.Run();


public class WebSocketHandler
{

    public static async Task HandleWebSocket(HttpContext context,List<Position> positions, Stack<string> players )
    {
        using var socket = await context.WebSockets.AcceptWebSocketAsync();
        string requestRoute = context.Request.Path.ToString();
        string token = context.Request.Query["token"];

        bool connectionAlive = true;
        List<byte> webSocketPayload = new List<byte>(1024 *4);
        byte[] tempMessage = new byte[1024 *4];

        string newPlayerName = "";
        


        async Task sendPositions(List<Position> message)
        {
            Console.WriteLine("Sending message to client....");

            var bytes = Encoding.UTF8.GetBytes(JsonSerializer.Serialize(message));
            var ArraySegment = new ArraySegment<byte>(bytes, 0, bytes.Length);

            if (socket.State == WebSocketState.Open)
            {
                await socket.SendAsync(ArraySegment,WebSocketMessageType.Text,true,CancellationToken.None);
            }
        }
        async Task addPlayer()
        {
            var message = "";
            if(players.Count > 0)
            {
                message = players.Pop();
            }
            else if (players.Count == 0)
            {
                message = "Player1";
            }

            var bytes = Encoding.UTF8.GetBytes(JsonSerializer.Serialize(message));
            var ArraySegment = new ArraySegment<byte>(bytes,0,bytes.Length);

            if (socket.State == WebSocketState.Open)
            {
                await socket.SendAsync(ArraySegment,WebSocketMessageType.Text,true,CancellationToken.None);
            }
            newPlayerName = message;
            Console.WriteLine(newPlayerName);
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
                            positions.Add(request.position);
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
                                    positions[i] = request.position;
                                }
                            }
                        }
                    }
                    else if(request.request == "firstConnection")
                    {
                        
                        await addPlayer();
                        if(request.position != null)
                        {
                            Position newPosition = new Position(request.position.xCordinate,request.position.yCordinate,newPlayerName);
                            positions.Add(newPosition);
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
public record Position( long xCordinate, long yCordinate, string whatIsThere);
public record Request(string request, Position position);
public record Message(string type, string message);