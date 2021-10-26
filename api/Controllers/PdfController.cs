using System;
using System.IO;
using System.Threading.Tasks;
using api.DAL.Interfaces;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{

    [ApiController]
    //[Route("[controller]")]
    public class PdfController : ControllerBase
    {
        private IGenerator _gen;
        private readonly IWebHostEnvironment _env;

        public PdfController(IGenerator gen, IWebHostEnvironment env)
        {
            _gen = gen;
            _env = env;
        }

        [HttpGet("api/getPDF/{id}")]
        [Produces("application/pdf")]
        public IActionResult Get(int id)
        {
           var pathToFile = _env.ContentRootPath + "/DAL/pdf/";
           var location = pathToFile + "sample.html";
           switch (id)
            {
                case 1: location = pathToFile + "sample.html";break;
                case 2: location = pathToFile + "sample2.html";break;
                case 3: location = pathToFile + "sample3.html";break;
            }
           

           var help =  _gen.generatePDF(location);

            var pathToPDFFile = _env.ContentRootPath + "/DAL/pdf/";
            var file_name = pathToPDFFile + "Sample.pdf";
            try
            {
                var stream = new FileStream(file_name, FileMode.Open, FileAccess.Read);
                stream.Position = 0;
                FileStreamResult filestream = new FileStreamResult(stream, "application/pdf");
                return filestream;
            }
            catch (Exception ex) { return BadRequest(ex.InnerException); }
        }
    }
}