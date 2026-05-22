using FieldInspection.Api.Data;
using FieldInspection.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FieldInspection.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ReportsController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<IEnumerable<InspectionReport>> GetAll() =>
        await db.Reports.OrderByDescending(r => r.UpdatedAt).ToListAsync();

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<InspectionReport>> Get(Guid id)
    {
        var r = await db.Reports.FindAsync(id);
        return r is null ? NotFound() : r;
    }

    [HttpPost]
    public async Task<ActionResult<InspectionReport>> Upsert(InspectionReport report)
    {
        var existing = await db.Reports.FindAsync(report.Id);
        if (existing is null)
        {
            if (report.Id == Guid.Empty) report.Id = Guid.NewGuid();
            report.CreatedAt = DateTime.UtcNow;
            report.UpdatedAt = DateTime.UtcNow;
            db.Reports.Add(report);
        }
        else
        {
            existing.SiteName = report.SiteName;
            existing.InspectorName = report.InspectorName;
            existing.InspectedAt = report.InspectedAt;
            existing.Status = report.Status;
            existing.Notes = report.Notes;
            existing.PhotoDataUrl = report.PhotoDataUrl;
            existing.UpdatedAt = DateTime.UtcNow;
        }
        await db.SaveChangesAsync();
        return Ok(report);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var r = await db.Reports.FindAsync(id);
        if (r is null) return NotFound();
        db.Reports.Remove(r);
        await db.SaveChangesAsync();
        return NoContent();
    }
}
