using System.ComponentModel.DataAnnotations;

namespace MelodifyAPI.Models
{
    public class Artist
    {
        [Key]
        public int ArtistID { get; set; }

        [Required]
        public string Name { get; set; }

        public string Bio { get; set; }

        public string ImageUrl { get; set; }

        public ICollection<Song> Songs { get; set; }

    }
}
