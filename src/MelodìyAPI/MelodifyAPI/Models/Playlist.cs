using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MelodifyAPI.Models
{
    public class Playlist
    {
        [Key]
        public int PlaylistID { get; set; }

        [Required]
        public string Title { get; set; }
            
        public string Description { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        // Liên kết với User tạo Playlist
        [ForeignKey("UserID")]
        public int UserID { get; set; }

        // Navigation Property
        public ICollection<PlaylistSong> PlaylistSongs { get; set; }

        public string? ImageUrl { get; set; } // Thêm ImageUrl

    }
}
