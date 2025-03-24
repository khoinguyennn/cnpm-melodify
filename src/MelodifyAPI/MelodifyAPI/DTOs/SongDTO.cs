using Microsoft.AspNetCore.Mvc;

namespace MelodifyAPI.DTOs
{
    public class SongDTO
    {
        public int SongID { get; set; }
        [FromForm]
        public string Title { get; set; }
        [FromForm]
        public int ArtistID { get; set; }
        public string ArtistName { get; set; }  // Tên nghệ sĩ
        [FromForm]
        public string Album { get; set; }
        [FromForm]
        public string Genre { get; set; }
        public string Url { get; set; }
        [FromForm]
        public DateTime ReleaseDate { get; set; }

        public string? ImageUrl { get; set; }

    }
}
