using Microsoft.EntityFrameworkCore;
using PetConnectAlmost.Models;

namespace PetConnectAlmost.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Pet> Pets { get; set; }
        public DbSet<Post> Posts { get; set; }
        public DbSet<PostLike> PostLikes { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<Follow> Follows { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<CartItem> CartItems { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<MissingPetReport> MissingPetReports { get; set; }
        public DbSet<MissingPetContact> MissingPetContacts { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User configuration (Table name already set via Attribute, but ensuring snake_case here if needed)
            modelBuilder.Entity<User>(entity => {
                entity.HasIndex(u => u.Username).IsUnique();
                entity.HasIndex(u => u.Email).IsUnique();
            });

            // Pet configuration
            modelBuilder.Entity<Pet>(entity => {
                entity.HasOne(p => p.User)
                    .WithMany(u => u.Pets)
                    .HasForeignKey(p => p.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Post configuration
            modelBuilder.Entity<Post>(entity => {
                entity.HasOne(p => p.User)
                    .WithMany(u => u.Posts)
                    .HasForeignKey(p => p.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

                // Note: Visibility is now a string in the model to match Spring's EnumType.STRING mapping
            });

            // PostLike configuration (Id based PK now to match Spring)
            modelBuilder.Entity<PostLike>(entity => {
                entity.HasKey(pl => pl.Id);
                entity.HasIndex(pl => new { pl.UserId, pl.PostId }).IsUnique();

                entity.HasOne(pl => pl.User)
                    .WithMany(u => u.Likes)
                    .HasForeignKey(pl => pl.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(pl => pl.Post)
                    .WithMany(p => p.Likes)
                    .HasForeignKey(pl => pl.PostId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Comment configuration
            modelBuilder.Entity<Comment>(entity => {
                entity.HasOne(c => c.Post)
                    .WithMany(p => p.Comments)
                    .HasForeignKey(c => c.PostId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(c => c.User)
                    .WithMany(u => u.Comments)
                    .HasForeignKey(c => c.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Follow configuration (Id based PK now to match Spring)
            modelBuilder.Entity<Follow>(entity => {
                entity.HasKey(f => f.Id);
                entity.HasIndex(f => new { f.FollowerId, f.FollowingId }).IsUnique();

                entity.HasOne(f => f.Follower)
                    .WithMany(u => u.Following)
                    .HasForeignKey(f => f.FollowerId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(f => f.Following)
                    .WithMany(u => u.Followers)
                    .HasForeignKey(f => f.FollowingId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Product & Category configuration
            modelBuilder.Entity<Product>(entity => {
                entity.HasMany(p => p.CartItems)
                    .WithOne(ci => ci.Product)
                    .HasForeignKey(ci => ci.ProductId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasMany(p => p.OrderItems)
                    .WithOne(oi => oi.Product)
                    .HasForeignKey(oi => oi.ProductId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // Order configuration
            modelBuilder.Entity<Order>(entity => {
                entity.HasOne(o => o.User)
                    .WithMany()
                    .HasForeignKey(o => o.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasMany(o => o.OrderItems)
                    .WithOne(oi => oi.Order)
                    .HasForeignKey(oi => oi.OrderId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // MissingPetReport configuration
            modelBuilder.Entity<MissingPetReport>(entity => {
                entity.HasOne(m => m.Reporter)
                    .WithMany()
                    .HasForeignKey(m => m.ReporterId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(m => m.Pet)
                    .WithMany()
                    .HasForeignKey(m => m.PetId)
                    .OnDelete(DeleteBehavior.SetNull);
            });

            // MissingPetContact configuration
            modelBuilder.Entity<MissingPetContact>(entity => {
                entity.HasOne(c => c.Report)
                    .WithMany(r => r.Contacts)
                    .HasForeignKey(c => c.ReportId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(c => c.ContactUser)
                    .WithMany()
                    .HasForeignKey(c => c.ContactUserId)
                    .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}
