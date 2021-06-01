using System.Collections.Generic;
using System.Threading.Tasks;
using api.DAL.dtos;
using api.DAL.Interfaces;
using api.DAL.models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{

    [ApiController]
    [Authorize]
    public class HospitalController : ControllerBase
    {
        private IHospital _hospital;
        private IUserRepository _user;
        public HospitalController(IHospital hospital, IUserRepository user)
        {
            _hospital = hospital;
            _user = user;
        }

        [HttpGet("api/hospital/vendors")]
        public async Task<List<Class_Item>> getVendorsInHospital()
        {
            var help = await _hospital.getHospitalVendors();
            return help;
        }
        [HttpGet("api/sphlist")]
        public async Task<List<Class_Item>> getQuestion01()
        {
            var help = await _hospital.getSphList();
            return help;
        }
        [HttpGet("api/addVendor/{vendor}/{hospital_id}")]
        public async Task<string> getQuestion05(string vendor, int hospital_id)
        {
            var help = await _hospital.addVendor(vendor, hospital_id);
            return help;
        }
        [HttpGet("api/removeVendor/{vendor}/{hospital_id}")]
        public async Task<string> getQuestion06(string vendor, int hospital_id)
        {
            var help = await _hospital.removeVendor(vendor, hospital_id);
            return help;
        }
        [HttpGet("api/sphlist_full")]
        public async Task<List<Class_Hospital>> getQuestion02()
        {
            var help = await _hospital.getSphListFull();
            return help;
        }
        [HttpGet("api/neg_sphlist_full")]
        public async Task<List<Class_Hospital>> getQuestion03()
        {
            var help = await _hospital.getNegSphListFull();
            return help;
        }
        [HttpGet("api/getHospitalDetails/{id}")]
        public async Task<Class_Hospital> getQuestion07(int id)
        {
            var help = await _hospital.getDetails(id);
            return help;
        }
        [HttpPost("api/saveHospitalDetails")]
        public async Task<string> postQuestion07(Class_Hospital hos)
        {
            var help = await _hospital.saveDetails(hos);
            return help;
        }
        [HttpPost("api/changeHospital/{hospitalID}")]
        // this comes from the SOA application, where the userId will be different
        public async Task<string> postQuestion08(UserForUpdate cv, int hospitalID)
        {
            // find the correct user now
            User currentUser = _user.findCurrentUser(cv);
            var help = await _hospital.changeHospitalForCurrentUser(hospitalID, currentUser);
            return help;
        }

        [HttpGet("api/getHospitalsInCountry/{code}")]
        public async Task<List<Class_Item>> getQuestion09(string code)
        {
            // code here is '47' for instance

            return await _hospital.hospitalsInCountry(code);
        }


        [HttpGet("api/allHospitals")]
        public async Task<List<Class_Item>> getAllHospitalsAsync()
        {
          return await _hospital.getAllHospitals();
        }
        [HttpGet("api/isOVIPlace/{id}")]
        public async Task<IActionResult> getOVI(int id) { return Ok(await _hospital.isThisHospitalOVI(id)); }
    }



}