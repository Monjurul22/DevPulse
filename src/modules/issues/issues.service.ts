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
const result= await pool.query(`SELECT * FROM issues WHERE id = $1', [id]`,[id]);
const issue = result.rows[0];

 const reporter = await pool.query(
    'SELECT id, name, role FROM users WHERE id = $1', [issue.reporter_id]
  );
  return { ...issue, reporter: reporter.rows[0] || null, reporter_id: undefined };

  
}
export const issuesService = {
  createIssue,
  getAllIssues,
  gerSingleIssues
}