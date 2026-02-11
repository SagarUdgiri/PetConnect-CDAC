using Microsoft.EntityFrameworkCore;
using PetConnectAlmost.DAO;
using PetConnectAlmost.Data;
using PetConnectAlmost.Repositories;
using PetConnectAlmost.Services;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

// Clear default claim mapping to prevent mapping issues (like sub -> NameIdentifier)
JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddAuthorization();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options => {
    options.AddPolicy("AllowReactApp",
        policy => policy.AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader());
});
builder.Services.AddDbContext<ApplicationDbContext>(options => {
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        new MySqlServerVersion(new Version(8,0,34))
        );
});

// Configure JWT Authentication
var jwtKey = builder.Configuration["Jwt:Key"] ?? "DefaultSecretKeyForDevelopmentOnly1234567890";
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "PetconnectAPI";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "PetconnectClient";

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtIssuer,
        ValidAudience = jwtAudience,
        IssuerSigningKey = new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(jwtKey)),
        NameClaimType = "sub",
        RoleClaimType = "role"
    };
});
builder.Services.AddScoped<OtpService>();
builder.Services.AddScoped<EmailService>();
builder.Services.AddScoped<JwtService>();
builder.Services.AddScoped<IAuthDao, AuthDao>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IPetRepository, PetRepository>();
builder.Services.AddScoped<IPetService, PetService>();
builder.Services.AddScoped<IPostDao, PostDao>();
builder.Services.AddScoped<IPostService, PostService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<INotificationDao, NotificationDao>();
builder.Services.AddScoped<INotificationService, NotificationService>();
builder.Services.AddScoped<IFollowDao, FollowDao>();
builder.Services.AddScoped<IFollowService, FollowService>();

builder.Services.AddScoped<ICategoryDao, CategoryDao>();
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<IProductDao, ProductDao>();
builder.Services.AddScoped<IProductService, ProductService>();

builder.Services.AddScoped<ICartDao, CartDao>();
builder.Services.AddScoped<ICartService, CartService>();

builder.Services.AddScoped<IOrderDao, OrderDao>();
builder.Services.AddScoped<IOrderService, OrderService>();

builder.Services.AddScoped<IMissingPetService, MissingPetService>();
builder.Services.AddScoped<IAIService, AIService>();
builder.Services.AddHttpClient();


var app = builder.Build();

app.Use(async (context, next) =>
{
    if (context.Request.Method != "OPTIONS")
    {
        Console.WriteLine($"Incoming Request: {context.Request.Method} {context.Request.Path}");
    }
    await next();
});

app.UseCors("AllowReactApp");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
// app.UseCors("AllowReactApp"); // Moved to top

app.UseAuthentication();

app.Use(async (context, next) =>
{
    if (context.User.Identity?.IsAuthenticated == true)
    {
        var roles = context.User.Claims.Where(c => c.Type == "role" || c.Type == ClaimTypes.Role).Select(c => c.Value).ToList();
        Console.WriteLine($"[AUTH-DEBUG] Path: {context.Request.Path}, Roles: [{string.Join(", ", roles)}]");
    }
    await next();
});

app.UseAuthorization();

app.MapControllers();

app.Run();
