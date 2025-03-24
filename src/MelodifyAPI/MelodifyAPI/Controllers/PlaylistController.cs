using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MelodifyAPI.Data;
using MelodifyAPI.Models;
using MelodifyAPI.DTOs;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace MelodifyAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PlaylistController : ControllerBase
    {
        private readonly MelodifyContext _context;

        public PlaylistController(MelodifyContext context)
        {
            _context = context;
        }


        // 1. Lấy danh sách tất cả Playlist (Công khai)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PlaylistDTO>>> GetAllPlaylists()
        {
            var playlists = await _context.Playlists
                .Select(p => new PlaylistDTO
                {
                    Title = p.Title,
                    Description = p.Description,
                    ImageUrl = p.ImageUrl // Thêm ImageUrl
                })
                .ToListAsync();
            return Ok(playlists);
        }

        // 2. Lấy chi tiết một Playlist theo ID (Công khai)
        [HttpGet("{id}")]
        public async Task<ActionResult<PlaylistDTO>> GetPlaylistById(int id)
        {
            var playlist = await _context.Playlists
                .Where(p => p.PlaylistID == id)
                .Select(p => new PlaylistDTO
                {
                    Title = p.Title,
                    Description = p.Description,
                    ImageUrl = p.ImageUrl // Thêm ImageUrl
                })
                .FirstOrDefaultAsync();

            if (playlist == null)
                return NotFound("Không tìm thấy Playlist.");

            return Ok(playlist);
        }


        // 3. Thêm Playlist (Yêu cầu đăng nhập)
        [HttpPost("add")]
        [Authorize]
        public async Task<IActionResult> AddPlaylist([FromBody] PlaylistDTO playlistDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Lấy UserID từ token
            var userId = User.FindFirstValue(ClaimTypes.Name);
            if (userId == null)
                return Unauthorized("Bạn cần đăng nhập.");

            var newPlaylist = new Playlist
            {
                Title = playlistDto.Title,
                Description = playlistDto.Description,
                UserID = int.Parse(userId),
                CreatedAt = DateTime.Now,
                ImageUrl = playlistDto.ImageUrl // Thêm ImageUrl
            };

            _context.Playlists.Add(newPlaylist);
            await _context.SaveChangesAsync();
            return Ok("Playlist đã được thêm!");
        }


        // 4. Sửa Playlist (Chỉ chủ sở hữu hoặc Admin)
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdatePlaylist(int id, [FromBody] PlaylistDTO updatedPlaylistDto)
        {
            var userId = User.FindFirstValue(ClaimTypes.Name);
            if (userId == null)
                return Unauthorized("Bạn cần đăng nhập.");

            var playlist = await _context.Playlists.FindAsync(id);
            if (playlist == null)
                return NotFound("Không tìm thấy Playlist.");

            // Kiểm tra nếu user không phải chủ sở hữu playlist và không phải admin
            if (playlist.UserID != int.Parse(userId) && !User.IsInRole("Admin"))
                return Forbid("Bạn không có quyền sửa Playlist này.");

            // Cập nhật thông tin Playlist
            playlist.Title = updatedPlaylistDto.Title;
            playlist.Description = updatedPlaylistDto.Description;
            playlist.ImageUrl = updatedPlaylistDto.ImageUrl;

            await _context.SaveChangesAsync();
            return Ok("Đã cập nhật Playlist thành công!");
        }




        // 5. Xóa Playlist (Chỉ chủ sở hữu hoặc Admin)
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeletePlaylist(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.Name);
            if (userId == null)
                return Unauthorized("Bạn cần đăng nhập.");

            var playlist = await _context.Playlists.FindAsync(id);
            if (playlist == null)
                return NotFound("Không tìm thấy Playlist.");

            // Kiểm tra nếu user không phải chủ sở hữu playlist và không phải admin
            if (playlist.UserID != int.Parse(userId) && !User.IsInRole("Admin"))
                return Forbid("Bạn không có quyền xóa Playlist này.");

            _context.Playlists.Remove(playlist);
            await _context.SaveChangesAsync();

            return Ok("Đã xóa Playlist thành công!");
        }


        // 6. Lấy danh sách Playlist của người dùng đang đăng nhập
        [HttpGet("my")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<PlaylistDTO>>> GetMyPlaylists()
        {
            // Lấy UserID từ token đăng nhập
            var userId = User.FindFirstValue(ClaimTypes.Name);
            if (userId == null)
                return Unauthorized("Bạn cần đăng nhập.");

            // Lọc Playlist theo UserID
            var playlists = await _context.Playlists
                .Where(p => p.UserID == int.Parse(userId))
                .Select(p => new PlaylistDTO
                {
                    Title = p.Title,
                    Description = p.Description,
                    ImageUrl = p.ImageUrl
                })
                .ToListAsync();

            return Ok(playlists);
        }

    }
}
