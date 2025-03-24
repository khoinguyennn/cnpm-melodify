using System.ComponentModel.DataAnnotations;

namespace MelodifyAPI.DTOs
{
    public class RegisterUserDTO
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }

        [Required]
        public string DisplayName { get; set; }

        [Required]
        public string Role { get; set; }

        public IFormFile? ImageFile { get; set; }
    }
}
