import { pool } from "../../db";
import type { IssueFilters, issuesInput } from "./issues.interface";

const createIssue = async (paylode: issuesInput) => {
  const { title, description, type, reporter_id } = paylode;
  const result = await pool.query(
    `INSERT INTO issues (title, description, type ,reporter_id)
     VALUES ($1,$2,$3,$4) RETURNING *`,
    [title, description, type, reporter_id]
  );
  return result.rows[0];


}



const getAllIssues = async (paylode: IssueFilters) => {
  const { sort, type, status } = paylode;
  const conditions: string[] = [];
  const params: any[] = [];

  if (type) {
    params.push(type);
    conditions.push(`type = $${params.length}`);
  }
  if (status) {
    params.push(status);
    conditions.push(`status = $${params.length}`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const orderDir = sort === "oldest" ? "ASC" : "DESC";

  const result = await pool.query(
    `SELECT id, title, description, type, status, reporter_id, created_at, updated_at
     FROM issues
     ${where}
     ORDER BY created_at ${orderDir}`,
    params
  );

  return result.rows;

}
const gerSingleIssues=async(paylode:any)=>{
  const id=paylode;
const result = await pool.query(
        `SELECT * FROM issues WHERE id = $1`,
        [id]
    );

    const issue = result.rows[0];

    if (!issue) {
        throw new Error("Issue not found");
    }

 const reporterResult = await pool.query(
        `SELECT id, name, role FROM users WHERE id = $1`,
        [issue.reporter_id]
    );

    return {
        ...issue,
        reporter: reporterResult.rows[0] || null,
    };
  
}

export async function updateIssue(
  id:          number,
  input: any,
  requesterId: number,
  requesterRole: "contributor" | "maintainer"
) {
  // Fetch current issue (raw, with reporter_id)
  const current = await pool.query(
    "SELECT id, status, reporter_id FROM issues WHERE id = $1",
    [id]
  );

  if (current.rows.length === 0) {
    throw { status: 404, message: "Issue not found." };
  }

  const issue = current.rows[0];

  // Contributor: only own issues, only when open, cannot change status
  if (requesterRole === "contributor") {
    if (issue.reporter_id !== requesterId) {
      throw { status: 403, message: "You can only update your own issues." };
    }
    if (issue.status !== "open") {
      throw { status: 409, message: "Contributors can only edit issues with 'open' status." };
    }
    // Strip status from input — contributors cannot change it
    delete input.status;
  }

  // Build SET clause dynamically from provided fields
  const allowed  = ["title", "description", "type", "status"] as const;
  const setClauses: string[] = [];
  const params:     any[]    = [];

  for (const field of allowed) {
    if (input[field] !== undefined) {
      params.push(input[field]);
      setClauses.push(`${field} = $${params.length}`);
    }
  }

  if (setClauses.length === 0) {
    throw { status: 400, message: "No valid fields provided for update." };
  }

  params.push(id);
  const result = await pool.query(
    `UPDATE issues SET ${setClauses.join(", ")}
     WHERE id = $${params.length}
     RETURNING id, title, description, type, status, reporter_id, created_at, updated_at`,
    params
  );

  return result.rows[0];
}

const deleteIssue = async (paylode:any) => {
  const id=paylode
    // check issue exists
    const existingIssue = await pool.query(
        `SELECT * FROM issues WHERE id = $1`,
        [id]
    );

    if (existingIssue.rows.length === 0) {
        throw new Error("Issue not found");
    }

    // delete issue
    await pool.query(
        `DELETE FROM issues WHERE id = $1`,
        [id]
    );

    return null;
};

export const issuesService = {
  createIssue,
  getAllIssues,
  gerSingleIssues,
  updateIssue,
  deleteIssue
}