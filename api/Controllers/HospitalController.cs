using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using api.DAL.Code;
using api.DAL.dtos;
using api.DAL.Interfaces;
using api.DAL.models;
using api.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace api.Controllers
{

    [ApiController]
    [Authorize]
    public class HospitalController : ControllerBase
    {
        private IHospital _hospital;
        private IOptions<ComSettings> _com;
        private SpecialMaps _special;
        private IUserRepository _user;
        public HospitalController(IHospital hospital, IUserRepository user, SpecialMaps special, IOptions<ComSettings> com)
        {
            _hospital = hospital;
            _user = user;
            _special = special;
            _com = com;
        }


        [HttpGet("api/hospital/vendors")]
        public async Task<IActionResult> getVendorsInHospital()
        {
            var comaddress = _com.Value.hospitalURL;
            var st = "Hospital/vendors" + _special.getCurrentUserHospitalId();
            comaddress = comaddress + st;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(comaddress))
                {
                    var help = await response.Content.ReadAsStringAsync();
                    // var help2 = Newtonsoft.Json.JsonConvert.DeserializeObject<Class_Hospital>(help);
                    return Ok(help);
                }
            }
        }
        [HttpGet("api/sphlist")]
        public async Task<IActionResult> getQuestion01()
        {
            var comaddress = _com.Value.hospitalURL;
            var st = "Hospital/sphList" + _special.getCurrentUserHospitalId();
            comaddress = comaddress + st;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(comaddress))
                {
                    var help = await response.Content.ReadAsStringAsync();
                    return Ok(help);
                }
            }
            //var help = await _hospital.getSphList();
            //return help;
        }
        [HttpGet("api/addVendor/{vendor}/{hospital_id}")]
        public async Task<IActionResult> getQuestion05(string vendor, int hospital_id)
        {
            var comaddress = _com.Value.hospitalURL;
            var st = "Hospital/addVendor" + vendor + "/" + hospital_id;
            comaddress = comaddress + st;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(comaddress))
                {
                    var help = await response.Content.ReadAsStringAsync();
                    return Ok(help);
                }
            }
            // var help = await _hospital.addVendor(vendor, hospital_id);
            //  return help;
        }
        [HttpGet("api/removeVendor/{vendor}/{hospital_id}")]
        public async Task<IActionResult> getQuestion06(string vendor, int hospital_id)
        {
            var comaddress = _com.Value.hospitalURL;
            var st = "Hospital/removeVendor" + vendor + "/" + hospital_id;
            comaddress = comaddress + st;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(comaddress))
                {
                    var help = await response.Content.ReadAsStringAsync();
                    return Ok(help);
                }
            }
            //var help = await _hospital.removeVendor(vendor, hospital_id);
            //return help;
        }
        [HttpGet("api/sphlist_full")]
        public async Task<IActionResult> getQuestion02()
        {
            var comaddress = _com.Value.hospitalURL;
            var st = "Hospital/sphlist_full";
            comaddress = comaddress + st;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(comaddress))
                {
                    var help = await response.Content.ReadAsStringAsync();
                    return Ok(help);
                }
            }
            //var help = await _hospital.getSphListFull();
            //return help;
        }
        [HttpGet("api/neg_sphlist_full")]
        public async Task<IActionResult> getQuestion03()
        {
            var comaddress = _com.Value.hospitalURL;
            var st = "Hospital/neg_sphlist_full";
            comaddress = comaddress + st;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(comaddress))
                {
                    var help = await response.Content.ReadAsStringAsync();
                    return Ok(help);
                }
            }
            //var help = await _hospital.getNegSphListFull();
            //return help;
        }
        [AllowAnonymous]
        [HttpGet("api/getHospitalDetails/{id}")]
        public async Task<IActionResult> getQuestion07(int id)
        {
            var comaddress = _com.Value.hospitalURL;
            var st = "Hospital/" + id;
            comaddress = comaddress + st;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(comaddress))
                {
                    var help = await response.Content.ReadAsStringAsync();
                    return Ok(help);
                }
            }
            //var help = await _hospital.getDetails(id);
            //return help;
        }
        [HttpPut("api/saveHospitalDetails")]
        public async Task<string> postQuestion07(HospitalForReturnDTO hos)
        {
            var help = await _hospital.saveDetails(hos);
            return help;
        }
        [AllowAnonymous]
        [HttpGet("api/getHospitalsInCountry/{code}")]
        public async Task<IActionResult> getQuestion09(string code)
        {
            // code here is '47' for instance
            var isoCode = await _special.getIsoCode(code);
            var comaddress = _com.Value.hospitalURL;
            var st = "Hospital/allFullHospitalsPerCountry/" + isoCode;
            comaddress = comaddress + st;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(comaddress))
                {
                    var help = await response.Content.ReadAsStringAsync();
                    return Ok(help);// returns a list of Class_Item
                }
            }
            //return await _hospital.hospitalsInCountry(code);
        }
        [HttpGet("api/getFullHospitalsInCountry")]
        public async Task<IActionResult> getQuestion19([FromQuery] HospitalParams hp)
        {
            var comaddress = _com.Value.hospitalURL;
            var st = "Hospital/getFullHospitalsInCountry/" + hp;
            comaddress = comaddress + st;

            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(comaddress))
                {
                    var result = await response.Content.ReadAsStringAsync();
                    var help2 = Newtonsoft.Json.JsonConvert.DeserializeObject<PagedList<Class_Hospital>>(result);
                    var l = _special.mapToListOfHospitalsToReturn(help2);

                    Response.AddPagination(help2.Currentpage,
                    help2.PageSize,
                    help2.TotalCount,
                    help2.TotalPages);
                    return Ok(l);
                }
            }
        }
        [HttpPost("/api/createHospital/{country}/{code}")]
        public async Task<IActionResult> createHospital(string country, string code)
        {
            // country here is '47' for instance
            // code which is the hospitalNo is ignored
            var isoCode = _special.getIsoCode(country);
            var comaddress = _com.Value.hospitalURL;
            var st = "Hospital/createHospital/" + isoCode;
            comaddress = comaddress + st;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(comaddress))
                {
                    var help = await response.Content.ReadAsStringAsync();
                    return Ok(help);// returns a new Class_Hospital
                }
            }
        }
        [HttpDelete("/api/deleteHospital/{id}")]
        public async Task<IActionResult> deleteHospital(int id)
        {
            var comaddress = _com.Value.hospitalURL;
            var st = "Hospital/deleteHospital/" + id;
            comaddress = comaddress + st;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.DeleteAsync(comaddress))
                {
                    var help = await response.Content.ReadAsStringAsync();
                    return Ok(help);
                }
            }

        }
        [HttpGet("api/allHospitals")]
        public async Task<IActionResult> getAllHospitalsAsync() // return list of class_item
        {
            var comaddress = _com.Value.hospitalURL;
            var st = "Hospital/allHospitals";
            comaddress = comaddress + st;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(comaddress))
                {
                    var help = await response.Content.ReadAsStringAsync();
                    return Ok(help);
                }
            }

        }
    
        [HttpGet("api/isOVIPlace")]
        public async Task<IActionResult> getOVI()
        {
            var comaddress = _com.Value.hospitalURL;
            var st = "Hospital/isOVIPlace";
            comaddress = comaddress + st;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(comaddress))
                {
                    var result = await response.Content.ReadAsStringAsync();
                    return Ok(result);// returns 1, which is yes or 0 which is no
                }
            }


           
        }


    }



}