using System.Linq;
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
            help.countries = "NL,US,KSA";
            help.Type = "";
            help.image = "https://res.cloudinary.com/marcelcloud/image/upload/v1620571880/valves/valves02.jpg";

            _vc.Add(help);
            if (await _vc.SaveAll())
            {
                //var valveToReturn = await _special.mapToValveForReturnAsync(v);
                help.No = help.ValveTypeId;
                await _vc.saveDetails(help);
                return CreatedAtRoute("getProduct", new { id = help.ValveTypeId }, help);
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
        [HttpGet("api/productByCode/{code}")]
        public async Task<IActionResult> get041(string code)
        {
            var result = await _vc.getDetailsByProductCode(code);
            return Ok(result);
        }


        [Route("api/addProductPhoto/{id}")]
        [HttpPost]
        public async Task<IActionResult> AddPhotoForProduct(int id, [FromQuery] PhotoForCreationDto photoDto)
        {
            var product = await _vc.getDetails(id);

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
                product.image = uploadresult.Url.ToString();
                
                if (await _vc.SaveAll())
                {
                    return CreatedAtRoute("getProduct", new { id = product.ValveTypeId }, product);
                }
            }
            return BadRequest();
        }


        #region <!-- used by soa -->

        [AllowAnonymous]
        [HttpGet("api/productByValveTypeId/{id}")]
        public async Task<IActionResult> get042(int id)
        {
            var result = await _vc.getDetailsByValveTypeId(id);
            return Ok(result);
        }
        [AllowAnonymous]
        [Route("api/products")]
        [HttpGet]
        public async Task<IActionResult> getAllProducts(){
            var result = await _vc.getAllProducts();
            return Ok(result);
        }
       
        [AllowAnonymous]
        [Route("api/products/{type}/{position}")]
        [HttpGet]
        public async Task<IActionResult> getAllProducts(string type, string position){
            var result = await _vc.getAllTPProducts(type,position);
            return Ok(result);
        }
         [AllowAnonymous]
        [Route("api/productsByVTP/{vendor}/{type}/{position}")]
        [HttpGet]
        public async Task<IActionResult> getAllProducts(string vendor,string type, string position){
            var result = await _vc.getAllProductsByVTP(vendor,type,position);
            return Ok(result);
        }
        [AllowAnonymous]
        [Route("api/getValveCodeSizes/{id}")]
        [HttpGet]
        public async Task<IActionResult> getSizes(int id){
            return Ok(await _vc.GetValveCodeSizes(id));
        }
        
        #endregion
   
        [Route("api/addSize/{id}")]
        [HttpPost]
        public async Task<IActionResult> addSize(int id, [FromBody] Class_Valve_Size vs){
            Class_Valve_Size result = new Class_Valve_Size();
            result.Size = vs.Size;
            result.EOA = vs.EOA;

            var selectedValve = await _vc.getDetailsByValveTypeId(id);
            selectedValve.Valve_size.Add(result);

            _vc.Update(selectedValve);

            if (await _vc.SaveAll())
            {
            var test = selectedValve.Valve_size.Last();
            return CreatedAtRoute("getSize",new { id = test.SizeId }, test);
            }
            return null;
           
            
        }

       

        [Route("api/getSize/{id}", Name = "getSize")]
        [HttpGet]
        public async Task<Class_Valve_Size> getSize(int id){
          return await _vc.GetSize(id);
        }

        [Route("api/deleteSize/{id}/{sizeId}")]
        [HttpDelete]
        public async Task<IActionResult> deleteSize(int id,int sizeId){
            var result = await _vc.deleteSize(id, sizeId);
            return Ok(result);
        }
    }
}