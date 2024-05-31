import {v2 as cloudianary} from 'cloudinary'
import fs from "fs"

cloudianary.config({ 
    cloud_name: process.env.CLOUDIANARY_CLOUD_NAME, 
    api_key: process.env.CLOUDIANARY_API_KEY, 
    api_secret: process.env.CLOUDIANARY_API_SECERT // Click 'View Credentials' below to copy your API secret
});

export const uploadOnCloudianary = async (localPath) => {
try {

    if(!localPath){
        return null
    }

    const response = await cloudianary.uploader.upload(localPath, {
        resource_type : "auto"
    })

    fs.unlinkSync(localPath)
    return response
    
} catch (error) {
    fs.unlinkSync(localPath)
    console.log(error, "file upload failed on cloudianary")
}
}