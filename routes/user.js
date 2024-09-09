import { userSigninSchema, userSignupSchema } from "../zodValidation/index.js";
import { User, Facility, District, SubDistrict, TempUser, Otp } from "../models/index.js";
import authMiddleware from "../middleware/authMiddleware.js";
import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import nodemailer from 'nodemailer';

const router = express.Router({ mergeParams: true });
router.use(express.urlencoded({ extended: true }));
router.use(express.json());
router.use(cors({ origin: '*' }));

router.post("/signup", async (req, res) => {
  try {
    const userDetails = req.body;
    console.log(userDetails);

    const { success } = userSignupSchema.safeParse(userDetails);
    if (!success) {
      return res.status(400).json({ message: "Incorrect input" });
    }

    const userIdExists = await User.findOne({ userId: userDetails.userId });
    const emailExists = await User.findOne({ email: userDetails.email });

    if (userIdExists || emailExists) {
      return res.status(400).json({ message: "Username / Email already taken" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const dbUser = await TempUser.findOne({ userId: userDetails.userId });
    const dbOtp = await Otp.findOne({ userId: userDetails.userId });

    if (dbOtp) {
      await Otp.findOneAndUpdate(
        { userId: userDetails.userId },
        {
          createdAt: Date.now(),
          otp: otp,
        }
      );
      await TempUser.findOneAndUpdate(
        { userId: userDetails.userId },
        { createdAt: Date.now() }
      );
    } else {
      const newOtp = new Otp({ userId: userDetails.userId, otp: otp });
      await newOtp.save();

      if (dbUser) {
        await TempUser.findOneAndUpdate(
          { userId: userDetails.userId },
          { createdAt: Date.now() }
        );
      } else {
        const newUser = new TempUser(userDetails);
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newUser.password, salt);
        newUser.password = hashedPassword;
        await newUser.save();
      }
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userDetails.email,
      subject: "Your OTP Code",
      html: `<p>Your OTP code is: <strong>${otp}</strong>. It is valid for 10 minutes</p>`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ message: "Failed to send OTP email" });
      } else {
        console.log("Email sent:", info.response);
        return res.status(200).json({
          message: "OTP sent successfully to your email",
        });
      }
    });

  } catch (err) {
    console.error("Error in signup process:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/signin", async (req, res) => {
  const userDetails = req.body;
  console.log(userDetails);

  const { success } = userSigninSchema.safeParse(userDetails);
  if (!success) {
    return res.status(400).json({ message: "Incorrect input" });
  }

  try {
    const dbUser = await User.findOne({ userId: userDetails.userId });
    if (!dbUser) {
      return res.status(401).json({ message: "No account found with this username" });
    }

    const passwordMatch = await bcrypt.compare(userDetails.password, dbUser.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const dbOtp = await Otp.findOne({ userId: userDetails.userId });
    if (dbOtp) {
      await Otp.findOneAndUpdate(
        { userId: userDetails.userId },
        { createdAt: Date.now(), otp: otp }
      );
    } else {
      const newOtp = new Otp({ userId: userDetails.userId, otp: otp });
      await newOtp.save();
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: dbUser.email,
      subject: "Your OTP Code",
      html: `<p>Your OTP code is: <strong>${otp}</strong></p>`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ message: "Failed to send OTP email" });
      } else {
        console.log("Email sent:", info.response);
        return res.status(200).json({ message: "OTP sent to your email" });
      }
    });

  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


router.post("/verify-otp", async (req, res) => {
  try {
    const { userId, otp } = req.body;

    const dbOtp = await Otp.findOne({ userId });
    if (!dbOtp || dbOtp.otp !== otp) {
      return res.status(400).json({ message: "OTP expired or didn't match" });
    }

    
    const dbUser = await User.findOne({ userId });
    
    const dbTempUser = await TempUser.findOne({ userId });

    if (dbUser && !dbTempUser) {
      
      const payload = { userId: dbUser.userId };
      const token = jwt.sign(payload, process.env.JWT_SECRET_KEY);
      return res.status(200).json({ token: token, userDetails: dbUser });
    }

    if (!dbUser && dbTempUser) {
      
      const newUser = new User(dbTempUser.toObject()); 
      await newUser.save();

      await TempUser.findOneAndDelete(dbTempUser.userId);
      await Otp.findOneAndDelete({userId: dbTempUser.userId});

      const payload = { userId: newUser.userId };
      const token = jwt.sign(payload, process.env.JWT_SECRET_KEY);
      return res.status(200).json({ token: token, userDetails: newUser });
    }
    res.status(404).json({ message: "User not found" });

  } catch (err) {
    console.error("Error during OTP verification:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get('/domains', authMiddleware, async (req, res) => {
  try {
    const userId = req.body.userId;
    const dbUser = await User.findOne({ userId: userId });

    if (!dbUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const district = dbUser.districtId;
    const subDistrict = dbUser.subDistrictId;
    const facility = dbUser.facilityId;

    const obj = {
      districts: [],
      subDistricts: [],
      facilities: []
    };

    if (!district) {
      obj.districts = await District.find({});
    } else {
      const foundDistrict = await District.findOne({ districtId: district });
      if (foundDistrict) {
        obj.districts.push(foundDistrict);
      }
    }

    if (!subDistrict) {
      for (const dist of obj.districts) {
        const subDistricts = await SubDistrict.find({ districtId: dist.districtId });
        obj.subDistricts.push(...subDistricts);
      }
    } else {
      const foundSubDistrict = await SubDistrict.findOne({ subDistrictId: subDistrict });
      if (foundSubDistrict) {
        obj.subDistricts.push(foundSubDistrict);
      }
    }

    if (!facility) {
      for (const subDist of obj.subDistricts) {
        const facilities = await Facility.find({ subDistrictId: subDist.subDistrictId });
        obj.facilities.push(...facilities);
      }
    } else {
      const foundFacility = await Facility.findOne({ facilityId: facility });
      if (foundFacility) {
        obj.facilities.push(foundFacility);
      }
    }

    res.status(200).json(obj);
  } catch (error) {
    console.error("Error fetching domains:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;