import axios from "axios";
import { throwAxiosErr } from "./error.service";

const mediaServiceUrl = 
    import.meta.env.VITE_MEDIA_SERVICE_URL;

    const cmpName = "Media-Service";

export async function uploadProfilePicture(
    userId: number,
    file: File
    ) {
    console.log(cmpName, "Uploading profile picture for user with ID: " + userId);
    
        // Prepare the form data
    const formData = new FormData();
    formData.append("file", file); // The file to be uploaded
    formData.append(
        "uploadInfo", 
        JSON.stringify({ ownerUserId: userId }) // The additional data as a JSON string
    );

    // Send a request to the Media Service to upload the profile picture of the user.
    try {
        const response = await axios
        .create({
            baseURL: mediaServiceUrl,
            headers: {
            "Content-Type": "application/json",
            },
            withCredentials: true,
        })
        .post(
            import.meta.env.VITE_MEDIA_SERVICE_UPLOAD_PROFILE_PICTURE,
            formData
        );
    
        console.log(cmpName, "Successfully uploaded profile picture for user with ID: " + userId);
    
        return response.data;
    } catch (err) {
        console.error(
        cmpName, "Error uploading profile picture for user with ID: " + userId +
            ". Error info: " +
            err
        );
        throw throwAxiosErr(err);
    }
    }