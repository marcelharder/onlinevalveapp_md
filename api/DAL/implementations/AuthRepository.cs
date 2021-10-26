using Microsoft.EntityFrameworkCore;
using api.DAL.Interfaces;
using System;
using System.Threading.Tasks;
using api.DAL.models;

namespace api.DAL.Implementations
{
    public class AuthRepository:IAuthRepository
    {

        private readonly dataContext _context;
        public AuthRepository(dataContext context)
        {
            _context = context;
        }
        public async Task<User> Login(string username, string password)
        {
            var user = await _context.Users.FirstOrDefaultAsync(x => x.Username == username);
            if (user == null) return null;
            if (!VerifyPassWordHash(password, user.PasswordHash, user.PasswordSalt)) return null;
            return user;
        }

        private bool VerifyPassWordHash(string password, byte[] passwordHash, byte[] passwordSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA1(passwordSalt))
            {
                var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                for (int i = 0; i < password.Length; i++)
                {
                    if (computedHash[i] != passwordHash[i]) return false;
                }
            };
            return true;
        }
       public async Task<string> updatePassword(User user, string password)
        {   
            byte[] passwordHash, passwordSalt;
            CreatePassWordHash(password, out passwordHash, out passwordSalt);
            user.PasswordHash = passwordHash;
            user.PasswordSalt = passwordSalt;
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
            return "updated";

        }
        public async Task<User> Register(User user, string password)
        {
            DateTime now = DateTime.UtcNow;
            byte[] passwordHash, passwordSalt;
            CreatePassWordHash(password, out passwordHash, out passwordSalt);
            user.PasswordHash = passwordHash;
            user.PasswordSalt = passwordSalt;
            user.Role = "normal";
            var help = new Photo();
            help.Url = "https://res.cloudinary.com/marcelcloud/image/upload/v1559818775/user.png.jpg";
            help.IsMain = true;
            
            user.Photos.Add(help);
            user.Created = now;

            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
            return user;
        }

        private void CreatePassWordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA1())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            };
        }

        public async Task<bool> UserExists(string username)
        {
            if (await _context.Users.AnyAsync(x => x.Username == username)) return true;
            return false;
        }

        public async Task<User> getUserByName(string username)
        {
            return await _context.Users.FirstOrDefaultAsync(x => x.Username == username);
        }

       
    }

}
