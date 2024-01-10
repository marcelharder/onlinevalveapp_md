using System.Threading.Tasks;
using api.DAL.dtos;
using api.DAL.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using api.DAL.Code;
using System.Security.Claims;
using api.DAL.models;
using System;
using api.Helpers;
using System.Collections.Generic;
using System.Linq;
using api.DAL.Implementations;

namespace api.Controllers
{

    [Authorize]
    [ApiController]
    public class ValveController : ControllerBase
    {
        private IValve _valve;

        private SpecialMaps _special;
        public ValveController(IValve valve, SpecialMaps special)
        {
            _valve = valve;
            _special = special;
        }
        #region <!-- endpoints for SOA -->

        [AllowAnonymous]
        [Route("api/getValveDescriptionFromModel/{model}")]
        [HttpGet]
        public async Task<IActionResult> getValveDescription(string model)
        {   //select valve based on model
            var result = await _valve.getValveByProductCode(model);
            return Ok(result);
        }
        [AllowAnonymous]
        [Route("api/valvesForSOA")]
        [HttpGet]
        public async Task<IActionResult> getSOAValve([FromQuery] ValveParams v)
        {
            List<Class_Valve> result = await _valve.getValvesForSOAAsync(v);
            return Ok(result);
        }

        [AllowAnonymous]
        [Route("api/markValveAsImplanted/{id}/{procId}")]
        [HttpGet]
        public async Task<IActionResult> markValve(int id, int procId)
        {
            var result = await _valve.markValveAsImplantedAsync(id, procId);
            if (result == "updated") { return Ok("Valve marked as implanted"); }
            return BadRequest("Can't mark this valve");
        }
        [AllowAnonymous]
        [Route("api/markValveBySerial/{serial}/{status}/{procId}")]
        [HttpGet]
        public async Task<IActionResult> markValve(string serial, int status, int procId)
        {
            var result = await _valve.markValveBySerialAsync(serial, status, procId);
            if (result == "2") { return Ok("Valve marked"); }
            return BadRequest("Can't mark this valve");
        }


        [AllowAnonymous]
        [Route("api/valveById/{id}", Name = "GetValve")]
        [HttpGet]
        public async Task<IActionResult> getValve01(int id)
        {
            var result = await _valve.getValveById(id);
            return Ok(result);
        }
        [AllowAnonymous]
        [Route("api/tfd/{pc}/{size}")]
        [HttpGet]
        public async Task<IActionResult> getTFD(string pc, string size)
        {
            var result = await _valve.getTFD(pc, size);
            if (result != "") { return Ok(result); }
            return BadRequest("This size is not found ...");

        }



        #endregion

        [Route("api/valvesBySoort/{soort}/{position}")]
        [HttpGet]
        public async Task<IActionResult> getValve01(int soort, int position)
        {
            var result = await _valve.getValvesBySoort(soort, position);
            return Ok(result);
        }
        [Route("api/valvesByHospitalAndValveId/{hospital}/{code}")]
        [HttpGet]
        public async Task<IActionResult> getValve02(int hospital, int code)
        {
            // get modelcode from no, 
            if (code == 99)
            {
                // return all the products from this hospital
                var vendor = await _special.getCurrentVendorAsync();

                var result = await _valve.getAllProductsByVendor(hospital, vendor);
                return Ok(result);
            }
            else
            {
                var model_Code = await _special.getModelCode(code);
                var result = _valve.getValvesByHospitalAndCode(hospital, model_Code);
                return Ok(result);
            }
        }
        [Route("api/updatevalve")]
        [HttpPost]
        public async Task<IActionResult> postValve(ValveForReturnDTO cv)
        {
            var help = 0.0;
            if (cv.Type != "Pericardial Patch")
            { // don't bother with the valve size with pericardial poatches
                if (cv.TFD == 0)
                {
                    //get the valvecode from the description and stuff it in the newly added valve
                   /*  var sel = _special.getDetailsByProductCode(cv.Product_code);
                    var selSizes = sel.Valve_size.ToList();
                    var selectedSize = selSizes.FirstOrDefault(a => a.Size == Convert.ToInt32(cv.Size));
                    help = selectedSize.EOA; */
                }
                else
                {
                    help = cv.TFD;
                }
                cv.TFD = help;
            }
            _valve.updateValve(cv);
            if (await _valve.SaveAll()) { return Ok("Valve saved"); }
            return BadRequest("Can't save this valve");

        }
        [Route("api/deleteValve/{id}")]
        [HttpDelete]
        public async Task<IActionResult> removeValve(int id)
        {
            var result = await _valve.removeValve(id);
            return Ok(result);
        }
        [Route("api/valveBySerial/{serial}/requester/{whoWantsToKnow}")]
        [HttpGet]
        public async Task<IActionResult> getValve01(string serial, string whoWantsToKnow)
        {

            var result = await _valve.getValveBySerial(serial, whoWantsToKnow);
            return Ok(result);
        }
        [Route("api/valveBasedOnTypeOfValve/{id}")]
        [HttpGet]
        public async Task<IActionResult> getValve02(int id) // a valve is added here
        {
            //var v = await _valve.valveBasedOnTypeOfValve(id);
            var v = new Class_Valve();

            _valve.Add(v);
            if (await _valve.SaveAll())
            {
                var valveToReturn = await _special.mapToValveForReturnAsync(v);
                return CreatedAtRoute("GetValve", new { id = v.ValveId }, valveToReturn);
            }
            else
            {
                return BadRequest("Can't add valve");
            }

        }
        [Route("api/valveExpiry/{months}")]
        [HttpGet]
        public async Task<IActionResult> getValveExpiry(int months)
        {
            var result = await _valve.getValveExpiry(months);
            return Ok(result);
        }

        #region <--! transfer stuff-->

        [Route("api/valveTransfers/{UserId}/{ValveId}")]
        [HttpGet]
        public IActionResult getTransfer(int UserId, int ValveId)
        {
            if (UserId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)) return Unauthorized();
            var result = _valve.getValveTransfers(ValveId);
            return Ok(result);
        }
        [Route("api/valveTransferDetails/{UserId}/{TransferId}", Name = "GetTransfer")]
        [HttpGet]
        public async Task<IActionResult> getTransferDetails(int UserId, int TransferId)
        {
            if (UserId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)) return Unauthorized();
            var result = await _valve.getValveTransferDetails(TransferId);
            return Ok(_special.mapToTransfersToReturn(result));
        }
        [HttpDelete("api/removeValveTransfer/{UserId}/{TransferId}")]
        public async Task<IActionResult> removeTransfer(int UserId, int TransferId)
        {
            if (UserId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)) return Unauthorized();
            var result = await _valve.removeValveTransfer(TransferId);

            return Ok(result);
        }
        [HttpPost("api/addValveTransfer/{UserId}/{ValveId}")]
        public async Task<IActionResult> postTransfer(int UserId, int ValveId)
        {
            if (UserId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)) return Unauthorized();

            var ct = new Class_Transfer();
            ct.ValveId = ValveId;
            ct.DepTime = DateTime.Now;
            ct.ArrTime = DateTime.Now;
            _valve.addValveTransfer(ct);

            if (await _valve.SaveAll())
            {
                var itemToReturn = _special.mapToTransfersToReturn(ct);
                return CreatedAtRoute("GetTransfer", new { UserId = UserId, TransferId = ct.Id }, itemToReturn);
            }
            return BadRequest("Could not add Transfer item");
        }
        [HttpPut("api/updateValveTransfer/{UserId}")]
        public IActionResult updateTransfer(int UserId, Class_Transfer_forUpload ct)
        {
            if (UserId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)) return Unauthorized();

            var updateResult = _valve.updateValveTransferAsync(ct);
            return Ok(updateResult);
        }
        #endregion

        #region <!-- valve selection for fitting-->

        [AllowAnonymous]
        [HttpGet("api/ppm")]
        public async Task<IActionResult> getPPM([FromQuery] PPMParams pp)
        {
            var tfd = await _valve.getTFD(pp.productCode, pp.size);


            if (tfd != "")
            {
                var tfdDouble = Convert.ToDouble(tfd);
                var result = await _valve.calculateIndexedFTD(pp.height, pp.weight, tfdDouble);
                var advice = "";
                if (result < .85)
                {
                    if (result < .65) { advice = "severe"; }
                    else { advice = "moderate"; }
                }
                else { advice = "no"; }
                return Ok(advice);
            }
            else
            {
                return BadRequest("Something went wrong ...");
            }

        }

        [HttpGet("api/isMeasuredSizeEnough/{size}")]
        public async Task<IActionResult> isMSEnough(int size, [FromQuery] SelectParams sv)
        {
            var result = "";
            await Task.Run(() =>
            {
                if (_special.isMeasuredSizeEnough(size, sv)) { result = "The size of the annulus is sufficient ..."; }
                else { result = "The size of the annulus is too small for this patient "; }
            });
            return Ok(result);
        }

        [HttpGet("api/selectValves")]
        public async Task<IActionResult> getSelectedValves([FromQuery] SelectParams sv)
        {
            var help = Convert.ToInt32(sv.UserId);
            if (help != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)) return Unauthorized();
            sv.HospitalNo = await _special.getCurrentUserHospitalId();
            var result = await _valve.getSuggestedValves(sv);

            Response.AddPagination(result.Currentpage,
            result.PageSize,
            result.TotalCount,
            result.TotalPages);

            return Ok(result);
        }

        [HttpGet("api/getAllAorticValves/{id}")]
        public async Task<IActionResult> getAOValves(int id)
        {
            if (id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)) return Unauthorized();
            var hospitalId = await _special.getCurrentUserHospitalId();
            var result = await _valve.getAllAorticValves(hospitalId);
            return Ok(result);
        }
        [HttpGet("api/getAllMitralValves/{id}")]
        public async Task<IActionResult> getMValves(int id)
        {
            if (id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)) return Unauthorized();
            var hospitalId = await _special.getCurrentUserHospitalId();
            var result = await _valve.getAllMitralValves(hospitalId);
            return Ok(result);
        }
        #endregion
    }
}