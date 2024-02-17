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
    public class DropController : ControllerBase
    {
        private IVendor  _vendor;
        public DropController(IVendor vendor)
        {
            _vendor = vendor;
        }
        [Route("api/options_implanted")]
        [HttpGet]
        public List<Class_Item> getImplantedOptions()
        {
            var help = new List<Class_Item>();

            var ci = new Class_Item();
            ci.Value = 0;
            ci.Description = "Available for implant";
            help.Add(ci);
            ci = new Class_Item();
            ci.Value = 1;
            ci.Description = "Implanted";
            help.Add(ci);
            ci = new Class_Item();
            ci.Value = 2;
            ci.Description = "Expired in storage";
            help.Add(ci);

            ci = new Class_Item();
            ci.Value = 3;
            ci.Description = "Charity";
            help.Add(ci);

            ci = new Class_Item();
            ci.Value = 4;
            ci.Description = "Sent to vendor";
            help.Add(ci);


            return help;
        }

        [Route("api/options_valve_location")]
        [HttpGet]
        public List<Class_Item> getLocationOptions()
        {
            var help = new List<Class_Item>();

            var ci = new Class_Item();
            ci.Value = 0;
            ci.Description = "Choose";
            help.Add(ci);

            ci = new Class_Item();
            ci.Value = 1;
            ci.Description = "Aortic";
            help.Add(ci);

            ci = new Class_Item();
            ci.Value = 2;
            ci.Description = "Mitral";
            help.Add(ci);

            ci = new Class_Item();
            ci.Value = 3;
            ci.Description = "Tricuspid";
            help.Add(ci);

            ci = new Class_Item();
            ci.Value = 5;
            ci.Description = "Pulmonary";
            help.Add(ci);
            return help;

        }

        [Route("api/options_valve_type")]
         [HttpGet]
        public List<Class_Item> getTypeOptions()
        {
            var help = new List<Class_Item>();
            var ci = new Class_Item();
            ci.Value = 0;
            ci.Description = "Choose";
            help.Add(ci);

            ci = new Class_Item();
            ci.Value = 1;
            ci.Description = "Biological";
            help.Add(ci);

            ci = new Class_Item();
            ci.Value = 2;
            ci.Description = "Mechanical";
            help.Add(ci);

            ci = new Class_Item();
            ci.Value = 3;
            ci.Description = "Annuloplasty_Ring";
            help.Add(ci);

            ci = new Class_Item();
            ci.Value = 4;
            ci.Description = "Pericardial Patch";
            help.Add(ci);

            ci = new Class_Item();
            ci.Value = 5;
            ci.Description = "Valved_Conduit";
            help.Add(ci);


            return help;
        }
       
        [Route("api/options_role")]
         [HttpGet]
        public List<Class_Item> getRoleOptions()
        {
            var help = new List<Class_Item>();
            var ci = new Class_Item();
            ci.Value = 0;
            ci.Description = "Choose";
            help.Add(ci);

            ci = new Class_Item();
            ci.Value = 1;
            ci.Description = "normal";
            help.Add(ci);

            ci = new Class_Item();
            ci.Value = 2;
            ci.Description = "surgeon";
            help.Add(ci);

            ci = new Class_Item();
            ci.Value = 3;
            ci.Description = "superuser";
            help.Add(ci);

            ci = new Class_Item();
            ci.Value = 4;
            ci.Description = "companyadmin";
            help.Add(ci);

            ci = new Class_Item();
            ci.Value = 5;
            ci.Description = "companyHQ";
            help.Add(ci);


            return help;
        }

        [AllowAnonymous]
        [Route("api/options_companies")]
         [HttpGet]
        public async Task<List<Class_Item>> getCompanyOptionsAsync()
        {
            var help = new List<Class_Item>();
            help = await _vendor.getVendors();
            
            return help;
        }

       

    }
}