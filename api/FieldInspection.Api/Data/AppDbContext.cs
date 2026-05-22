using FieldInspection.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace FieldInspection.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<InspectionReport> Reports => Set<InspectionReport>();
}
