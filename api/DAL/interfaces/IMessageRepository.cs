using System.Collections.Generic;
using System.Threading.Tasks;
using api.DAL.models;
using api.Helpers;
using DatingApp.API.Helpers;

namespace api.DAL.Interfaces
{
    public interface IMessageRepository
    {
        Task<Message> getMessage(int id);
        Task<PagedList<Message>> getMessagesForUser(MessageParams mp);
        Task<IEnumerable<Message>> GetMessageThread(int userId, int recipientId);
        void Add<T>(T entity) where T : class;
        void Delete<T>(T entity) where T : class;
        Task<bool> SaveAll();
    }
}