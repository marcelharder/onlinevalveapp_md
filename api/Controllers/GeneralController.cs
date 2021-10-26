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
public async Task<IActionResult> getHospitalAsync()
{
var hospital_id = await _special.getCurrentUserHospitalId();

return Ok(await _special.getHospital(hospital_id));
}

[Route("api/hospitalName/{code}")]
public async Task<IActionResult> getHospitalName(int code){
    var hospital = await _special.getHospital(code);
    return Ok(hospital.Naam);
}

[Route("api/vendorId/{name}")]
public async Task<IActionResult> getVendorId(string name)
{
var vendor_id = await _special.getVendorIdFromName(name);
return Ok(vendor_id);
}

[Route("api/countryNameFromISO/{code}")]
public IActionResult getCountryName(string code)
{
var result = _special.getCountryNameFromISO(code);
return Ok(result);
}
[Route("api/countryIDFromDescription/{code}")]
public IActionResult getCountryIDFromDescrption(string code)
{
var result = _special.getCountryIDFromDescription(code);
return Ok(result);
}
[Route("api/countryNameFromID/{id}")]
public IActionResult getCountryNameID(string id)
{
var result = _special.getCountryNameFromID(id);
return Ok(result);
}

[Route("api/calculateBSA/{height}/{weight}")]
[AllowAnonymous]
public IActionResult getBSA(double height, double weight){return Ok(_special.calculateBSA(height,weight));}

[Route("api/countryList")]
public IActionResult getListOfCountries(){
    var result = _special.getListOfCountries();
    return Ok(result);
}


}

}