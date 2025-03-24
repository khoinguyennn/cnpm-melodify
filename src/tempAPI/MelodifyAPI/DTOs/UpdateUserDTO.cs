using System.ComponentModel.DataAnnotations;

namespace MelodifyAPI.DTOs
{
    public class UpdateUserDTO
    {
        [Required]
        public string DisplayName { get; set; }

        [Required]
        public string Role { get; set; }

        public IFormFile? ImageFile { get; set; }
    }
}
