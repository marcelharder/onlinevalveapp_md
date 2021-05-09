using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using api.DAL;
using api.DAL.Code;
using api.DAL.Interfaces;
using api.DAL.models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [ApiController]
    // [Authorize]
    [Route("api/users/{userId}/[controller]")]
    public class GraphController : ControllerBase
    {
        IValve _valve;
        dataContext _context;
        SpecialMaps _special;
        public GraphController(IValve valve, dataContext context, SpecialMaps special)
        {
            _valve = valve;
            _context = context;
            _special = special;
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> getGraph01(int userId, int id)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)) return Unauthorized();
            var hospitalId = await _special.getCurrentUserHospitalId();

            var result = new List<res>();
            if (id == 1)
            {
                string[] sizes = new string[] { "19", "21", "23", "25", "27", "29", "31", "33" };

                var mech = await _valve.getAorticMechanicalSizes(hospitalId);
                var bio = await _valve.getAorticBioSizes(hospitalId);

                for (int i = 0; i < 8; i++)
                {
                    var help = new res();
                    help.size = sizes[i];
                    help.m = mech[i];
                    help.b = bio[i];
                    result.Add(help);
                }
            }
            if (id == 2)
            {
                string[] sizes = new string[] { "19", "21", "23", "25", "27", "29", "31", "33" };

                var mech = await _valve.getMitralMechanicalSizes(hospitalId);
                var bio = await _valve.getMitralBioSizes(hospitalId);

                for (int i = 0; i < 8; i++)
                {
                    var help = new res();
                    help.size = sizes[i];
                    help.m = mech[i];
                    help.b = bio[i];
                    result.Add(help);
                }
            }
            if (id == 3)
            {
                string[] sizes = new string[] { "19", "21", "23", "25", "27", "29", "31", "33" };

                var mech = await _valve.getConduitSizes(hospitalId);
                //var bio = await _valve.getMitralBioSizes(hospitalId);

                for (int i = 0; i < 8; i++)
                {
                    var help = new res();
                    help.size = sizes[i];
                    help.m = mech[i];
                    help.b = 0;
                    result.Add(help);
                }
            }
            if (id == 4)
            {
                string[] sizes = new string[] { "19", "21", "23", "25", "27", "29", "31", "33" };

                var mech = await _valve.getRingSizes(hospitalId);
                //var bio = await _valve.getMitralBioSizes(hospitalId);

                for (int i = 0; i < 8; i++)
                {
                    var help = new res();
                    help.size = sizes[i];
                    help.m = mech[i];
                    help.b = 0;
                    result.Add(help);
                }
            }



            return Ok(result);
        }

        private class res
        {
            public string size { get; set; }
            public int m { get; set; }
            public int b { get; set; }
        }


    }
}