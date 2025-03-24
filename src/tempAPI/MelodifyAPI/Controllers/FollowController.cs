using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MelodifyAPI.Data;
using MelodifyAPI.Models;
using System.Security.Claims;

namespace MelodifyAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FollowController : ControllerBase
    {
        private readonly MelodifyContext _context;

        public FollowController(MelodifyContext context)
        {
            _context = context;
        }

        // 1. Lấy danh sách Nghệ sĩ đã theo dõi (Yêu cầu đăng nhập)
        [HttpGet("following")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<Artist>>> GetFollowedArtists()
        {
            // Lấy UserID từ token
            var userId = User.FindFirstValue(ClaimTypes.Name);
            if (userId == null)
                return Unauthorized("Bạn cần đăng nhập.");

            var followedArtists = await _context.Follows
                .Where(f => f.UserID == int.Parse(userId))
                .Include(f => f.Artist)
                .Select(f => f.Artist)
                .ToListAsync();

            if (followedArtists == null || followedArtists.Count == 0)
                return NotFound("Bạn chưa theo dõi Nghệ sĩ nào.");

            return Ok(followedArtists);
        }

        // 2. Theo dõi Nghệ sĩ (Yêu cầu đăng nhập)
        [HttpPost("follow/{artistId}")]
        [Authorize]
        public async Task<IActionResult> FollowArtist(int artistId)
        {
            // Lấy UserID từ token
            var userId = User.FindFirstValue(ClaimTypes.Name);
            if (userId == null)
                return Unauthorized("Bạn cần đăng nhập.");

            // Kiểm tra Artist có tồn tại không
            var artist = await _context.Artists.FindAsync(artistId);
            if (artist == null)
                return NotFound("Không tìm thấy Nghệ sĩ.");

            // Kiểm tra đã theo dõi chưa
            var existingFollow = await _context.Follows
                .FirstOrDefaultAsync(f => f.UserID == int.Parse(userId) && f.ArtistID == artistId);

            if (existingFollow != null)
                return BadRequest("Bạn đã theo dõi Nghệ sĩ này.");

            var newFollow = new Follow
            {
                UserID = int.Parse(userId),
                ArtistID = artistId,
                FollowedAt = DateTime.Now
            };

            _context.Follows.Add(newFollow);
            await _context.SaveChangesAsync();
            return Ok("Đã theo dõi Nghệ sĩ thành công!");
        }

        // 3. Bỏ theo dõi Nghệ sĩ (Yêu cầu đăng nhập)
        [HttpDelete("unfollow/{artistId}")]
        [Authorize]
        public async Task<IActionResult> UnfollowArtist(int artistId)
        {
            // Lấy UserID từ token
            var userId = User.FindFirstValue(ClaimTypes.Name);
            if (userId == null)
                return Unauthorized("Bạn cần đăng nhập.");

            var follow = await _context.Follows
                .FirstOrDefaultAsync(f => f.UserID == int.Parse(userId) && f.ArtistID == artistId);

            if (follow == null)
                return NotFound("Bạn chưa theo dõi Nghệ sĩ này.");

            _context.Follows.Remove(follow);
            await _context.SaveChangesAsync();

            return Ok("Đã bỏ theo dõi Nghệ sĩ thành công!");
        }
    }
}
