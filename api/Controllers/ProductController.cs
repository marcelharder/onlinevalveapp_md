using System.Threading.Tasks;
using api.DAL.Code;
using api.DAL.Interfaces;
using api.DAL.models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{

    [ApiController]
    [Authorize]
    public class ProductController : ControllerBase
    {
        private IValveCode _vc;
        private SpecialMaps _special;
        public ProductController(IValveCode vc, SpecialMaps special)
        {
            _vc = vc;
            _special = special;
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


            _vc.Add(help);
            if (await _vc.SaveAll()) {
                 //var valveToReturn = await _special.mapToValveForReturnAsync(v);
                 help.No = help.Id;
                 await _vc.saveDetails(help);
                 return CreatedAtRoute("getProduct", new { id = help.Id }, help); }
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

    }
}