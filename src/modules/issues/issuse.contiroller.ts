import type { Request, Response } from "express";
import { issuesService } from "./issues.service";


const createIssue = async (req: Request, res: Response) => {
    const { title, description, type } = req.body;
    const reporter_id = req.user!.id
    if (!title || !description || !type) {
        return res.status(400).json({
            success: false,
            error: "title, description, type required"

        })
    }
    if (title.length > 150) {
        return res.status(400).json({
            success: false,
            error: "title max 150 characters"

        })

    }
    if (description.length < 20) {
        return res.status(400).json({
            success: false,
            error: "description min 20 characters"

        })
    }
    if (!["bug", "feature_request"].includes(type)) {
        return res.status(400).json({
            success: false,
            error: "type must be bug or feature_request"

        })
    }

    try {
        const issues = await issuesService.createIssue({ title, description, type, reporter_id });
        res.status(200).json({
            success: true,
            message: "Login successful",
            issues,
        });


    } catch (error: any) {
        const status = error.status || 500;
        res.status(status).json({
            success: false,
            message: error.message || "Login failed.",
            errors: error.message || "Internal server error.",
        });
    }
}

const getAllIssues = async (req: Request, res: Response) => {
    const { sort, type, status } = req.query
    if (sort && sort !== "newest" && sort !== "oldest") {
        res.status(400).json({
            success: false,
            message: "Invalid sort value. Use 'newest' or 'oldest'.",
            errors: "Invalid query parameter: sort.",
        });
        return;
    }
    if (type && type !== "bug" && type !== "feature_request") {
        res.status(400).json({
            success: false,
            message: "Invalid type. Use 'bug' or 'feature_request'.",
            errors: "Invalid query parameter: type.",
        });
        return;
    }
    const validStatuses = ["open", "in_progress", "resolved"];
    if (status && !validStatuses.includes(status)) {
        res.status(400).json({
            success: false,
            message: "Invalid status. Use 'open', 'in_progress', or 'resolved'.",
            errors: "Invalid query parameter: status.",
        });
        return;
    }
    try {
        const issues = await issuesService.getAllIssues({ sort: sort as any, type, status });
        res.status(200).json({
            success: true,
            message: "Issues retrived successfully",
            data: issues,
        });
    } catch (err: any) {
        res.status(200).json({
            success: false,
            message: "Failed to fetch issues.",
            errors: err.message,
        });
    }
}
const gerSingleIssues= async(req: Request, res: Response)=>{{
    const { id } = req.params;
    if (!id){
          res.status(400).json({
            success: false,
            message: "Issue retrived unsuccessfully",
            errors: "Issue not found",
        });
        return;
    }
    try {
        const issue = await issuesService.gerSingleIssues(id);
          res.status(200).json({
            success: true,
            message: "Issues retrived successfully",
            data: issue,
        });
    } catch (error) {
        console.log(error);
        
    }

}}

const deleteIssue = async (req: Request, res: Response) => {

    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            success: false,
            message: "Issue id is required",
        });
    }

    try {

        await issuesService.deleteIssue(id);

        return res.status(200).json({
            success: true,
            message: "Issue deleted successfully",
        });

    } catch (error: any) {

        return res.status(404).json({
            success: false,
            message: error.message || "Failed to delete issue",
        });
    }
};
export const issuesController = {
    createIssue,
    getAllIssues,
    gerSingleIssues,
    deleteIssue
}

