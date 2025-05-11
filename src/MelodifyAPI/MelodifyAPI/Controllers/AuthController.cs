using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using MelodifyAPI.Data;
using MelodifyAPI.Models;
using Microsoft.EntityFrameworkCore;
using MelodifyAPI.DTOs;

namespace MelodifyAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly MelodifyContext _context;
        private readonly IConfiguration _config;

        public AuthController(MelodifyContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        // Đăng ký
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDTO registerDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { message = ModelState.Values.SelectMany(v => v.Errors).First().ErrorMessage });

            // Kiểm tra email đã tồn tại chưa
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == registerDto.Email);
            if (existingUser != null)
            {
                return BadRequest(new { message = "Email đã được sử dụng." });
            }

            // Tạo User từ DTO
            var newUser = new User
            {
                DisplayName = registerDto.DisplayName,
                Email = registerDto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password),
                CreatedAt = DateTime.UtcNow,
                Role = "User" // Mặc định role là User
            };

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đăng ký thành công!" });
        }


    }
}
