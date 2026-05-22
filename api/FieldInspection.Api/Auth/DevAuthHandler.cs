using System.Security.Claims;
using System.Text.Encodings.Web;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Options;

namespace FieldInspection.Api.Auth;

// Dev-only auth: accepts any "Bearer dev-<name>" token. Replace with Microsoft.Identity.Web in prod.
public class DevAuthHandler(
    IOptionsMonitor<AuthenticationSchemeOptions> options,
    ILoggerFactory logger,
    UrlEncoder encoder)
    : AuthenticationHandler<AuthenticationSchemeOptions>(options, logger, encoder)
{
    protected override Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        var auth = Request.Headers.Authorization.ToString();
        if (!auth.StartsWith("Bearer dev-"))
            return Task.FromResult(AuthenticateResult.Fail("Missing dev token"));

        var name = auth["Bearer dev-".Length..];
        var claims = new[] { new Claim(ClaimTypes.Name, name), new Claim(ClaimTypes.NameIdentifier, name) };
        var identity = new ClaimsIdentity(claims, Scheme.Name);
        var ticket = new AuthenticationTicket(new ClaimsPrincipal(identity), Scheme.Name);
        return Task.FromResult(AuthenticateResult.Success(ticket));
    }
}
