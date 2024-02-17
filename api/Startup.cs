using System;
using System.Text;
using api.DAL;
using api.DAL.Code;
using api.DAL.data;
using api.DAL.Implementations;
using api.DAL.Interfaces;
using api.Helpers;
using DatingApp.API.Helpers;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;

namespace api
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }


        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();
            /*  services.AddDbContext<dataContext>(x => x.UseSqlServer(Configuration.GetConnectionString("SQLconnection"))
             //.EnableSensitiveDataLogging()
             ); */

            var _connectionString = Configuration.GetConnectionString("SQLConnection");
            services.Configure<ComSettings>(Configuration.GetSection("ComSettings"));
            services.AddDbContext<dataContext>(
                options => options.UseMySql(
                    _connectionString,
                    ServerVersion.AutoDetect(_connectionString)
                )
            );

            /* services.AddDbContext<dataContext>(options => options
                .UseMySql(Configuration.GetConnectionString("SQLConnection"),
                    mysqlOptions =>
                        mysqlOptions.ServerVersion(
                            new Pomelo.EntityFrameworkCore.MySql.Storage.ServerVersion(new Version(10, 4, 6),
                            ServerType.MariaDb)).EnableRetryOnFailure())); */



            services.AddHttpContextAccessor();
            services.AddCors();
            services.Configure<CloudinarySettings>(Configuration.GetSection("CloudinarySettings"));




            services.AddTransient<SpecialMaps>();
            services.AddTransient<Seed>();
            services.AddTransient<LogUserActivity>();

            services.AddScoped<IAuthRepository, AuthRepository>();
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IMessageRepository, MessageRepository>();
            services.AddScoped<IHospital, Hospital>();
            services.AddScoped<IValve, Valve>();
            services.AddScoped<IVendor, Vendor>();
            services.AddScoped<IGenerator, Generator>();

            services.AddControllers().AddNewtonsoftJson(options =>
            options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
            );

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII
                        .GetBytes(Configuration.GetSection("AppSettings:Token").Value)),
                        ValidateIssuer = false,
                        ValidateAudience = false
                    };
                });



        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, Seed seeder)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
               
            }

            //app.UseHttpsRedirection();

            app.UseRouting();

            app.UseCors(x => x.AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials()
            .WithOrigins("http://localhost:4200"));
            app.UseAuthentication();
            app.UseAuthorization();

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseDefaultFiles();
            app.UseStaticFiles();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapFallbackToController("Index", "Fallback");
            });
        }
    }
}
