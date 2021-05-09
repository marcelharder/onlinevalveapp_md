using System;
using System.Security.Claims;
using System.Threading.Tasks;
using api.DAL.Code;
using api.DAL.dtos;
using api.DAL.Interfaces;
using api.Helpers;
using DatingApp.API.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [ServiceFilter(typeof(LogUserActivity))]
    [ApiController]
    [Authorize]
    [Route("api/users/{userId}/[controller]")]
    public class MessagesController : ControllerBase
    {
        private IMessageRepository _repo;
        private IUserRepository _user;
        private SpecialMaps _special;
        public MessagesController(IMessageRepository repo, IUserRepository user, SpecialMaps special)
        {
            _repo = repo;
            _special = special;
            _user = user;
        }

        [HttpGet("{id}", Name = "GetMessage")]
        public async Task<IActionResult> GetMessage(int userId, int id)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            var messageFromRepo = await _repo.getMessage(id);
            if (messageFromRepo == null) return NotFound();
            var messageToReturn = await _special.mapTomessageToReturnFromMessage(messageFromRepo);
            return Ok(messageToReturn);
        }

        [HttpPost]
        public async Task<IActionResult> CreateMessage(int userId, [FromBody] MessageForCreationDTO messageForCreationDTO)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            messageForCreationDTO.SenderId = userId;
            var recipient = await _user.GetUser(messageForCreationDTO.RecipientId);
            if (recipient == null) return BadRequest("could not find user");
            var message = await _special.mapToMessageFromMessageForCreationDTOAsync(messageForCreationDTO);
            _repo.Add(message);

            if (await _repo.SaveAll())
            {
                MessageToReturnDto m = await _special.mapTomessageToReturnFromMessage(message);
                return CreatedAtRoute("GetMessage", new { userId, id = message.Id }, m);
            }
            throw new Exception("Creating the message failed on save");
        }

        [HttpGet]
        public async Task<IActionResult> GetMessagesForUser(int userId, [FromQuery] MessageParams messageParams)
        {
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            if (currentUserId != userId) return Unauthorized();

            messageParams.UserId = userId;

            var messagesFromRepo = await _repo.getMessagesForUser(messageParams);

            var messages = await _special.mapToListOfmessageToReturnFromListOfMessageAsync(messagesFromRepo);


            Response.AddPagination(messagesFromRepo.Currentpage,
              messagesFromRepo.PageSize,
              messagesFromRepo.TotalCount,
              messagesFromRepo.TotalPages);
            return Ok(messages);
        }


        [HttpGet("thread/{recipientId}")]
        public async Task<IActionResult> GetMessageThread(int userId, int recipientId)
        {
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            if (currentUserId != userId) return Unauthorized();

            var messagesFromRepo = await _repo.GetMessageThread(userId, recipientId);

            var messageThread = await _special.mapToListOfmessageToReturnFromListOfMessageAsync(messagesFromRepo);

            return Ok(messageThread);
        }

        [HttpPost("{id}")]
        public async Task<IActionResult> DeleteMessage(int id, int userId)
        {
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            if (currentUserId != userId) return Unauthorized();

            var messageFromRepo = await _repo.getMessage(id);

            if (messageFromRepo.SenderId == userId) { messageFromRepo.SenderDeleted = true; }
            if (messageFromRepo.RecipientId == userId) { messageFromRepo.RecipientDeleted = true; }

            if (messageFromRepo.SenderDeleted && messageFromRepo.RecipientDeleted)
            {
                _repo.Delete(messageFromRepo);
            }

            if (await _repo.SaveAll()) { return NoContent(); }

            throw new Exception("Error deleting");
        }

        [HttpPost("{id}/read")]
        public async Task<IActionResult> MarkMessageAsRead(int userId, int id)
        {
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            if (currentUserId != userId) return Unauthorized();

            var messageFromRepo = await _repo.getMessage(id);
            if (messageFromRepo.RecipientId != userId) return Unauthorized();

            messageFromRepo.IsRead = true;
            messageFromRepo.DateRead = DateTime.Now;

            await _repo.SaveAll();

            return NoContent();


        }

    }
}