export type UserRole = 'student' | 'evaluator' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  college?: string;
  department?: string;
  phone?: string;
}

export interface ProblemStatement {
  id: string;
  title: string;
  category: string;
  domain_bucket: 'Software' | 'Hardware' | 'Both';
  organization: string;
  description: string;
  desired_outcome: string;
  complexity: 'Easy' | 'Medium' | 'Hard';
  dataset_url?: string;
  submissions_count: number;
  is_active: number;
  created_at?: string;
}

export interface TeamMember {
  id: string;
  team_id: string;
  name: string;
  email: string;
  role_in_team: string;
  gender: string;
  college_id_no?: string;
  year_of_study?: string;
}

export interface Submission {
  id: string;
  team_id: string;
  problem_statement_id: string;
  idea_title: string;
  executive_summary: string;
  proposed_solution: string;
  tech_stack: string;
  ppt_url?: string;
  github_url?: string;
  demo_video_url?: string;
  status: 'submitted' | 'under_review' | 'shortlisted' | 'rejected' | 'winner';
  submitted_at?: string;
  ps_title?: string;
  ps_category?: string;
  ps_organization?: string;
}

export interface Team {
  id: string;
  name: string;
  leader_id: string;
  college: string;
  track: string;
  problem_statement_id?: string;
  problem_title?: string;
  problem_category?: string;
  status: 'forming' | 'submitted' | 'shortlisted' | 'finalist' | 'winner';
  members: TeamMember[];
  submission?: Submission | null;
  femaleCount: number;
  isCompliant: boolean;
}

export interface Evaluation {
  id: string;
  submission_id: string;
  evaluator_id: string;
  innovation_score: number;
  technical_score: number;
  feasibility_score: number;
  ui_ux_score: number;
  presentation_score: number;
  total_score: number;
  comments: string;
  decision: 'Shortlist' | 'Reject' | 'Under Review';
  evaluated_at?: string;
  evaluator_name?: string;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  category: string;
  is_banner: number;
  created_at: string;
}

export interface LiveStats {
  totalTeams: number;
  totalSubmissions: number;
  totalStudents: number;
  totalProblemStatements: number;
  prizePool: string;
  collegesParticipating: string;
}
