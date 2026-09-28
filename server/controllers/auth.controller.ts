import { Request, Response } from "express";
import { AuthRequest, generateToken, AuthenticatedUser } from "../middleware/auth.js";

// Pre-configured Command Center Operators
const OPERATORS: (AuthenticatedUser & { passwordHash: string })[] = [
  {
    id: "OP-TS-8492",
    name: "Kritika Tripathi",
    email: "kritika.tripathi@thermoshield.defense",
    role: "CHIEF_OFFICER",
    passwordHash: "command2026"
  },
  {
    id: "OP-TS-1104",
    name: "Tactical Response Unit",
    email: "operator@thermoshield.defense",
    role: "TACTICAL_OPERATOR",
    passwordHash: "operator2026"
  }
];

export class AuthController {
  public static login(req: Request, res: Response): void {
    const { email, password } = req.body || {};

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required." });
      return;
    }

    const operator = OPERATORS.find(
      (o) => o.email.toLowerCase() === email.toLowerCase().trim()
    );

    if (!operator || operator.passwordHash !== password) {
      res.status(401).json({ error: "Invalid operator credentials." });
      return;
    }

    const user: AuthenticatedUser = {
      id: operator.id,
      name: operator.name,
      email: operator.email,
      role: operator.role
    };

    const token = generateToken(user);
    res.json({
      token,
      user
    });
  }

  public static getProfile(req: AuthRequest, res: Response): void {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized." });
      return;
    }

    res.json({ user: req.user });
  }
}
