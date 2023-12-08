
using System.Collections.Generic;
using System.Threading.Tasks;
using api.DAL.dtos;
using api.DAL.models;
using api.Helpers;

namespace api.DAL.Interfaces
{
public interface IUserRepository
    {
        Task<PagedList<User>> GetUsers(UserParams userParams);
        Task<User> GetUser(int id);
        Task<bool> SaveAll();

         void Update<T>(T entity) where T : class;
        void Delete<T>(T entity) where T : class;
        Task<Photo> GetPhoto(int id);
        Task<Photo> GetMainPhotoForUser(int id);
        void Add<T>(T entity) where T : class;
       
        User findCurrentUser(UserForUpdate cv);

         Task<PagedList<User>> GetUsersInHospital(UserParams userParams);

         Task<string> GetCountryCodeFromUser(int userId);
        Task<User> GetUserFromName(string name);
    }
}