import { Request, Response } from "express"
import BugReport from "../models/BugReport"

export const createBugReport = async (req: Request, res: Response) => {
  try {
    const { message, user } = req.body
    const report = new BugReport({
      message,
      user,
      createdAt: new Date(),
    })
    await report.save()
    res.status(201).json({ ok: true })
  } catch (error) {
    res.status(500).json({ ok: false, error: "Error al guardar el reporte" })
  }
}