using System.Collections.Generic;
using System.Threading.Tasks;
using api.DAL.Interfaces;
using api.DAL.models;
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
        [Route("api/vendor/{id}")]
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
            await _vendor.updateVendor(cv);
            if (await _vendor.SaveAll()) { return Ok("Vendor saved"); }
            return BadRequest("Can't save this vendor");

        }
    }
}