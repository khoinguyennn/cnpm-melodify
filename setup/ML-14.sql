USE [master]
GO
/****** Object:  Database [Melodify]    Script Date: 04/03/2025 20:25:14 ******/
CREATE DATABASE [Melodify] ON  PRIMARY 
( NAME = N'Melodify', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL10_50.MSSQLSERVER\MSSQL\DATA\Melodify.mdf' , SIZE = 2304KB , MAXSIZE = UNLIMITED, FILEGROWTH = 1024KB )
 LOG ON 
( NAME = N'Melodify_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL10_50.MSSQLSERVER\MSSQL\DATA\Melodify_log.LDF' , SIZE = 504KB , MAXSIZE = 2048GB , FILEGROWTH = 10%)
GO
ALTER DATABASE [Melodify] SET COMPATIBILITY_LEVEL = 100
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [Melodify].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [Melodify] SET ANSI_NULL_DEFAULT OFF
GO
ALTER DATABASE [Melodify] SET ANSI_NULLS OFF
GO
ALTER DATABASE [Melodify] SET ANSI_PADDING OFF
GO
ALTER DATABASE [Melodify] SET ANSI_WARNINGS OFF
GO
ALTER DATABASE [Melodify] SET ARITHABORT OFF
GO
ALTER DATABASE [Melodify] SET AUTO_CLOSE ON
GO
ALTER DATABASE [Melodify] SET AUTO_CREATE_STATISTICS ON
GO
ALTER DATABASE [Melodify] SET AUTO_SHRINK OFF
GO
ALTER DATABASE [Melodify] SET AUTO_UPDATE_STATISTICS ON
GO
ALTER DATABASE [Melodify] SET CURSOR_CLOSE_ON_COMMIT OFF
GO
ALTER DATABASE [Melodify] SET CURSOR_DEFAULT  GLOBAL
GO
ALTER DATABASE [Melodify] SET CONCAT_NULL_YIELDS_NULL OFF
GO
ALTER DATABASE [Melodify] SET NUMERIC_ROUNDABORT OFF
GO
ALTER DATABASE [Melodify] SET QUOTED_IDENTIFIER OFF
GO
ALTER DATABASE [Melodify] SET RECURSIVE_TRIGGERS OFF
GO
ALTER DATABASE [Melodify] SET  ENABLE_BROKER
GO
ALTER DATABASE [Melodify] SET AUTO_UPDATE_STATISTICS_ASYNC OFF
GO
ALTER DATABASE [Melodify] SET DATE_CORRELATION_OPTIMIZATION OFF
GO
ALTER DATABASE [Melodify] SET TRUSTWORTHY OFF
GO
ALTER DATABASE [Melodify] SET ALLOW_SNAPSHOT_ISOLATION OFF
GO
ALTER DATABASE [Melodify] SET PARAMETERIZATION SIMPLE
GO
ALTER DATABASE [Melodify] SET READ_COMMITTED_SNAPSHOT OFF
GO
ALTER DATABASE [Melodify] SET HONOR_BROKER_PRIORITY OFF
GO
ALTER DATABASE [Melodify] SET  READ_WRITE
GO
ALTER DATABASE [Melodify] SET RECOVERY SIMPLE
GO
ALTER DATABASE [Melodify] SET  MULTI_USER
GO
ALTER DATABASE [Melodify] SET PAGE_VERIFY CHECKSUM
GO
ALTER DATABASE [Melodify] SET DB_CHAINING OFF
GO
USE [Melodify]
GO
/****** Object:  Table [dbo].[Artists]    Script Date: 04/03/2025 20:25:14 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Artists](
	[ArtistID] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](100) NOT NULL,
	[Bio] [nvarchar](max) NULL,
	[ImageUrl] [nvarchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[ArtistID] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[__EFMigrationsHistory]    Script Date: 04/03/2025 20:25:14 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[__EFMigrationsHistory](
	[MigrationId] [nvarchar](150) NOT NULL,
	[ProductVersion] [nvarchar](32) NOT NULL,
 CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY CLUSTERED 
(
	[MigrationId] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Users]    Script Date: 04/03/2025 20:25:14 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[Users](
	[UserID] [int] IDENTITY(1,1) NOT NULL,
	[Email] [nvarchar](100) NOT NULL,
	[PasswordHash] [nvarchar](255) NOT NULL,
	[DisplayName] [nvarchar](100) NOT NULL,
	[CreatedAt] [datetime] NULL,
	[Role] [varchar](50) NOT NULL,
	[ImageUrl] [nvarchar](max) NULL,
PRIMARY KEY CLUSTERED 
(
	[UserID] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[Email] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[Songs]    Script Date: 04/03/2025 20:25:14 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Songs](
	[SongID] [int] IDENTITY(1,1) NOT NULL,
	[Title] [nvarchar](100) NOT NULL,
	[ArtistID] [int] NULL,
	[Album] [nvarchar](100) NULL,
	[Genre] [nvarchar](50) NULL,
	[Url] [nvarchar](255) NOT NULL,
	[ReleaseDate] [date] NULL,
	[ImageUrl] [nvarchar](max) NULL,
PRIMARY KEY CLUSTERED 
(
	[SongID] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Playlists]    Script Date: 04/03/2025 20:25:14 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Playlists](
	[PlaylistID] [int] IDENTITY(1,1) NOT NULL,
	[UserID] [int] NULL,
	[Title] [nvarchar](100) NOT NULL,
	[Description] [nvarchar](255) NULL,
	[CreatedAt] [datetime] NULL,
	[ImageUrl] [nvarchar](max) NULL,
PRIMARY KEY CLUSTERED 
(
	[PlaylistID] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Follows]    Script Date: 04/03/2025 20:25:14 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Follows](
	[FollowID] [int] IDENTITY(1,1) NOT NULL,
	[UserID] [int] NULL,
	[ArtistID] [int] NULL,
	[FollowedAt] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[FollowID] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Favorites]    Script Date: 04/03/2025 20:25:14 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Favorites](
	[FavoriteID] [int] IDENTITY(1,1) NOT NULL,
	[UserID] [int] NOT NULL,
	[SongID] [int] NOT NULL,
	[FavoritedAt] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[FavoriteID] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Playlist_Songs]    Script Date: 04/03/2025 20:25:14 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Playlist_Songs](
	[PlaylistSongID] [int] IDENTITY(1,1) NOT NULL,
	[PlaylistID] [int] NULL,
	[SongID] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[PlaylistSongID] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Default [DF__Users__CreatedAt__0425A276]    Script Date: 04/03/2025 20:25:14 ******/
ALTER TABLE [dbo].[Users] ADD  DEFAULT (getdate()) FOR [CreatedAt]
GO
/****** Object:  Default [DF__Users__Role__34C8D9D1]    Script Date: 04/03/2025 20:25:14 ******/
ALTER TABLE [dbo].[Users] ADD  DEFAULT ('User') FOR [Role]
GO
/****** Object:  Default [DF__Playlists__Creat__117F9D94]    Script Date: 04/03/2025 20:25:14 ******/
ALTER TABLE [dbo].[Playlists] ADD  DEFAULT (getdate()) FOR [CreatedAt]
GO
/****** Object:  Default [DF__Follows__Followe__1CF15040]    Script Date: 04/03/2025 20:25:14 ******/
ALTER TABLE [dbo].[Follows] ADD  DEFAULT (getdate()) FOR [FollowedAt]
GO
/****** Object:  Default [DF__Favorites__Favor__398D8EEE]    Script Date: 04/03/2025 20:25:14 ******/
ALTER TABLE [dbo].[Favorites] ADD  DEFAULT (getdate()) FOR [FavoritedAt]
GO
/****** Object:  ForeignKey [FK__Songs__ArtistID__0CBAE877]    Script Date: 04/03/2025 20:25:14 ******/
ALTER TABLE [dbo].[Songs]  WITH CHECK ADD FOREIGN KEY([ArtistID])
REFERENCES [dbo].[Artists] ([ArtistID])
GO
/****** Object:  ForeignKey [FK__Playlists__UserI__1273C1CD]    Script Date: 04/03/2025 20:25:14 ******/
ALTER TABLE [dbo].[Playlists]  WITH CHECK ADD FOREIGN KEY([UserID])
REFERENCES [dbo].[Users] ([UserID])
GO
/****** Object:  ForeignKey [FK__Follows__ArtistI__1ED998B2]    Script Date: 04/03/2025 20:25:14 ******/
ALTER TABLE [dbo].[Follows]  WITH CHECK ADD FOREIGN KEY([ArtistID])
REFERENCES [dbo].[Artists] ([ArtistID])
GO
/****** Object:  ForeignKey [FK__Follows__UserID__1DE57479]    Script Date: 04/03/2025 20:25:14 ******/
ALTER TABLE [dbo].[Follows]  WITH CHECK ADD FOREIGN KEY([UserID])
REFERENCES [dbo].[Users] ([UserID])
GO
/****** Object:  ForeignKey [FK__Favorites__SongI__3B75D760]    Script Date: 04/03/2025 20:25:14 ******/
ALTER TABLE [dbo].[Favorites]  WITH CHECK ADD FOREIGN KEY([SongID])
REFERENCES [dbo].[Songs] ([SongID])
GO
/****** Object:  ForeignKey [FK__Favorites__UserI__3A81B327]    Script Date: 04/03/2025 20:25:14 ******/
ALTER TABLE [dbo].[Favorites]  WITH CHECK ADD FOREIGN KEY([UserID])
REFERENCES [dbo].[Users] ([UserID])
GO
/****** Object:  ForeignKey [FK__Playlist___Playl__173876EA]    Script Date: 04/03/2025 20:25:14 ******/
ALTER TABLE [dbo].[Playlist_Songs]  WITH CHECK ADD FOREIGN KEY([PlaylistID])
REFERENCES [dbo].[Playlists] ([PlaylistID])
GO
/****** Object:  ForeignKey [FK__Playlist___SongI__182C9B23]    Script Date: 04/03/2025 20:25:14 ******/
ALTER TABLE [dbo].[Playlist_Songs]  WITH CHECK ADD FOREIGN KEY([SongID])
REFERENCES [dbo].[Songs] ([SongID])
GO
