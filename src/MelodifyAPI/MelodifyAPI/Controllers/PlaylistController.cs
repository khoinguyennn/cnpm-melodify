using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MelodifyAPI.Data;
using MelodifyAPI.Models;
using MelodifyAPI.DTOs;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Swashbuckle.AspNetCore.Annotations;

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
        [SwaggerOperation(Summary = "Lấy danh sách tất cả Playlist", Description = "Công khai - trả về toàn bộ danh sách playlist")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<PlaylistDTO>>> GetAllPlaylists()
        {
            var playlists = await _context.Playlists
                .Select(p => new PlaylistDTO
                {
                    PlaylistID = p.PlaylistID,
                    UserID = p.UserID,
                    Title = p.Title,
                    Description = p.Description,
                    CreatedAt = p.CreatedAt,
                    ImageUrl = p.ImageUrl
                })
                .ToListAsync();
            return Ok(playlists);
        }

        // 2. Lấy chi tiết một Playlist theo ID (Công khai)
        [HttpGet("{id}")]
        [SwaggerOperation(Summary = "Lấy chi tiết Playlist", Description = "Công khai - lấy chi tiết Playlist theo ID")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<PlaylistDTO>> GetPlaylistById(int id)
        {
            var playlist = await _context.Playlists
                .Where(p => p.PlaylistID == id)
                .Select(p => new PlaylistDTO
                {
                    PlaylistID = p.PlaylistID,
                    UserID = p.UserID,
                    Title = p.Title,
                    Description = p.Description,
                    CreatedAt = p.CreatedAt,
                    ImageUrl = p.ImageUrl
                })
                .FirstOrDefaultAsync();

            if (playlist == null)
                return NotFound("Không tìm thấy Playlist.");

            return Ok(playlist);
        }


        // 3. Thêm Playlist (Yêu cầu đăng nhập)
        [HttpPost("add")]
        [Authorize]
        [SwaggerOperation(Summary = "Thêm Playlist", Description = "Chỉ người dùng đã đăng nhập có thể thêm Playlist")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> AddPlaylist([FromForm] PlaylistDTO playlistDto)
        {
            if (!ModelState.IsValid)
            {
                // Chỉ trả về các lỗi validation
                var errors = ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToList();
                return BadRequest(new { message = "Validation failed", errors });
            }

            // Lấy UserID từ token
            var userId = User.FindFirstValue(ClaimTypes.Name);
            if (userId == null)
                return Unauthorized(new { message = "Bạn cần đăng nhập." });

            string imageUrl = "/app-asset/img/default-playlist.jpg"; // Ảnh mặc định
            if (playlistDto.Image != null)
            {
                // Tạo tên file duy nhất
                string fileName = $"{Guid.NewGuid()}_{playlistDto.Image.FileName}";
                // Đường dẫn lưu file
                string filePath = Path.Combine("wwwroot", "uploads", "playlists", fileName);

                // Tạo thư mục nếu chưa tồn tại
                Directory.CreateDirectory(Path.GetDirectoryName(filePath));

                // Lưu file
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await playlistDto.Image.CopyToAsync(stream);
                }

                // Lưu đường dẫn tương đối
                imageUrl = $"/uploads/playlists/{fileName}";
            }

            var newPlaylist = new Playlist
            {
                Title = playlistDto.Title,
                Description = playlistDto.Description,
                UserID = int.Parse(userId),
                CreatedAt = DateTime.Now,
                ImageUrl = imageUrl
            };

            _context.Playlists.Add(newPlaylist);
            await _context.SaveChangesAsync();

            // Trả về thông tin playlist đã tạo
            return Ok(new
            {
                message = "Playlist đã được thêm!",
                playlist = new
                {
                    playlistID = newPlaylist.PlaylistID,
                    title = newPlaylist.Title,
                    description = newPlaylist.Description,
                    imageUrl = newPlaylist.ImageUrl,
                    createdAt = newPlaylist.CreatedAt,
                    userID = newPlaylist.UserID
                }
            });
        }


        // 4. Sửa Playlist (Chỉ chủ sở hữu hoặc Admin)
        [HttpPut("{id}")]
        [Authorize]
        [Consumes("multipart/form-data")]
        [SwaggerOperation(Summary = "Cập nhật Playlist", Description = "Chỉ chủ sở hữu hoặc Admin có thể sửa Playlist")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
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
        [SwaggerOperation(Summary = "Xóa Playlist", Description = "Chỉ chủ sở hữu hoặc Admin có thể xóa Playlist")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
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
        [SwaggerOperation(Summary = "Lấy Playlist cá nhân", Description = "Trả về danh sách Playlist của người dùng hiện tại")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<IEnumerable<PlaylistDTO>>> GetMyPlaylists()
        {
            // Lấy UserID từ token đăng nhập
            var userId = User.FindFirstValue(ClaimTypes.Name);
            if (userId == null)
                return Unauthorized(new { message = "Bạn cần đăng nhập." });

            // Lọc Playlist theo UserID và map đầy đủ thông tin
            var playlists = await _context.Playlists
                .Where(p => p.UserID == int.Parse(userId))
                .Select(p => new PlaylistDTO
                {
                    PlaylistID = p.PlaylistID,
                    UserID = p.UserID,
                    Title = p.Title,
                    Description = p.Description,
                    CreatedAt = p.CreatedAt,
                    ImageUrl = p.ImageUrl
                })
                .ToListAsync();

            return Ok(playlists);
        }

    }
}
