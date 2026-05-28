import { Router } from "express";
import { issuesController } from "./issuse.contiroller";
const router = Router()
export const issuesRouter = router;
import { authenticate } from "../../middleware/authenticate"
router.get("/",issuesController.getAllIssues)
router.post("/", authenticate, issuesController.createIssue)
router.get("/:id",issuesController.gerSingleIssues)
