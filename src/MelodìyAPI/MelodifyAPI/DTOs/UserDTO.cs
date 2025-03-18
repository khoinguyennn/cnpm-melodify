namespace MelodifyAPI.DTOs
{
    public class UserDTO
    {
        public int UserID { get; set; }
        public string Email { get; set; }
        public string DisplayName { get; set; }
        public DateTime CreatedAt { get; set; }
        public string Role { get; set; }
        public string? ImageUrl { get; set; }
    }
}
