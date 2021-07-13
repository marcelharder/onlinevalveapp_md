using System.Collections.Generic;
using System.Threading.Tasks;
using api.DAL.Interfaces;
using api.DAL.models;
using api.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [ApiController]
    [Authorize]
    public class VendorController : ControllerBase
    {

        private IVendor _vendor;
        private IValveCode _code;
        public VendorController(IVendor vendor, IValveCode code)
        {
            _vendor = vendor;
            _code = code;
        }
        [Route("api/vendor/{id}", Name = "getVendor")]
        public async Task<Class_Vendors> getVendor(int id)
        {
            var help = await _vendor.getVendor(id);
            return help;
        }
          
        [Route("api/vendor/valvecodes/{id}")]
        public async Task<List<Class_Item>> getVendor02(int id)
        {
            var help = await _code.getValveCodesPerCountry(id);
            return help;
        }

        [Route("api/vendor/fullProducts/{id}")]
        public async Task<List<Class_TypeOfValve>> getVendor03(int id)
        {
            var help = await _code.getTypeOfValvesPerCountry(id);
            return help;
        }

        [Route("api/updatevendor")]
        [HttpPost]
        public async Task<IActionResult> postVendor([FromRoute]Class_Vendors cv)
        {
            _vendor.Update(cv);
            if (await _vendor.SaveAll()) { return Ok("Vendor saved"); }
            return BadRequest("Can't save this vendor");

        }
   
         [Route("api/vendors")]
         [HttpGet]
         public async Task<IActionResult> allVendors(){
             var result = await _vendor.getVendors();
             return Ok(result);
         }
       
       
         [Route("api/vendorsFull")]
         [HttpGet]
         public async Task<IActionResult> allVendorsFull([FromQuery] UserParams up){

            var result = await _vendor.getVendorsFull(up);

            Response.AddPagination(result.Currentpage,
            result.PageSize,
            result.TotalCount,
            result.TotalPages);

             return Ok(result);
         }

         [Route("api/deleteVendor/{id}")]
         [HttpDelete]
         public async Task<IActionResult> deleteVendor(int id){
              var help = await _vendor.getVendor(id);
             _vendor.Delete(help);
             if(await _vendor.SaveAll()){return Ok("Deleted");}
             return BadRequest("Could not delete entity");

         }
   
         [Route("api/addVendor")]
         [HttpGet]
         public async Task<IActionResult> addVendor(){
             var ven = new Class_Vendors();
             _vendor.Add(ven);
             if(await _vendor.SaveAll()){
                 return CreatedAtRoute("getVendor", new { id = ven.Id }, ven);}
             return BadRequest("Could not add entity");

         }
   
   
    }
}