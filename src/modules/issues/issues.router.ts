import { Router } from "express";
import { issuesController } from "./issuse.contiroller";
import { authenticate } from "../../middleware/authenticate"
const router = Router()
export const issuesRouter = router;

router.get("/",issuesController.getAllIssues)
router.post("/", authenticate, issuesController.createIssue)
router.get("/:id", issuesController.gerSingleIssues)
router.delete("/:id", authenticate,issuesController.deleteIssue)
router.patch("/:id", authenticate, issuesController.updateIssue);
