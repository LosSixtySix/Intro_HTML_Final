using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors();

var app = builder.Build();
app.UseCors(x => x.AllowAnyHeader().AllowAnyOrigin().AllowAnyMethod());

Stack<Stack<string>> players = new Stack<Stack<string>>();
Stack<string> player1 = new Stack<string>();
Stack<string> player2 = new Stack<string>();
player1.Push("Player1");
player2.Push("Player2");

players.Push(player2);
players.Push(player1);

string fileName = "positions.json";
List<Position> positions = new();
//if(File.Exists(fileName))
//{
//    var json = File.ReadAllText(fileName);
//    positions.AddRange(JsonSerializer.Deserialize<List<Position>>(json));
//}

app.MapGet("/", () => "Hello World!");


app.MapGet("/positions",()=> positions);
app.MapGet("/loadPlayer",()=> {
    if (players.Count() > 0)
    {
        return players.Pop();
    }
    else
    {
        return null;
    }
});


app.MapPost("/updatePosition",(Position position) =>{
    for(int index = 0; index < positions.Count(); index ++){
        if(positions[index].whatIsThere == position.whatIsThere){
            positions[index] = position;
            //var updateJson = JsonSerializer.Serialize(positions);
            //File.WriteAllText(fileName,updateJson);
            return;
        }
    }
    positions.Add(position);
    //var json = JsonSerializer.Serialize(positions);
    //File.WriteAllText(fileName,json);
});

app.Run();

public record Position(long xCordinate, long yCordinate, string whatIsThere);