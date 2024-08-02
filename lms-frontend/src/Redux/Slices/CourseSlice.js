import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axiosInstance from "../../Helpers/axiosInstance"
import { toast } from "react-hot-toast";

const initialState = {
    courseData:[]
}

export const getAllCourses = createAsyncThunk("/course/get",async() => {
    try {
        const res = axiosInstance.get("/courses/");
        toast.promise(res,{
            loading: "Wait! fetching courses...",
            success: "Course loaded succesfully",
            error: "Failed to fetch courses"
        })
        return (await res).data.courses;
    } catch(error) {
        toast.error(error?.response?.data?.message);
    }
})

const courseSlice = createSlice({
    name: 'course',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllCourses.fulfilled, (state, action) => {
               if(action.payload){
                state.courseData = [...action.payload];
               }
            })
           
    }
})

export default courseSlice.reducers;
