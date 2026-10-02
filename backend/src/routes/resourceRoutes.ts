import { Router } from "express";

import {
  getResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource
} from "../controllers/resourceController";

const router = Router();


// GET /api/resources
router.get("/", getResources);


// GET /api/resources/:id
router.get("/:id", getResourceById);


// POST /api/resources
router.post("/", createResource);


// PUT /api/resources/:id
router.put("/:id", updateResource);


// DELETE /api/resources/:id
router.delete("/:id", deleteResource);


export default router;