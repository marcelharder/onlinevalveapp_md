using System;
using Microsoft.AspNetCore.Http;

namespace api.DAL.dtos
{
    public class PhotoForCreationDto
    {
       public string Url { get; set; } 
       public IFormFile File { get; set; }
       public string Description { get; set; }
       public DateTime DateAdded { get; set; }

       public string PublicId { get; set; }
       public int ValveId { get; set; }

       public PhotoForCreationDto()
       {
           DateAdded = DateTime.Now;
       }
    }
}