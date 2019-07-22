import express from 'express';
import ReportController from '../controllers/reportController';
import verify from '../helpers/verifyToken';
import reportValidator from '../middleware/reportValidator';
import validate from '../middleware/validate';
import getReportedPost from '../middleware/getReportedPost';

const router = express.Router();
const { createReport } = ReportController;
const { detailsValidator } = reportValidator;

router.post('/reports/', verify, detailsValidator, validate, getReportedPost, createReport);

export default router;
