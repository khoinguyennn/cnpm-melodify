using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MelodifyAPI.Data;
using MelodifyAPI.Models;
using MelodifyAPI.DTOs;
using Swashbuckle.AspNetCore.Annotations;

namespace MelodifyAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PlaylistSongController : ControllerBase
    {
        private readonly MelodifyContext _context;

        public PlaylistSongController(MelodifyContext context)
        {
            _context = context;
        }

        // 1. Lấy danh sách bài hát trong Playlist
        [HttpGet("{playlistId}")]
        [SwaggerOperation(Summary = "Lấy bài hát trong Playlist", Description = "Trả về danh sách các bài hát thuộc một playlist cụ thể")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<IEnumerable<SongDTO>>> GetSongsInPlaylist(int playlistId)
        {
            var songs = await _context.Playlist_Songs
                .Where(ps => ps.PlaylistId == playlistId)
                .Include(ps => ps.Song)
                    .ThenInclude(s => s.Artist)  // Include thông tin Artist
                .Select(ps => new SongDTO
                {
                    SongID = ps.Song.SongID,
                    Title = ps.Song.Title,
                    ArtistID = ps.Song.ArtistID,
                    ArtistName = ps.Song.Artist.Name,  // Lấy tên nghệ sĩ
                    Album = ps.Song.Album,
                    Genre = ps.Song.Genre,
                    Url = ps.Song.Url,
                    ReleaseDate = ps.Song.ReleaseDate,
                    ImageUrl = ps.Song.ImageUrl
                })
                .ToListAsync();

            if (songs == null || songs.Count == 0)
                return NotFound("Không có bài hát trong Playlist này.");

            return Ok(songs);
        }

        // 2. Thêm bài hát vào Playlist (Yêu cầu đăng nhập)
        [HttpPost("add")]
        [Authorize]
        [SwaggerOperation(Summary = "Thêm bài hát vào Playlist", Description = "Yêu cầu người dùng đã đăng nhập")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> AddSongToPlaylist(int playlistId, int songId)
        {
            // Kiểm tra Playlist có tồn tại không
            var playlist = await _context.Playlists.FindAsync(playlistId);
            if (playlist == null)
                return NotFound("Không tìm thấy Playlist.");

            // Kiểm tra bài hát có tồn tại không
            var song = await _context.Songs.FindAsync(songId);
            if (song == null)
                return NotFound("Không tìm thấy bài hát.");

            // Kiểm tra bài hát đã có trong Playlist chưa
            var existingEntry = await _context.Playlist_Songs
                .FirstOrDefaultAsync(ps => ps.PlaylistId == playlistId && ps.SongId == songId);

            if (existingEntry != null)
                return BadRequest("Bài hát đã có trong Playlist.");

            var newPlaylistSong = new PlaylistSong
            {
                PlaylistId = playlistId,
                SongId = songId
            };

            _context.Playlist_Songs.Add(newPlaylistSong);
            await _context.SaveChangesAsync();

            return Ok("Đã thêm bài hát vào Playlist thành công!");
        }

        // 3. Xóa bài hát khỏi Playlist (Yêu cầu đăng nhập)
        [HttpDelete("remove")]
        [Authorize]
        [SwaggerOperation(Summary = "Xóa bài hát khỏi Playlist", Description = "Yêu cầu người dùng đã đăng nhập")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> RemoveSongFromPlaylist(int playlistId, int songId)
        {
            var playlistSong = await _context.Playlist_Songs
                .FirstOrDefaultAsync(ps => ps.PlaylistId == playlistId && ps.SongId == songId);

            if (playlistSong == null)
                return NotFound("Không tìm thấy bài hát trong Playlist.");

            _context.Playlist_Songs.Remove(playlistSong);
            await _context.SaveChangesAsync();

            return Ok("Đã xóa bài hát khỏi Playlist thành công!");
        }
    }
}
