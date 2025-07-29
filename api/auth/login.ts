import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../../server/storage';
import { comparePasswords } from '../../lib/auth-helpers';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  

  try {
    const { email, password } = (req.body ?? req.query);
    const user = await storage.getUserByEmail(email);
    if (!user || !(await comparePasswords(password, user.password!))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // For real apps, issue a JWT here and set as cookie or return in body
    res.status(200).json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed" });
  }
}