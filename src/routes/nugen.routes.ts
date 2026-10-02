import { Router } from "express";
import { parseRequest } from "../controllers/nugen.controller";

const router = Router();

router.post("/parse-request", parseRequest);

export default router;