export interface issuesInput{
    title: string,
  description: string,
  type: string,
  reporter_id:number


}

export interface IssueFilters {
  sort?:   "newest" | "oldest";
  type?:   string;
  status?: string;
}