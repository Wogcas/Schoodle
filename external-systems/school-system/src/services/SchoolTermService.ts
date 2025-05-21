import SchoolTermRepository from "../repositories/SchoolTermRepository";
import SchoolTerm from "../models/SchoolTerm";

const schoolTermRepository = new SchoolTermRepository();

export default class SchoolTermService {
  async getLatestTerm(): Promise<SchoolTerm | null> {
    try {
      const term = await schoolTermRepository.getLatestSchoolTerm();
      return term || null;
    } catch (error) {
      throw new Error(`Error fetching latest school term: ${(error as Error).message}`);
    }
  }

  async getTermById(termId: number): Promise<SchoolTerm | null> {
    try {
      const term = await schoolTermRepository.getSchoolTermById(termId);
      return term || null;
    } catch (error) {
      throw new Error(`Error fetching school term by ID: ${(error as Error).message}`);
    }
  }
}