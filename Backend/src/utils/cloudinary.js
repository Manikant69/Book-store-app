import {v2 as cloudinary} from 'cloudinary';
import fs from "fs";

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
})

const uploadOnCloudinary = async(localFilePath)=>{
    try {
        if(!localFilePath){
            console.log("no local path is provided")
            return null;
        }

        console.log("i am inside cloudinary")

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type:"auto",
        })

        fs.unlinkSync(localFilePath);

        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath);
        console.log("uploading failed", error)
        return null;
    }
}

export {uploadOnCloudinary};