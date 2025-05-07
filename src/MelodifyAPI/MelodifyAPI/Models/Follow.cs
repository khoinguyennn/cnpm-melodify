using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MelodifyAPI.Models
{
    public class Follow
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int FollowID { get; set; }

        [Required]
        public int UserID { get; set; }

        [Required]
        public int ArtistID { get; set; }

        public DateTime FollowedAt { get; set; }

        // Navigation properties
        [ForeignKey("UserID")]
        public User User { get; set; }

        [ForeignKey("ArtistID")]
        public Artist Artist { get; set; }
    }
}
