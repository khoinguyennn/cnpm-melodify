using MelodifyAPI.Models;

public class PlaylistSong
{
    public int PlaylistSongID { get; set; }
    public int PlaylistId { get; set; }
    public int SongId { get; set; }

    // Navigation properties
    public Playlist Playlist { get; set; }
    public Song Song { get; set; }
}
