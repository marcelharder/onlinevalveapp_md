using System.IO;
using System.Threading.Tasks;
using api.DAL.Interfaces;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using SelectPdf;

namespace api.DAL.Implementations
{
    public class Generator : IGenerator
    {

        readonly IWebHostEnvironment _env;
        public Generator(IWebHostEnvironment env)
        {
            _env = env;
        }
        public Task<int> DeleteAsync<T>(T entity) where T : class
        {
            throw new System.NotImplementedException();
        }

        public string generatePDF(string location)
        {
            var pathToFile = _env.ContentRootPath + "/DAL/pdf/";
           
            var url = pathToFile + "sample.html";


            //var url = "../../DAL/pdf/sample.html";
            HtmlToPdf conv = new HtmlToPdf();
            conv.Options.PdfPageOrientation = PdfPageOrientation.Portrait;
            PdfDocument doc = conv.ConvertUrl(location);

            doc.Save(pathToFile + "Sample.pdf");

            doc.Close();

           return "gelukt";
        }

        public Task<bool> SaveAll()
        {
            throw new System.NotImplementedException();
        }

        
        



    }
}