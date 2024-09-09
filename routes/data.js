import express from "express";
import cors from "cors";
import authMiddleware from "../middleware/authMiddleware.js";
import {dataSchema} from "../zodValidation/index.js";
import { Entry, User } from "../models/index.js";

const router = express.Router({ mergeParams: true });
router.use(express.urlencoded({ extended: true }));
router.use(express.json());
router.use(cors());

router.post('/', authMiddleware, async(req, res) => {
    const userId = req.body.userId;
    const newData = req.body.newData;
    console.log(newData);
    const { success } = dataSchema.safeParse(newData);
    if (!success) {
      return res.status(411).json({ message: "Incorrect input" });
    }
    const dbUser = await User.findOne({ userId: userId });
    if (!dbUser) {
      return res.status(411).json({ message: "No such Account found with this username" });
    }
    console.log(newData);
    const entryObj = {
        userId: dbUser.userId,
        facilityId: dbUser.facilityId,
        subDistrictId: dbUser.subDistrictId,
        districtId: dbUser.districtId,
        data: newData,
    } 
    try {
        const newEntry = new Entry(entryObj);
        await newEntry.save();
        return res.status(201).json({ message: "Entry successfully created", entryId: newEntry.entryId, newEntry: newEntry});
    } catch (error) {
        return res.status(500).json({ message: "Failed to create entry", error: error.message });
    }
})

router.get('/all', authMiddleware, async (req, res) => {
    const userId = req.body.userId;
    try {
        const dbUser = await User.findOne({ userId: userId });
        if (!dbUser) {
            return res.status(411).json({ message: "No such Account found with this username" });
        }
        const queryObj = {
            userId: dbUser.userId,
        }
        const entries = await Entry.find(queryObj);
        return res.status(200).json({ entries: entries });
    } catch (error) {
        return res.status(500).json({ message: "Failed to retrieve entries", error: error.message });
    }
});
router.get('/entry/:entryId', authMiddleware, async (req, res) => {
    const { entryId } = req.params;
    try {
        const entry = await Entry.findById(entryId);
        if (!entry) {
            return res.status(404).json({ message: "Entry not found" });
        }
        return res.status(200).json({ entry: entry });
    } catch (error) {
        return res.status(500).json({ message: "Failed to retrieve entry", error: error.message });
    }
});

router.put('/', authMiddleware, async (req, res) => {
    const updatedData = req.body.updatedData;
    const { success } = dataSchema.safeParse(updatedData);
    if (!success) {
        return res.status(411).json({ message: "Incorrect input" });
    }
    const entryId = req.body.entryId;
    const userId = req.body.userId;
    const entry = await Entry.findOne({entryId: entryId});
    if (!entry) {
        return res.status(411).json({ message: "No such entry found" });
    }
    const dbUser = await User.findOne({ userId: userId });
    if (!dbUser) {
        return res.status(411).json({ message: "No such Account found with this username" });
    }
    if(entry.userId !== dbUser.userId){
        return res.status(411).json({ message: "unauthorized" });
    }
    try {
        const entryObj = {
            entryId: entryId,
            userId: dbUser.userId,
            facilityId: dbUser.facilityId,
            subDistrictId: dbUser.subDistrictId,
            districtId: dbUser.districtId,
            data: updatedData,
        } 
        const newEntry = await Entry.findOneAndUpdate(
            { entryId: entryId },
            entryObj,
            { new: true }
        );

        if (!newEntry) {
            return res.status(404).json({ message: "Entry not found" });
        }

        return res.status(200).json({ message: "Entry successfully updated", entry: newEntry });
    } catch (error) {
        return res.status(500).json({ message: "Failed to update entry", error: error.message });
    }
});

export default router;



