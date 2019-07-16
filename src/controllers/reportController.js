import { Report, UserReport } from '../db/models';

/**
 * @description - Handles all actions on the report resource
 * @class
 */
class ReportController {
  /**
   * @description - Creates a new report
   * @static
   * @async
   * @param {object} req - create report request object 
   * @param {object} res - create report response object
   * @returns {object} - new report
   */
  static async createReport(req, res) {
    try {
      const { body, reportType } = req.body;
      const reporterId = req.user;
      const { post: reportedPost } = req;
      const { id: reportTypeId } = reportedPost;

      const reportCreateValues = { body, reportType, reportTypeId };
      const newReport = await Report.create(reportCreateValues);

      const { id:reportId } = newReport;
      const userReportCreateValues = { reportId, reporterId };
      await UserReport.create(userReportCreateValues)

      return res.status(201).json({
        status: 201,
        message: `${reportType} successfully reported`
      });

    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: error.message
      });
    }
  }
}

export default ReportController;
