using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Threading.Tasks;
using api.DAL.Code;
using api.DAL.dtos;
using api.DAL.Interfaces;
using api.DAL.models;
using api.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Query.Internal;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;

namespace api.Controllers
{

    [ApiController]
    [Authorize]
    public class HospitalController : ControllerBase
    {
        private IHospital _hospital;
        private IVendor _vendor;
        private IOptions<ComSettings> _com;
        private SpecialMaps _special;
        private IUserRepository _user;
        public HospitalController(IHospital hospital, IVendor vendor, IUserRepository user, SpecialMaps special, IOptions<ComSettings> com)
        {
            _hospital = hospital;
            _user = user;
            _special = special;
            _com = com;
            _vendor = vendor;
        }

        [HttpGet("api/hospital/vendors")]
        public async Task<IActionResult> getVendorsInHospital()
        {
            var comaddress = _com.Value.hospitalURL;
            var st = "Hospital/getHospitalVendors/" + await _special.getCurrentUserHospitalId();
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

        [HttpGet("api/addVendor/{vendor}")]
        public async Task<IActionResult> getQuestion05(string vendor)
        {
            var comaddress = _com.Value.hospitalURL;
            var st = "Hospital/addVendorToHospital/" + vendor + "/" + await _special.getCurrentUserHospitalId();
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

        [HttpGet("api/removeVendor/{vendor}")]
        public async Task<IActionResult> getQuestion06(string vendor)
        {
            var comaddress = _com.Value.hospitalURL;
            var st = "Hospital/removeVendorFromHospital/" + vendor + "/" + await _special.getCurrentUserHospitalId();
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

        [HttpGet("api/sphlist")]
        public async Task<IActionResult> getQuestion01()
        {
            var currentcountry = "";
            var currentVendor = 0;
            var currentUserId = _special.getCurrentUserId();

            var currentUser = await _user.GetUser(currentUserId);
            if (currentUser.Role == "companyHQ" || currentUser.Role == "companyadmin")
            {
                currentcountry = currentUser.Country;
                var h = await _vendor.getVendorByName(currentUser.worked_in);
                currentVendor = h.No;
                var comaddress = _com.Value.hospitalURL;
                var st = "Hospital/sphlist/" + currentVendor + "/" + currentcountry;
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
            else { return BadRequest("Requestor should be superuser"); }
        }

        [HttpGet("api/sphlist_full")]
        public async Task<IActionResult> getQuestion02()
        {
            var currentcountry = "";
            var currentVendor = 0;
            var currentUserId = _special.getCurrentUserId();
            var currentUser = await _user.GetUser(currentUserId);

            if (currentUser.Role == "companyHQ" || currentUser.Role == "companyadmin")
            {
                var comaddress = _com.Value.hospitalURL;
                var st = "Hospital/sphlist_full/" + currentVendor + "/" + currentcountry;
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
            else { return BadRequest("Requestor should be companyHQ or companyadmin"); }
        }

        [HttpGet("api/neg_sphlist_full")]
        public async Task<IActionResult> getQuestion03()
        {
            var currentcountry = "";
            var currentVendor = 0;
            var currentUserId = _special.getCurrentUserId();
            var currentUser = await _user.GetUser(currentUserId);

            if (currentUser.Role == "companyHQ" || currentUser.Role == "companyadmin")
            {
                var comaddress = _com.Value.hospitalURL;
                var st = "Hospital/neg_sphlist_full/" + currentVendor + "/" + currentcountry;
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
            else { return BadRequest("Requestor should be companyHQ or companyadmin"); }
        }

        [AllowAnonymous]
        [HttpGet("api/getHospitalDetails/{id}")]
        public async Task<IActionResult> getQuestion07(int id)
        {
            var hospital = await _special.getHospital(id);
            return Ok(hospital);
        }

        [HttpPut("api/saveHospitalDetails")]
        public async Task<string> postQuestion07(HospitalForReturnDTO hos)
        {
            var help = "";
            var comaddress = _com.Value.hospitalURL;
            var st = "Hospital";
            comaddress = comaddress + st;
            var json = JsonConvert.SerializeObject(hos, Formatting.None);
            var content = new StringContent(json, System.Text.Encoding.UTF8, "application/json");
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.PutAsync(comaddress, content))
                {
                    help = await response.Content.ReadAsStringAsync();
                }
            }
            return help;
        }

        [AllowAnonymous]
        [HttpGet("api/getHospitalsInCountry/{CountryDescription}")]
        public async Task<IActionResult> getQuestion09(string CountryDescription)
        {
            var comaddress = _com.Value.hospitalURL;
            var selectedIsoCode = "0";
            // get the isocode first
            var st = "Country/getIsoFromDescription/" + CountryDescription;
            comaddress = comaddress + st;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(comaddress))
                {
                    selectedIsoCode = await response.Content.ReadAsStringAsync();
                    
                }
            }

            var comaddress2 = _com.Value.hospitalURL;
            var st2 = "Hospital/getHospitalItemsPerCountryFromIso/" + selectedIsoCode;
            comaddress2 = comaddress2 + st2;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(comaddress2))
                {
                    var help = await response.Content.ReadAsStringAsync();
                    return Ok(help);// returns a list of Class_Item
                }
            }
        }

        [HttpGet("api/getFullHospitalsInCountry")]
        public async Task<IActionResult> getQuestion19([FromQuery] HospitalParams hp)
        {
            var comaddress = _com.Value.hospitalURL;
            var st = "Hospital/pagedList?code=" + hp.code + "&PageNumber=" + hp.PageNumber + "&PageSize=" + hp.PageSize;
            comaddress = comaddress + st;

            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(comaddress))
                {
                    var result = await response.Content.ReadAsStringAsync();
                    return Ok(result);
                }
            }
        }

        [HttpPost("/api/createHospital/{TelCode}/{hospitalNo}")]
        public async Task<IActionResult> createHospital(string TelCode, string hospitalNo)
        {
            // country here is '47' for instance
            // code which is the hospitalNo is ignored
            var isoCode = _special.getIsoCode(TelCode);
            var comaddress = _com.Value.hospitalURL;
            var st = "Hospital/" + isoCode + "/" + hospitalNo;
            comaddress = comaddress + st;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.PostAsync(comaddress, null))
                {
                    var help = await response.Content.ReadAsStringAsync();
                    return Ok(help);// returns a new Class_Hospital
                }
            }
        }

        [HttpDelete("/api/deleteHospital/{id}")]
        public async Task<IActionResult> deleteHospital(int id)
        {
            var help = "";
            var comaddress = _com.Value.hospitalURL;
            var st = "Hospital/" + id;
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

        [HttpGet("api/allHospitals/{TelCode}")]
        public async Task<IActionResult> getAllHospitalsAsync(string TelCode) // return list of class_item
        {   // country here is '47' for instance
            var isoCode = _special.getIsoCode(TelCode);
            var comaddress = _com.Value.hospitalURL;
            var st = "Hospital/getHospitalItemsPerCountryFromIso/" + isoCode;
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
            var hospitalNo = await _special.getCurrentUserHospitalId();
            var comaddress = _com.Value.hospitalURL;
            var st = "Hospital/IsThisHospitalImplementingOVI/" + hospitalNo;
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

        [HttpPost("addHospitalPhoto/{id}")]
        public async Task<IActionResult> AddPhotoForHospital(int id, [FromForm] PhotoForCreationDto photoDto)
        {
            var content = new MultipartFormDataContent();
            content.Add(new StreamContent(photoDto.File.OpenReadStream()), photoDto.File.Name, photoDto.File.FileName);
            content.Headers.ContentDisposition = new ContentDispositionHeaderValue("form-data") { Name = photoDto.File.Name, FileName = photoDto.File.FileName };

            var help = new photoResult();
            var comaddress = _com.Value.hospitalURL;
            var st = "Hospital/addHospitalPhoto/" + id;
            comaddress = comaddress + st;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.PostAsync(comaddress, content))
                {
                    // var ger = await response.Content.ReadAsStringAsync();
                    help = await response.Content.ReadFromJsonAsync<photoResult>();
                }
            }
            return Ok(help.document_url);
        }
    }
    class photoResult
    {
        public string document_url { get; set; }
        public string image { get; set; }
        public string publicId { get; set; }
    }



}