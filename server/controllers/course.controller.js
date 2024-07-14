import "dotenv/config";
import Course from "../models/course.model.js";
import AppError from "../utils/error.util.js";
import cloudinary from "cloudinary";
import fs from "fs/promises";

const getAllCourses = async (req, res, next) => {
    try {
        const courses = await Course.find({}).select("-lectures");
        res.status(200).json({
            success: true,
            message: "All courses ",
            courses,
        });
    } catch (error) {
        return next(new AppError("Unable to find Courses ! please try again", 500));
    }
};

const getAllLecturesByCourseId = async (req, res, next) => {
    try {
        const { id } = req.params;

        const course = await Course.findById(id);
        if (!course) {
            return next(new AppError("Invalid Course id ! ", 400));
        }

        return res.status(200).json({
            success: true,
            message: "Course lectures fetched successfully ",
            lectures: course.lectures,
        });
    } catch (error) {
        return next(new AppError(`Unable to fetch lectures !`, 500));
    }
};

const createCourse = async (req, res, next) => {
    const { title, description, category, createdBy } = req.body;
    if (!title || !description || !category || !createdBy) {
        return next(new AppError("All fields are required !", 400));
    }

    const course = await Course.create({
        title,
        description,
        category,
        createdBy,
    });

    if (!course) {
        return next(
            new AppError("Course couldn't be created ! please try Again ", 500)
        );
    }
    if (req.file) {
        const result = await cloudinary.v2.uploader.upload(req.file.path, {
            folder: "lms",
        });
        if (result) {
            (course.thumbnail.public_id = result.public_id),
                (course.thumbnail.secure_url = result.secure_url);
        }
        fs.rm(`uploads/${req.file.filename}`);
    }

    await course.save();
    return res.status(200).json({
        success: true,
        message: "Course created successfully",
        course,
    });
};

const updateCourse = (req, res, next) => {
    try {
        const { id } = req.params;
        const course = Course.findByIdAndUpdate(
            id,
            {
                $set: req.body,
            },
            {
                runValidators: true, // to check that new given datas are correct or not according to schema
            }
        );
        if (!course) {
            return next(new AppError("Course doesn't exist !", 400));
        }
        return res.status(200).json({
            success: false,
            message: "Course updated successfully",
            course,
        });
    } catch (error) {
        return next(
            new AppError("Unable to update this course ! please try Again", 500)
        );
    }
};

const removeCourse = async (req, res, next) => {
    const { id } = req.params
    const course = await Course.findById(id);
    if (!course) {
        return next(new AppError("Course doesn't exist !", 400));
    }

    await Course.findByIdAndDelete(id);

    return res.status(200).json(
        {
            success: true,
            message: "Course deleted successfully "
        }
    )
};

const addLecturesToCourseById = async (req,res,next) => {
        const {title,description} = req.body
        const {id} = req.params
        if(!title || !description ){
            return next(new AppError("All fields are required !", 400));
        }
        const course = await Course.findById(id);
        if(!course){
            return next(new AppError("Course doesn't exist !", 400));
        }

        const lectureData = {
            title,
            description,
            lecture : {}
        }

        if(req.file){
            const result = await cloudinary.v2.uploader.upload(req.file.path, {
                folder: "lms",
            });
            if (result) {
                (lectureData.lecture.public_id = result.public_id),
                    (lectureData.lecture.secure_url = result.secure_url);
            }
            fs.rm(`uploads/${req.file.filename}`);
        }

        course.lectures.push(lectureData);
        course.noOfLectures = course.lectures.length;
        await course.save();

        res.status(200).json({
            success : true,
            message : "Leactures added successfully "
        })
}
export {
    getAllCourses,
    getAllLecturesByCourseId,
    createCourse,
    updateCourse,
    removeCourse,
    addLecturesToCourseById
};
