using System.Security.Claims;
using System.Threading.Tasks;
using api.DAL.Code;
using api.DAL.dtos;
using api.DAL.Interfaces;
using api.DAL.models;
using api.Helpers;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace api.Controllers
{

    [ApiController]
    [Authorize]
    public class ProductController : ControllerBase
    {
        private IValveCode _vc;
        private SpecialMaps _special;
        private Cloudinary _cloudinary;
        private readonly IOptions<CloudinarySettings> _cloudinaryConfig;
        public ProductController(IValveCode vc, SpecialMaps special, IOptions<CloudinarySettings> cloudinaryConfig)
        {
            _vc = vc;
            _special = special;
            _cloudinaryConfig = cloudinaryConfig;

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
            var help = new Class_TypeOfValve();
            help.Vendor_code = currentVendor.ToString();
            help.Vendor_description = await _special.getVendorNameFromVendorCodeAsync(currentVendor.ToString());
            help.countries = "31,966";
            help.Type = "";
            help.image = "https://res.cloudinary.com/marcelcloud/image/upload/v1620571880/valves/valves02.jpg";


            _vc.Add(help);
            if (await _vc.SaveAll())
            {
                //var valveToReturn = await _special.mapToValveForReturnAsync(v);
                help.No = help.Id;
                await _vc.saveDetails(help);
                return CreatedAtRoute("getProduct", new { id = help.Id }, help);
            }
            return BadRequest("add product failed");
        }

        [HttpDelete("api/deleteProduct/{id}")]
        public async Task<IActionResult> deleteProductdetails(int id)
        {
            var result = await _vc.getDetails(id);
            _vc.Delete(result);
            if (await _vc.SaveAll()) { return Ok(); }
            return BadRequest("Delete failed ...");
        }

        [HttpPost("api/saveProductDetails")]
        public async Task<IActionResult> postProductdetails(Class_TypeOfValve tov)
        {
            var help = await _vc.saveDetails(tov);
            return Ok(help);
        }

        [HttpGet("api/productByNo/{id}", Name = "getProduct")]
        public async Task<IActionResult> get04(int id)
        {
            var result = await _vc.getDetails(id);
            return Ok(result);
        }

        [Route("api/addProductPhoto/{id}")]
        [HttpPost]
        public async Task<IActionResult> AddPhotoForProduct(int id, [FromQuery] PhotoForCreationDto photoDto)
        {
            if (id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)) return Unauthorized();
            var product = await _vc.getDetails(photoDto.ValveId);

            var file = photoDto.File;
            var uploadresult = new ImageUploadResult();

            if (file.Length > 0)
            {
                using (var stream = file.OpenReadStream())
                {
                    var uploadParams = new ImageUploadParams()
                    {
                        File = new FileDescription(file.Name, stream),
                        Transformation = new Transformation().Width(500).Height(500).Crop("fill").Gravity("face")
                    };
                    uploadresult = _cloudinary.Upload(uploadParams);
                }
                product.image = uploadresult.Uri.ToString();

                if (await _vc.SaveAll())
                {
                    return CreatedAtRoute("getProduct", new { id = product.Id }, product);
                }
            }
            return BadRequest();
        }

       
    }
}