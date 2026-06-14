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
        res.status(201).json({
            success: true,
            message: "Issue created successfully",
            data: issues,
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

    const sort =
        typeof req.query.sort === "string"
            ? req.query.sort
            : undefined;

    const type =
        typeof req.query.type === "string"
            ? req.query.type
            : undefined;

    const status =
        typeof req.query.status === "string"
            ? req.query.status
            : undefined;
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

    if (typeof status === "string" && !validStatuses.includes(status)) {
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
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch issues.",
            errors: error.message,
        });
    }
}
const gerSingleIssues = async (req: Request, res: Response) => {
    {
        const { id } = req.params;
        if (!id) {
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
        } catch (error: any) {
            res.status(404).json({
                success: false,
                message: "Issue not found.",
                error: error.message,
            });

        }

    }
}

export async function updateIssue(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    const user = req.user!;

    if (isNaN(id)) {
        res.status(400).json({
            success: false,
            message: "Invalid issue ID.",
            errors: "ID must be a number.",
        });
        return;
    }

    const { title, description, type, status } = req.body;

    // Validate allowed field values if provided
    if (type && type !== "bug" && type !== "feature_request") {
        res.status(400).json({
            success: false,
            message: "Validation failed.",
            errors: "type must be 'bug' or 'feature_request'.",
        });
        return;
    }

    const validStatuses = ["open", "in_progress", "resolved"];
    if (status && !validStatuses.includes(status)) {
        res.status(400).json({
            success: false,
            message: "Validation failed.",
            errors: "status must be 'open', 'in_progress', or 'resolved'.",
        });
        return;
    }

    if (title && title.length > 150) {
        res.status(400).json({
            success: false,
            message: "Validation failed.",
            errors: "title must be 150 characters or fewer.",
        });
        return;
    }

    if (description && description.length < 20) {
        res.status(400).json({
            success: false,
            message: "Validation failed.",
            errors: "description must be at least 20 characters.",
        });
        return;
    }

    try {
        const updated = await issuesService.updateIssue(
            id,
            { title, description, type, status },
            user.id,
            user.role
        );

        res.status(200).json({
            success: true,
            message: "Issue updated successfully",
            data: updated,
        });
    } catch (err: any) {
        const httpStatus = err.status || 500;
        res.status(httpStatus).json({
            success: false,
            message: err.message || "Failed to update issue.",
            errors: err.message,
        });
    }
}

const deleteIssue = async (req: Request, res: Response) => {
    if (req.user!.role !== "maintainer") {
        res.status(403).json({
            success: false,
            message: "Forbidden.",
        });
        return;
    }
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
    updateIssue,
    deleteIssue
}

