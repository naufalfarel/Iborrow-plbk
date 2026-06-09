import type { Request, Response, NextFunction } from 'express'
import { flashMessage } from '../inertia.js'

export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      flashMessage(req, 'error', 'Kamu tidak punya akses ke halaman tersebut.')
      return res.redirect('/dashboard')
    }
    next()
  }
}
