using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors();

var app = builder.Build();
app.UseCors(x => x.AllowAnyHeader().AllowAnyOrigin().AllowAnyMethod());

string fileName = "positions.json";
List<Position> positions = new();
if(File.Exists(fileName))
{
    var json = File.ReadAllText(fileName);
    positions.AddRange(JsonSerializer.Deserialize<List<Position>>(json));
}

app.MapGet("/", () => "Hello World!");


app.MapGet("/positions",()=> positions);

app.MapPost("/updatePosition",(Position position) =>{
    for(int index = 0; index < positions.Count(); index ++){
        if(positions[index].whatIsThere == position.whatIsThere){
            positions[index] = position;
            var updateJson = JsonSerializer.Serialize(positions);
            File.WriteAllText(fileName,updateJson);
            return;
        }
    }
    positions.Add(position);
    var json = JsonSerializer.Serialize(positions);
    File.WriteAllText(fileName,json);
});

app.Run();

public record Position(long xCordinate, long yCordinate, string whatIsThere);