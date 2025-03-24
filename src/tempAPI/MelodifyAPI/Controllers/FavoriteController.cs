using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MelodifyAPI.Data;
using MelodifyAPI.Models;
using System;
using System.Linq;
using System.Threading.Tasks;
using MelodifyAPI.DTOs;

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
        public IActionResult GetUserFavoriteSongs(int userId)
        {
            var favoriteSongs = _context.Favorites
                .Where(f => f.UserID == userId)
                .Include(f => f.Song)
                .ThenInclude(s => s.Artist)
                .Select(f => new FavoriteSongDto
                {
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
        [HttpPost]
        public async Task<IActionResult> AddFavorite([FromBody] Favorite favorite)
        {
            if (favorite == null || favorite.UserID == 0 || favorite.SongID == 0)
            {
                return BadRequest("UserID và SongID không được để trống.");
            }

            var userExists = await _context.Users.AnyAsync(u => u.UserID == favorite.UserID);
            var songExists = await _context.Songs.AnyAsync(s => s.SongID == favorite.SongID);

            if (!userExists)
                return NotFound("Người dùng không tồn tại.");
            if (!songExists)
                return NotFound("Bài hát không tồn tại.");

            var existingFavorite = await _context.Favorites
                .FirstOrDefaultAsync(f => f.UserID == favorite.UserID && f.SongID == favorite.SongID);

            if (existingFavorite != null)
                return BadRequest("Bài hát đã có trong danh sách yêu thích.");

            var newFavorite = new Favorite
            {
                UserID = favorite.UserID,
                SongID = favorite.SongID,
                FavoritedAt = DateTime.UtcNow
            };

            _context.Favorites.Add(newFavorite);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUserFavoriteSongs), new { userId = newFavorite.UserID }, newFavorite);
        }

        /// <summary>
        /// Xóa một bài hát khỏi danh sách yêu thích
        /// </summary>
        [HttpDelete("{userId}/{songId}")]
        public async Task<IActionResult> RemoveFavorite(int userId, int songId)
        {
            var favorite = await _context.Favorites
                .FirstOrDefaultAsync(f => f.UserID == userId && f.SongID == songId);

            if (favorite == null)
                return NotFound("Bài hát không có trong danh sách yêu thích.");

            _context.Favorites.Remove(favorite);
            await _context.SaveChangesAsync();

            return Ok("Đã xóa khỏi danh sách yêu thích.");
        }
    }
}
