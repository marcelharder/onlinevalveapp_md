using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DAL.Interfaces;
using api.DAL.models;
using api.Helpers;
using DatingApp.API.Helpers;
using Microsoft.EntityFrameworkCore;

namespace api.DAL.Implementations
{
    public class MessageRepository : IMessageRepository
    {
        private dataContext _context;
        public MessageRepository(dataContext context)
        {
            _context = context;
        }
        public void Add<T>(T entity) where T : class
        {
            _context.Add(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
            _context.Remove(entity);
        }

        public async Task<bool> SaveAll()
        {
            return await _context.SaveChangesAsync() > 0;
        }
        public async Task<Message> getMessage(int id)
        {

            return await _context.Messages.FirstOrDefaultAsync(m => m.Id == id);

        }

        public async Task<PagedList<Message>> getMessagesForUser(MessageParams messageParams)
        {
            var messages = _context.Messages
            .Include(u => u.Sender).Include(u => u.Recipient).AsQueryable();

            switch (messageParams.MessageContainer)
            {
                case "Inbox": messages = messages.Where(u => u.RecipientId == messageParams.UserId && u.RecipientDeleted == false); break;
                case "Outbox": messages = messages.Where(u => u.SenderId == messageParams.UserId && u.SenderDeleted == false); break;
                default: messages = messages.Where(u => u.RecipientId == messageParams.UserId && u.RecipientDeleted == false && u.IsRead == false); break;
            }
            messages = messages.OrderByDescending(d => d.MessageSent);
            
            return await PagedList<Message>.CreateAsync(messages, messageParams.PageNumber, messageParams.PageSize);
        }

        public async Task<IEnumerable<Message>> GetMessageThread(int userId, int recipientId)
        {
            var messages = await _context.Messages
            .Include(u => u.Sender)
            .Include(u => u.Recipient)
            .Where(m => (m.RecipientId == userId && m.RecipientDeleted == false 
            && m.SenderId == recipientId) 
            || (m.RecipientId == recipientId && m.SenderId == userId 
            && m.SenderDeleted == false))
            .OrderByDescending(m => m.MessageSent)
            .ToListAsync();
            return messages;
        }
    }
}