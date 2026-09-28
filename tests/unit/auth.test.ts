import { describe, it, expect, vi } from "vitest";
import { generateToken, verifyToken, requireAuth, requireRole, AuthenticatedUser, AuthRequest } from "../../server/middleware/auth.js";
import { Response } from "express";

describe("Authentication & JWT Middleware (Unit Tests)", () => {
  const mockUser: AuthenticatedUser = {
    id: "OP-TS-8492",
    name: "Kritika Tripathi",
    email: "kritika.tripathi@thermoshield.defense",
    role: "CHIEF_OFFICER"
  };

  it("should generate a valid JWT and decode it correctly", () => {
    const token = generateToken(mockUser);
    expect(typeof token).toBe("string");
    expect(token.split(".").length).toBe(3);

    const decoded = verifyToken(token);
    expect(decoded).not.toBeNull();
    expect(decoded?.id).toBe(mockUser.id);
    expect(decoded?.name).toBe("Kritika Tripathi");
    expect(decoded?.role).toBe("CHIEF_OFFICER");
  });

  it("should return null for malformed or bogus tokens", () => {
    const decoded = verifyToken("invalid.token.payload");
    expect(decoded).toBeNull();
  });

  it("requireAuth should pass for valid Bearer token", () => {
    const token = generateToken(mockUser);
    const req = {
      headers: { authorization: `Bearer ${token}` }
    } as unknown as AuthRequest;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    } as unknown as Response;

    const next = vi.fn();

    requireAuth(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(req.user?.name).toBe("Kritika Tripathi");
  });

  it("requireAuth should reject with 401 when Authorization header is missing", () => {
    const req = { headers: {} } as unknown as AuthRequest;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    } as unknown as Response;
    const next = vi.fn();

    requireAuth(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("requireRole should guard against insufficient clearance", () => {
    const chiefGuard = requireRole(["CHIEF_OFFICER"]);

    const reqChief = {
      user: { id: "1", name: "Kritika", email: "k@t.d", role: "CHIEF_OFFICER" }
    } as AuthRequest;
    const reqOperator = {
      user: { id: "2", name: "Operator", email: "o@t.d", role: "TACTICAL_OPERATOR" }
    } as AuthRequest;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    } as unknown as Response;

    const next1 = vi.fn();
    chiefGuard(reqChief, res, next1);
    expect(next1).toHaveBeenCalled();

    const next2 = vi.fn();
    chiefGuard(reqOperator, res, next2);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(next2).not.toHaveBeenCalled();
  });
});
