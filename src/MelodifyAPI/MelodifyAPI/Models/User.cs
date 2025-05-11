namespace MelodifyAPI.Models
{
    public class User
    {
        public int UserID { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }  // Đổi từ Password thành PasswordHash
        public string DisplayName { get; set; }   // Đổi từ UserName thành DisplayName
        public DateTime CreatedAt { get; set; }
        public string Role { get; set; } = "User"; // Mặc định là User

        public string? ImageUrl { get; set; }


    }

}
