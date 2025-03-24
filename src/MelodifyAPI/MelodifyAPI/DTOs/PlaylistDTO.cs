namespace MelodifyAPI.DTOs
{
    public class PlaylistDTO
    {
        public int PlaylistID { get; set; }
        public int UserID { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? ImageUrl { get; set; } // Thêm ImageUrl
    }

}
