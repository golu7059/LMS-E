import app from './app.js';
import cloudinary from 'cloudinary'
import Razorpay from 'razorpay'

const PORT = process.env.PORT || 5004;

// Cloudinary configuration 
cloudinary.v2.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET
})

// Razorpay configuration
export const razorpay = new Razorpay({
    key_id : process.env.CLOUDINARY_API_KEY,
    key_secret : process.env.CLOUDINARY_API_SECRET
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
