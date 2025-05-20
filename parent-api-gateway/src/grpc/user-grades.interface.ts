export interface UserGradesByTypeRequest {
  courseid: number;
  userid: number;
  gradeitem: string;
}

export interface GradeItem {
  itemname: string;
  grade: string;
}

export interface UserGradesResponse {
  courseid: number;
  userid: number;
  userfullname: string;
  gradeItems: GradeItem[];
}