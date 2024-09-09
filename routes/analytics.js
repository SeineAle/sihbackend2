import express from "express";
import cors from "cors";
import authMiddleware from "../middleware/authMiddleware.js";
import { analyticsReqSechema } from "../zodValidation/index.js";
import { Entry } from "../models/index.js";
import { getAgeGroupData, getYearlyStatusData, getYearlyGenderData, getAverageTreatmentTimePerYear, getMonthlyCasesDataOverEntireDataset } from "../analyticFunctions/index.js";

const router = express.Router({ mergeParams: true });
router.use(express.urlencoded({ extended: true }));
router.use(express.json());
router.use(cors());

router.post('/', authMiddleware, async (req, res) => {
    const { userId, queryData } = req.body;

    if (!queryData) {
        return res.status(400).json({ message: "queryData is required" });
    }
    if (!userId) {
        return res.status(400).json({ message: "userId is required" });
    }

    const { success } = analyticsReqSechema.safeParse(queryData);
    if (!success) {
        return res.status(411).json({ message: "Incorrect input" });
    }

    let query = {};
    if (queryData.facilityId) {
        query = { facilityId: queryData.facilityId };
    } else if (queryData.subDistrictId) {
        query = { subDistrictId: queryData.subDistrictId };
    } else if (queryData.districtId) {
        query = { districtId: queryData.districtId };
    } else {
        return res.status(400).json({ message: "One of facilityId, subDistrictId, or districtId is required" });
    }

    try {
        const dataArr = await Entry.find(query);

        const ageGroupDataObj = getAgeGroupData(dataArr);
        const yearlyStatusDataObj = getYearlyStatusData(dataArr);
        const yearlyGenderDataObj = getYearlyGenderData(dataArr);
        const averageTreatmentTimePerYearDataObj = getAverageTreatmentTimePerYear(dataArr);
        const monthlyCasesDataOverEntireDatasetDataObj = getMonthlyCasesDataOverEntireDataset(dataArr);

        return res.status(200).json({
            ageGroupDataObj,
            yearlyStatusDataObj,
            yearlyGenderDataObj,
            averageTreatmentTimePerYearDataObj,
            monthlyCasesDataOverEntireDatasetDataObj,
        });

    } catch (error) {
        return res.status(500).json({ message: "Failed to retrieve entries", error: error.message });
    }
});

export default router;
