using Microsoft.EntityFrameworkCore;
using MelodifyAPI.Models;

namespace MelodifyAPI.Data
{
    public class MelodifyContext : DbContext
    {
        public MelodifyContext(DbContextOptions<MelodifyContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Artist> Artists { get; set; }
        public DbSet<Song> Songs { get; set; }
        public DbSet<Playlist> Playlists { get; set; }
        public DbSet<PlaylistSong> Playlist_Songs { get; set; }
        public DbSet<Follow> Follows { get; set; }
        public DbSet<Favorite> Favorites { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<PlaylistSong>()
                .HasKey(ps => ps.PlaylistSongID);

            modelBuilder.Entity<PlaylistSong>()
                .HasOne(ps => ps.Playlist)
                .WithMany(p => p.PlaylistSongs)
                .HasForeignKey(ps => ps.PlaylistId);

            modelBuilder.Entity<PlaylistSong>()
                .HasOne(ps => ps.Song)
                .WithMany(s => s.Playlist_Songs)
                .HasForeignKey(ps => ps.SongId);

            modelBuilder.Entity<Follow>()
                .HasKey(f => new { f.UserID, f.ArtistID });
        }

    }
}
