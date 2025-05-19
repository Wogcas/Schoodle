export interface CourseAssignment {
  id: number;
  cmid: number;
  course: number;
  name: string;
  sendnotifications: boolean;
  duedate: number; // Unix timestamp
  grade: number;
  intro: string;
}

export interface CourseAssignmentsResponse {
  assignments: CourseAssignment[];
}

export interface AssignmentDateRequest {
  courseid: number;
  startdate: string;
  enddate: string;
}