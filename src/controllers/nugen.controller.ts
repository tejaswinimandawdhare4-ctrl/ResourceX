import { Request, Response } from "express";
import { parseResourceRequest } from "../services/nugen.services";

export async function parseRequest(req: Request, res: Response) {
  try {
    const { request } = req.body;

    if (!request) {
      return res.status(400).json({
        success: false,
        message: "Request text is required"
      });
    }

    const result = await parseResourceRequest(request);

    return res.json({
      success: true,
      result
    });
  } catch (error: any) {
    console.error("Nugen error:", error.response?.data || error.message);

    return res.status(500).json({
      success: false,
      message: "Nugen inference failed",
      error: error.response?.data || error.message
    });
  }
}