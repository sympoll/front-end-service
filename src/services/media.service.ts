import axios from "axios";
import { throwAxiosErr } from "./error.service";

const mediaServiceUrl = 
    import.meta.env.VITE_BASE_URL +
    import.meta.env.VITE_API_GATEWAY_URL + 
    import.meta.env.VITE_MEDIA_SERVICE_URL;

    const cmpName = "Media-Service";

export async function uploadProfilePicture(
    userId: string,
    file: File
    ) {
    console.log(cmpName, "Uploading profile picture for user with ID: " + userId);
    
    // Prepare the form data
    const formData = new FormData();
    formData.append("file", file); // The file to be uploaded

    // Create a Blob for the uploadInfo to specify the Content-Type as application/json
    const uploadInfoBlob = new Blob([JSON.stringify({ ownerUserId: userId })], {
        type: "application/json",
    });

    formData.append("uploadInfo", uploadInfoBlob);


    // Send a request to the Media Service to upload the profile picture of the user.
    try {
        const response = await axios
        .create({
            baseURL: mediaServiceUrl,
            headers: {
            "Content-Type": "multipart/form-data",
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