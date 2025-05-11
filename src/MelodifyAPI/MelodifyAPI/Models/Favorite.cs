using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MelodifyAPI.Models
{
    public class Favorite
    {
        [Key]
        public int FavoriteID { get; set; }

        [Required]
        public int UserID { get; set; }

        [Required]
        public int SongID { get; set; }

        public DateTime FavoritedAt { get; set; } = DateTime.UtcNow;

        // ⚠ Không đặt Required vì khi thêm mới không cần
        public User? User { get; set; }
        public Song? Song { get; set; }
    }
}
