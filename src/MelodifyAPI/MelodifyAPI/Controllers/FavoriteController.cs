using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MelodifyAPI.Data;
using MelodifyAPI.Models;
using System;
using System.Linq;
using System.Threading.Tasks;
using MelodifyAPI.DTOs;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Swashbuckle.AspNetCore.Annotations;

namespace MelodifyAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FavoriteController : ControllerBase
    {
        private readonly MelodifyContext _context;

        public FavoriteController(MelodifyContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Lấy danh sách bài hát yêu thích của một người dùng
        /// </summary>
        [HttpGet("{userId}")]
        [SwaggerOperation(Summary = "Lấy danh sách yêu thích", Description = "Lấy tất cả bài hát yêu thích của người dùng theo ID")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult GetUserFavoriteSongs(int userId)
        {
            var favoriteSongs = _context.Favorites
                .Where(f => f.UserID == userId)
                .Include(f => f.Song)
                .ThenInclude(s => s.Artist)
                .Select(f => new FavoriteSongDto
                {
                    SongID = f.Song.SongID,
                    Title = f.Song.Title,
                    ArtistName = f.Song.Artist.Name,
                    ImageUrl = f.Song.ImageUrl, // Thêm hình ảnh bài hát
                    Url = f.Song.Url,           // Thêm URL bài hát
                    FavoritedAt = f.FavoritedAt
                })
                .ToList();

            if (!favoriteSongs.Any())
            {
                return NotFound(new { message = "Người dùng này chưa có bài hát yêu thích nào." });
            }

            return Ok(favoriteSongs);
        }

        /// <summary>
        /// Thêm một bài hát vào danh sách yêu thích
        /// </summary>
        [Authorize]
        [HttpPost("{songId}")]
        [SwaggerOperation(Summary = "Thêm bài hát yêu thích", Description = "Người dùng đăng nhập có thể thêm bài hát vào danh sách yêu thích")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> AddFavorite(int songId)
        {
            // Lấy UserID từ token
            var userId = User.FindFirstValue(ClaimTypes.Name);
            if (userId == null)
                return Unauthorized(new { message = "Bạn cần đăng nhập." });

            // Kiểm tra bài hát có tồn tại không
            var songExists = await _context.Songs.AnyAsync(s => s.SongID == songId);
            if (!songExists)
                return NotFound(new { message = "Bài hát không tồn tại." });

            // Kiểm tra đã yêu thích chưa
            var existingFavorite = await _context.Favorites
                .FirstOrDefaultAsync(f => f.UserID == int.Parse(userId) && f.SongID == songId);

            if (existingFavorite != null)
                return BadRequest(new { message = "Bài hát đã có trong danh sách yêu thích." });

            var newFavorite = new Favorite
            {
                UserID = int.Parse(userId),
                SongID = songId,
                FavoritedAt = DateTime.UtcNow
            };

            _context.Favorites.Add(newFavorite);
            await _context.SaveChangesAsync();

            return Ok(new { 
                message = "Đã thêm vào danh sách yêu thích.",
                data = new {
                    userId = newFavorite.UserID,
                    songId = newFavorite.SongID,
                    favoritedAt = newFavorite.FavoritedAt
                }
            });
        }

        /// <summary>
        /// Xóa một bài hát khỏi danh sách yêu thích
        /// </summary>
        [Authorize]
        [HttpDelete("{songId}")]
        [SwaggerOperation(Summary = "Xóa bài hát yêu thích", Description = "Người dùng đăng nhập có thể xóa bài hát khỏi danh sách yêu thích")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> RemoveFavorite(int songId)
        {
            // Lấy UserID từ token
            var userId = User.FindFirstValue(ClaimTypes.Name);
            if (userId == null)
                return Unauthorized(new { message = "Bạn cần đăng nhập." });

            var favorite = await _context.Favorites
                .FirstOrDefaultAsync(f => f.UserID == int.Parse(userId) && f.SongID == songId);

            if (favorite == null)
                return NotFound(new { message = "Bài hát không có trong danh sách yêu thích." });

            _context.Favorites.Remove(favorite);
            await _context.SaveChangesAsync();

            return Ok(new { 
                message = "Đã xóa khỏi danh sách yêu thích.",
                data = new {
                    userId = favorite.UserID,
                    songId = favorite.SongID,
                    favoritedAt = favorite.FavoritedAt
                }
            });
        }

        [Authorize]
        [HttpGet("check/{songId}")]
        [SwaggerOperation(Summary = "Kiểm tra yêu thích", Description = "Trả về true/false nếu bài hát có/không trong danh sách yêu thích của người dùng hiện tại")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> CheckFavorite(int songId)
        {
            var userId = User.FindFirstValue(ClaimTypes.Name);
            if (userId == null)
                return Unauthorized(new { message = "Bạn cần đăng nhập." });

            var isFavorite = await _context.Favorites
                .AnyAsync(f => f.UserID == int.Parse(userId) && f.SongID == songId);

            return Ok(isFavorite);
        }
    }
}
