export interface issuesInput{
    title: string,
  description: string,
  type: string,
  reporter_id:number


}

export interface IssueFilters {
  sort?: "newest" | "oldest" | undefined;
  type?: string | undefined;
  status?: string | undefined;
}