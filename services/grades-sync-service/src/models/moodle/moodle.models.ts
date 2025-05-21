export interface GradeItem {
    itemname: string;
    grade: number | string | null;
}

export interface ReportStudentGrades {
    courseid: number;
    userid: number;
    userfullname: string;
    useremail: string;
    courseidnumber: string;
    teacheremail: string;
    gradeItems: GradeItem[];
}