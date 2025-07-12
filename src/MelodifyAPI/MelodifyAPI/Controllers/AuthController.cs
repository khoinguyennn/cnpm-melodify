using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using MelodifyAPI.Data;
using MelodifyAPI.Models;
using Microsoft.EntityFrameworkCore;
using MelodifyAPI.DTOs;
using Swashbuckle.AspNetCore.Annotations;

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

        // Đăng ký tài khoản
        [HttpPost("register")]
        [SwaggerOperation(
            Summary = "Đăng ký tài khoản",
            Description = "Tạo mới người dùng với email, mật khẩu và tên hiển thị."
        )]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(object))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(object))]
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


        // Đăng nhập tài khoản
        [HttpPost("login")]
        [SwaggerOperation(
            Summary = "Đăng nhập",
            Description = "Đăng nhập bằng email và mật khẩu. Trả về token JWT nếu thành công."
        )]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(object))]
        [ProducesResponseType(StatusCodes.Status401Unauthorized, Type = typeof(object))]
        public async Task<IActionResult> Login([FromBody] LoginDTO loginDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { message = ModelState.Values.SelectMany(v => v.Errors).First().ErrorMessage });

            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == loginDto.Email);
            if (existingUser == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, existingUser.PasswordHash))
                return Unauthorized(new { message = "Sai email hoặc mật khẩu." });

            // Tạo token JWT có chứa Role
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_config["Jwt:Key"]);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
    {
        new Claim(ClaimTypes.Name, existingUser.UserID.ToString()),
        new Claim("role", existingUser.Role) // Đảm bảo key là "role"
    }),
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);

            return Ok(new
            {
                message = "Đăng nhập thành công!",
                token = tokenString
            });
        }

    }
}
