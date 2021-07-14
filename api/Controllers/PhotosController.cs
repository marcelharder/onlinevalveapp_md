using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using api.DAL.Code;
using api.DAL.dtos;
using api.DAL.Interfaces;
using api.DAL.models;
using api.Helpers;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/users/{userId}/photos")]
    public class PhotosController : ControllerBase
    {
        private readonly IUserRepository _repo;
        private readonly IOptions<CloudinarySettings> _cloudinaryConfig;
        private Cloudinary _cloudinary;

        private SpecialMaps _special;

        public PhotosController(
            IUserRepository repo,
            SpecialMaps special,
            IOptions<CloudinarySettings> cloudinaryConfig)
        {
            _repo = repo;
            _special = special;
            _cloudinaryConfig = cloudinaryConfig;

            Account acc = new Account(
             _cloudinaryConfig.Value.CloudName,
             _cloudinaryConfig.Value.ApiKey,
             _cloudinaryConfig.Value.ApiSecret
         );
            _cloudinary = new Cloudinary(acc);
        }
         
         


        [HttpGet("{id}", Name = "GetPhoto")]
        public async Task<IActionResult> GetPhoto(int id)
        {
            Photo photoFromRepo = await _repo.GetPhoto(id);
            var photo = _special.mapToPhotoForReturn(photoFromRepo);
            return Ok(photo);
        }

        [HttpPost("{id}")]
        public async Task<IActionResult> AddPhotoForUser(int userId, [FromForm]PhotoForCreationDto photoDto)
        {
            var user = await _repo.GetUser(userId);
            if (user == null) return BadRequest("Could not find user");
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            if (currentUserId != user.UserId) return Unauthorized();
            var file = photoDto.File;
            var uploadResult = new ImageUploadResult();
            if (file.Length > 0)
            {
                using (var stream = file.OpenReadStream())
                {
                    var uploadParams = new ImageUploadParams()
                    {
                        File = new FileDescription(file.Name, stream),
                        Transformation = new Transformation().Width(500).Height(500).Crop("fill").Gravity("face")
                    };
                    uploadResult = _cloudinary.Upload(uploadParams);
                }
            }
            photoDto.Url = uploadResult.Uri.ToString();
            photoDto.PublicId = uploadResult.PublicId;

            var photo = _special.mapToPhoto(photoDto);
            photo.user = user;
            photo.UserId = user.UserId;

            if (!user.Photos.Any(m => m.IsMain)) photo.IsMain = true;

            user.Photos.Add(photo);

            if (await _repo.SaveAll())
            {
                PhotoForReturnDto pfr = _special.mapToPhotoForReturn(photo);
                return CreatedAtRoute("GetPhoto", new { userId = userId, id = photo.Id }, pfr);
            }
            return BadRequest("Could not add photo");
        }

        [HttpPost("{id}/setMain")]
        public async Task<IActionResult> SetMainPhoto(int userId, int id)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var user = await _repo.GetUser(userId);
            if(!user.Photos.Any(p => p.Id == id)) return Unauthorized();

            var photoFromRepo = await _repo.GetPhoto(id);

            if (photoFromRepo == null)
                return NotFound();

            if (photoFromRepo.IsMain)
                return BadRequest("This is already the main photo");

            var currentMainPhoto = await _repo.GetMainPhotoForUser(userId);
            if (currentMainPhoto != null)
            {
                currentMainPhoto.IsMain = false;
                photoFromRepo.IsMain = true;
            }

            if (await _repo.SaveAll())
                return NoContent();

            return BadRequest("Could not set photo to main");

        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePhoto(int userId, int id)
        {

            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var photoFromRepo = await _repo.GetPhoto(id);

            if (photoFromRepo == null)
                return NotFound();

            if (photoFromRepo.IsMain)
                return BadRequest("You cannot delete the main photo");

           
            if (photoFromRepo.PublicId != null)
            {
                // delete the photo from two locations
                var deleteParams = new DeletionParams(photoFromRepo.PublicId);
                var result = _cloudinary.Destroy(deleteParams);

                if (result.Result == "ok")
                { // this is a good delete from cloudinary
                    _repo.Delete(photoFromRepo);
                }
            }
            else { _repo.Delete(photoFromRepo); } // can be removed in production

            if (await _repo.SaveAll()) return Ok();

            return BadRequest();
        }
    }
}