using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using api.DAL.Code;
using api.DAL.dtos;
using api.DAL.Interfaces;
using api.DAL.models;
using api.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{

    [ApiController]
    [Authorize]
    public class UserController : ControllerBase
    {
        private IUserRepository _user;
        private SpecialMaps _special;
        public UserController(IUserRepository user, SpecialMaps special)
        {
            _user = user;
            _special = special;
        }
        [HttpGet("api/userById/{id}", Name = "getUser")]
        public async Task<IActionResult> getUser01Async(int id)
        {
            var result = await _user.GetUser(id);
            return Ok(await _special.getUserforReturnDTOAsync(result));
        }
        
        [HttpGet("api/getUserIdFromName/{name}")]
        public async Task<IActionResult> getUserIdFromName(string name)
        {
            var result = await _user.GetUserFromName(name);
            return Ok(result.UserId);
        }

        [HttpGet("api/users")]
        public async Task<IActionResult> getUser03([FromQuery] UserParams up)
        {
            var result = await _user.GetUsers(up);
            var userList = await _special.mapToListOfUserToReturn(result);

            Response.AddPagination(result.Currentpage,
            result.PageSize,
            result.TotalCount,
            result.TotalPages);

            return Ok(userList);
        }

        [HttpGet("api/countries")]
        public async Task<IActionResult> getUser09()
        {
            List<Class_Item> result;
            result = await _special.getListOfCountries();
            return Ok(result);
        }

        [HttpPost("api/updateuser/{userId}")]
        public async Task<IActionResult> getUser04Async(int userId, UserForReturnDTO cv)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)) return Unauthorized();
            _user.Update(await _special.mapToUserFromUserToReturn(cv));
            if (await _user.SaveAll()) { return Ok(1); };
            return BadRequest("can not update User");
        }

        [HttpDelete("api/deleteuser/{userId}")]
        public async Task<IActionResult> removeUser(int userId){
            var userToBeDeleted = await _user.GetUser(userId);
            _user.Delete(userToBeDeleted);
            if (await _user.SaveAll()) { return Ok("User removed"); };
            return BadRequest("can not remove User");
        }


        [HttpGet("api/adduser/{userId}")]
        public async Task<IActionResult> getUser05Async(int userId)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)) return Unauthorized();

            User result = new User();
            result.Created = DateTime.Now;
            result.Username = "newUser";
          
            _user.Add(result);

            if (await _user.SaveAll())
            {
            var res = await _user.GetUser(result.UserId);
                 
            // add the initial photo to the user
            var photoDto = new PhotoForCreationDto();
            photoDto.Url = "https://res.cloudinary.com/marcelcloud/image/upload/v1559818775/user.png.jpg";
            photoDto.Description = "Initial picture";
            photoDto.PublicId = "";

            var photo = _special.mapToPhoto(photoDto);
            photo.user = res;
            photo.UserId = res.UserId;
            photo.IsMain = true;
            res.Photos.Add(photo);
            _user.Update(res);
            await _user.SaveAll();
                var resu = await _special.getUserforReturnDTOAsync(res);
                return CreatedAtRoute("getUser", new { userId, id = resu.userId }, res);
            };
            return BadRequest("can not add User");
        }

        [HttpGet("api/usersInHospital")]
        public async Task<IActionResult> getUser15Async([FromQuery] UserParams up)
        {
           if(up.selectedHospital == 0){
            return BadRequest("selectedhospital = 0");
           }
           
            var result = await _user.GetUsersInHospital(up);
            var userList = await _special.mapToListOfUserToReturn(result);

            Response.AddPagination(result.Currentpage,
            result.PageSize,
            result.TotalCount,
            result.TotalPages);

            return Ok(userList);
        }
      
        [HttpGet("api/currentCountryCode/{id}")]
        public async Task<IActionResult> getCC(int id){
            var result = await _user.GetCountryCodeFromUser(id);
          return Ok(result);
        }

    }

}