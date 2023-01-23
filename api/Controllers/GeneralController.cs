using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using api.DAL.Code;

namespace api.Controllers
{

[ApiController]
[Authorize]
public class GeneralController :  ControllerBase
{
private SpecialMaps _special;
public GeneralController(SpecialMaps special)
{
    _special = special;
}

[Route("api/hospital")]
[HttpGet]
public async Task<IActionResult> getHospitalAsync()
{
var hospital_id = await _special.getCurrentUserHospitalId();

return Ok(await _special.getHospital(hospital_id));
}

[Route("api/hospitalName/{code}")]
[HttpGet]
public async Task<IActionResult> getHospitalName(int code){
    if(code != 0){
    var hospital = await _special.getHospital(code);
    return Ok(hospital.Naam);}
    return BadRequest("code should not be 0");
}

[Route("api/vendorId/{name}")]
[HttpGet]
public async Task<IActionResult> getVendorId(string name)
{
var vendor_id = await _special.getVendorIdFromName(name);
return Ok(vendor_id);
}

[Route("api/countryNameFromISO/{code}")]
[HttpGet]
public IActionResult getCountryName(string code)
{
var result = _special.getCountryNameFromISO(code);
return Ok(result);
}
[Route("api/countryIDFromDescription/{code}")]
[HttpGet]
public IActionResult getCountryIDFromDescrption(string code)
{
var result = _special.getCountryIDFromDescription(code);
return Ok(result);
}
[Route("api/countryNameFromID/{id}")]
[HttpGet]
public IActionResult getCountryNameID(string id)
{
var result = _special.getCountryNameFromID(id);
return Ok(result);
}

[Route("api/calculateBSA/{height}/{weight}")]
[HttpGet]
[AllowAnonymous]
public IActionResult getBSA(double height, double weight){return Ok(_special.calculateBSA(height,weight));}

[Route("api/countryList")]
[HttpGet]
public IActionResult getListOfCountries(){
    var result = _special.getListOfCountries();
    return Ok(result);
}


}

}