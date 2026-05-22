namespace FieldInspection.Api.Models;

public class InspectionReport
{
    public Guid Id { get; set; }
    public string SiteName { get; set; } = "";
    public string InspectorName { get; set; } = "";
    public DateTime InspectedAt { get; set; }
    public string Status { get; set; } = "Draft";
    public string Notes { get; set; } = "";
    public string? PhotoDataUrl { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
