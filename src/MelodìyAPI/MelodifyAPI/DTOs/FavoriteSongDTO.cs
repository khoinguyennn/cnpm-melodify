namespace MelodifyAPI.DTOs
{
    public class FavoriteSongDto
    {
        public string Title { get; set; }
        public string ArtistName { get; set; }
        public string ImageUrl { get; set; }
        public string Url { get; set; }
        public DateTime FavoritedAt { get; set; }
    }


}
