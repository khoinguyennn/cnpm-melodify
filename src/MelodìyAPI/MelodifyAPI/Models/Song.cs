using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MelodifyAPI.Models
{
    public class Song
    {
        [Key]
        public int SongID { get; set; }

        [Required]
        public string Title { get; set; }

        // Khóa ngoại cho Artist
        [Required]
        public int ArtistID { get; set; }  // Thêm ArtistID để lưu khóa ngoại

        // Navigation Property cho Artist
        [ForeignKey("ArtistID")]
        public Artist Artist { get; set; }

        public string Album { get; set; }

        public string Genre { get; set; }

        [Required]
        public string Url { get; set; }

        public DateTime ReleaseDate { get; set; }

        // Navigation Property
        public ICollection<PlaylistSong> Playlist_Songs { get; set; }
        public ICollection<Favorite> Favorites { get; set; }
        public string? ImageUrl { get; set; }

    }
}
