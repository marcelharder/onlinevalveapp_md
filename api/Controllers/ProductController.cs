using System;
using System.Collections.Generic;
using System.IO.Pipes;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text;
using System.Threading.Tasks;
using api.DAL.Code;
using api.DAL.dtos;
using api.DAL.models;
using api.Helpers;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;

namespace api.Controllers
{

    [ApiController]
    [Authorize]
    public class ProductController : ControllerBase
    {


        private SpecialMaps _special;
        private Cloudinary _cloudinary;

        private readonly IOptions<ComSettings> _com;
        private readonly IOptions<CloudinarySettings> _cloudinaryConfig;
        public ProductController(SpecialMaps special, IOptions<CloudinarySettings> cloudinaryConfig, IOptions<ComSettings> com)
        {
            _special = special;
            _cloudinaryConfig = cloudinaryConfig;
            _com = com;

            Account acc = new Account(
               _cloudinaryConfig.Value.CloudName,
               _cloudinaryConfig.Value.ApiKey,
               _cloudinaryConfig.Value.ApiSecret
           );
            _cloudinary = new Cloudinary(acc);
        }

        [HttpGet("api/addProduct")]
        public async Task<IActionResult> addProduct(int id)
        {
            var currentVendor = await _special.getCurrentVendorAsync();
            var help = new Valve_Code();
            help.Vendor_code = currentVendor.ToString();
            help.Valve_size = null;
            help.Countries = "NL,US,SA";
            help.Type = "0";
            help.Image = "https://res.cloudinary.com/marcelcloud/image/upload/v1620571880/valves/valves02.jpg";


            var comaddress = _com.Value.productURL;
            var st = "ValveCode";
            comaddress = comaddress + st;
            var json = JsonConvert.SerializeObject(help, Formatting.None);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.PostAsync(comaddress, content))
                {
                   var s = await response.Content.ReadAsStringAsync();
                   return Ok(s);// this gives a new Valve_Code with ValveTypeId
                }
            }
            
        }

        [HttpDelete("api/deleteProduct/{id}")]
        public async Task<IActionResult> deleteProductdetails(int id)
        {
            var help = "";
            var comaddress = _com.Value.productURL;
            var st = "ValveCode/" + id;
            comaddress = comaddress + st;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.DeleteAsync(comaddress))
                {
                    help = await response.Content.ReadAsStringAsync();
                }
            }
            return Ok(help);
        }

        [HttpPost("api/saveProductDetails")]
        public async Task<IActionResult> postProductdetails(Valve_Code code)
        {
            code.Valve_size = null;
            var help = "";
            var comaddress = _com.Value.productURL;
            var st = "ValveCode";
            comaddress = comaddress + st;
            var json = JsonConvert.SerializeObject(code, Formatting.None);
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.PutAsync(comaddress, content))
                {
                    help = await response.Content.ReadAsStringAsync();
                }
            }
            return Ok(help);
        }

        [HttpGet("api/productByNo/{id}", Name = "getProduct")]
        public async Task<IActionResult> get04(int id)
        {
            var help = new Valve_Code();
            var comaddress = _com.Value.productURL;
            var st = "ValveCode/" + id;
            comaddress = comaddress + st;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(comaddress))
                {
                    var g = await response.Content.ReadAsStringAsync();
                    help = (Valve_Code)JsonConvert.DeserializeObject(g);
                }
            }
            // var result = await _vc.getDetails(id);
            return Ok(help);
        }

        [HttpGet("api/productByCode/{code}")]
        public async Task<IActionResult> get041(string code)
        {
            var help = new Valve_Code();
            var comaddress = _com.Value.productURL;
            var st = "ValveCode/detailsByProductCode/" + code;
            comaddress = comaddress + st;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(comaddress))
                {
                    var g = await response.Content.ReadAsStringAsync();
                    //help = (Valve_Code)JsonConvert.DeserializeObject(g);
                    return Ok(g);
                }
            }

            //var result = await _vc.getDetailsByProductCode(code);
            //return Ok(result);
        }

        [Route("api/addProductPhoto/{id}")]
        [HttpPost]
        public async Task<IActionResult> AddPhotoForProduct(int id, [FromForm] PhotoForCreationDto photoDto)
        {
            var content = new MultipartFormDataContent();
            content.Add(new StreamContent(photoDto.File.OpenReadStream()), photoDto.File.Name, photoDto.File.FileName);
            content.Headers.ContentDisposition = new ContentDispositionHeaderValue("form-data") { Name = photoDto.File.Name, FileName = photoDto.File.FileName };

            var help = new photoResult();
            var comaddress = _com.Value.productURL;
            var st = "ValveCode/addPhoto/" + id;
            comaddress = comaddress + st;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.PostAsync(comaddress, content))
                {
                    //help = await response.Content.ReadFromJsonAsync<photoResult>();
                    var res = await response.Content.ReadAsStringAsync();
                    return Ok(res);
                }
            }
            
        }

        [Route("api/addSize/{id}")]
        [HttpPost]
        public async Task<IActionResult> addSize(int id, [FromBody] Valve_Size vs)
        {
            vs.VTValveTypeId = id;
           
            var res = "";
            var comaddress = _com.Value.productURL;
            var st = "ValveSize";
            comaddress = comaddress + st;
            var json = JsonConvert.SerializeObject(vs, Formatting.None);
            var payload = new StringContent(json, Encoding.UTF8, "application/json");

            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.PostAsync(comaddress, payload))
                {
                    res = await response.Content.ReadAsStringAsync();
                }
            }
            return Ok(res);
        }

        [Route("api/getSize/{id}", Name = "getSize")]
        [HttpGet]
        public async Task<Valve_Size> getSize(int id)
        {
            var help = new Valve_Size();
            var comaddress = _com.Value.productURL;
            var st = "ValveSize/getValveSize/" + id;
            comaddress = comaddress + st;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(comaddress))
                {
                    var g = await response.Content.ReadAsStringAsync();
                    help = (Valve_Size)JsonConvert.DeserializeObject(g);
                }
            }
            return help;
        }

        [Route("api/deleteSize/{id}")]
        [HttpDelete]
        public async Task<IActionResult> deleteSize(int id)
        {
            var help = "";
            var comaddress = _com.Value.productURL;
            var st = "ValveSize/" + id;
            comaddress = comaddress + st;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.DeleteAsync(comaddress))
                {
                    help = await response.Content.ReadAsStringAsync();
                }
            }
            return Ok(help);
        }


        #region <!-- used by soa -->

        [AllowAnonymous]
        [HttpGet("api/productByValveTypeId/{id}")]
        public async Task<IActionResult> get042(int id)
        {
            var help = "";
            var comaddress = _com.Value.productURL;
            var st = "ValveCode/detailsByValveId/" + id;
            comaddress = comaddress + st;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(comaddress))
                {
                    help = await response.Content.ReadAsStringAsync();
                }
            }
            return Ok(help);
        }

        [AllowAnonymous]
        [Route("api/products")]
        [HttpGet]
        public async Task<IActionResult> getAllProducts()
        {
            var help = new List<Valve_Code>();
            var comaddress = _com.Value.productURL;
            var st = "ValveCode/products";
            comaddress = comaddress + st;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(comaddress))
                {
                    var g = await response.Content.ReadAsStringAsync();
                    return Ok(g);
                    /*  var t = g.Split(',');
                     foreach (string s in t)
                     {
                         help.Add((Valve_Code)JsonConvert.DeserializeObject(s));
                     } */
                }
            }

            //  var result = await _vc.getAllProducts();
            //  return Ok(result);
        }

        [AllowAnonymous]
        [Route("api/products/{type}/{position}")]
        [HttpGet]
        public async Task<IActionResult> getAllProducts(string type, string position)
        {
            var help = new List<Valve_Code>();
            var comaddress = _com.Value.productURL;
            var st = "ValveCode/getAllValveCodesByTypeAndPosition/" + type + "/" + position;
            comaddress = comaddress + st;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(comaddress))
                {
                    var g = await response.Content.ReadAsStringAsync();
                    var t = g.Split(',');
                    foreach (string s in t)
                    {
                        help.Add((Valve_Code)JsonConvert.DeserializeObject(s));
                    }
                }
            }
            return Ok(help);


            //  var result = await _vc.getAllTPProducts(type, position);
            //  return Ok(result);
        }

        [AllowAnonymous]
        [Route("api/productsByVTP/{vendor}/{type}/{position}")]
        [HttpGet]
        public async Task<IActionResult> getAllProducts(string vendor, string type, string position)
        {
            var help = new List<Valve_Code>();
            var comaddress = _com.Value.productURL;
            var st = "Vendor/valveCodesPerVTP/" + vendor + "/" + type + "/" + position;
            comaddress = comaddress + st;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(comaddress))
                {
                    var g = await response.Content.ReadAsStringAsync();
                    /* var t = g.Split(',');
                    foreach (string s in t)
                    {
                        help.Add((Valve_Code)JsonConvert.DeserializeObject(s));
                    } */
                    return Ok(g);
                }
            }


            //var result = await _vc.getAllProductsByVTP(vendor, type, position);
            //return Ok(result);
        }

        [AllowAnonymous]
        [Route("api/getValveCodeSizes/{id}")]
        [HttpGet]
        public async Task<IActionResult> getSizes(int id)
        { //get the sizes for this valve, return list<Valve_Size>
            var help = new List<Valve_Size>();
            var comaddress = _com.Value.productURL;
            var st = "ValveSize/getSizesForValve/" + id;
            comaddress = comaddress + st;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(comaddress))
                {
                    var g = await response.Content.ReadAsStringAsync();
                    /*  var t = g.Split(',');
                     foreach (string s in t)
                     {
                         help.Add((Valve_Size)JsonConvert.DeserializeObject(s));
                     } */
                    return Ok(g);
                }
            }

            //return Ok(await _vc.GetValveCodeSizes(id));
        }

        #endregion







    }
}