import { Schema, model } from "mongoose";

const courseSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required !"],
      minLength: [3, "Title should be atleast of 3 characters !"],
      maxLength: [60, "Title cann't be greather than 60 characters !"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required !"],
      minLength: [3, "Description should be atleast of 3 characters !"],
      maxLength: [60, "Description cann't be greather than 60 characters !"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Please define category !"],
    },
    thumbnail: {
      public_id: {
        type: String,
        // required: true,
      },
      secure_url: {
        type: String,
        // required: true,
      },
    },
    lectures: [
      {
        title: {
          type: String,
          description: String,
          lecture: {
            // thumbnail of video
            public_id: String,
            secure_url: String,
          },
        },
      },
    ],
    noOfLectures: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: String,
      required: [true, "Created by is important !"],
      default: "Unknown",
    },
  },
  {
    timestamps: true,
  }
);

const Course = model("Course", courseSchema);
export default Course;
