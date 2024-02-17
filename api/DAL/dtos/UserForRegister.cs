using System.ComponentModel.DataAnnotations;

namespace api.DAL.dtos
{
    public class UserForRegister
    {
        [Required]
        public string username { get; set; }

        [Required]
        [StringLength(12, MinimumLength = 4, ErrorMessage = "Password should be minimum 4 and max 12 char")]
        public string password { get; set; }

    }
}
