import { Router } from "express";
import {
    createCourse,
    getAllCourses,
    getAllLecturesByCourseId,
    removeCourse,
    updateCourse,
    addLecturesToCourseById
} from "../controllers/course.controller.js";
import { authorizedRoles, isLoggedIn } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";

const router = new Router();

router
    .route("/")
    .get(isLoggedIn, getAllCourses)
    .post(isLoggedIn, authorizedRoles("ADMIN"), upload.single("thumbnail"), createCourse);
router
    .route("/:id")
    .get(isLoggedIn,authorizedRoles("ADMIN"), getAllLecturesByCourseId)
    .put(isLoggedIn,authorizedRoles("ADMIN"), updateCourse)
    .delete(isLoggedIn, authorizedRoles("ADMIN"), removeCourse)
    .post(isLoggedIn, authorizedRoles("ADMIN"), addLecturesToCourseById)

export default router;
