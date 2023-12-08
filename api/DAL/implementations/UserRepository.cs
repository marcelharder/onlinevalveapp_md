using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DAL.Code;
using api.DAL.dtos;
using api.DAL.Interfaces;
using api.DAL.models;
using api.Helpers;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace api.DAL.Implementations
{
    public class UserRepository : IUserRepository
    {

        private dataContext _context;
        private SpecialMaps _sp;
        public UserRepository(dataContext context, SpecialMaps sp)
        {
            _context = context;
            _sp = sp;
        }

        public async Task<User> GetUser(int id)
        {
            var result = await _context.Users.Include(p => p.Photos).FirstOrDefaultAsync(u => u.UserId == id);
            return result;
        }
        public async Task<PagedList<User>> GetUsers(UserParams userParams)
        {
           // List<UserForReturnDTO> ufr = new List<UserForReturnDTO>();
            var users = _context.Users.Include(u => u.Photos).AsQueryable();
            return await PagedList<User>.CreateAsync(users, userParams.PageNumber, userParams.PageSize);
        }
         public void Update<T>(T entity) where T : class
        {
             _context.Update(entity);
        }
        public async Task<bool> SaveAll() { return await _context.SaveChangesAsync() > 0; }
        public void Delete<T>(T entity) where T : class { _context.Remove(entity); }
        public async Task<Photo> GetPhoto(int id)
        {
            var help = await _context.Photos.FirstOrDefaultAsync(p => p.Id == id);
            return help;

        }
        public async Task<Photo> GetMainPhotoForUser(int userId)
        {
            return await _context.Photos.Where(u => u.UserId == userId).FirstOrDefaultAsync(p => p.IsMain);
        }
       
        public User findCurrentUser(UserForUpdate cv)
        {
            User ret = new User();
            var users = _context.Users.OrderByDescending(u => u.UserId).AsQueryable();
            users = users.Where(x => x.Username == cv.name);
            users = users.Where(x => x.Role == cv.Role);
            users = users.Where(x => x.Gender == cv.Gender);
            users = users.Where(x => x.Email == cv.email);

            foreach (User s in users) { if (s != null){ ret = s;} }
            return ret;
        }
        public void Add<T>(T entity) where T : class
        {
            _context.Add(entity);
        }

        public async Task<PagedList<User>> GetUsersInHospital(UserParams userParams)
        {
           // List<UserForReturnDTO> ufr = new List<UserForReturnDTO>();
            var users = _context.Users.Include(u => u.Photos).AsQueryable();
            users = users.Where(a => a.hospital_id == userParams.selectedHospital);

            return await PagedList<User>.CreateAsync(
                users, userParams.PageNumber, userParams.PageSize);
        }

        public async Task<string> GetCountryCodeFromUser(int userId)
        {
            var currentUser = await _context.Users.FirstOrDefaultAsync(x => x.UserId == userId);

            return _sp.getCountryIDFromISO(currentUser.Country);
        }

        public async Task<User> GetUserFromName(string name)
        {
            var currentUser = await _context.Users.FirstOrDefaultAsync(x => x.Username == name);
            return currentUser;
        }
    }
}