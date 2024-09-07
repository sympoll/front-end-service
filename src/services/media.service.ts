import axios from "axios";
import { throwAxiosErr } from "./error.service";

const mediaServiceUrl = import.meta.env.VITE_MEDIA_SERVICE_URL;

const cmpName = "Media-Service";

export async function uploadUserProfileImage(
  userId: string,
  file: File,
  type: "profile picture" | "profile banner" | undefined
) {
  if (type === undefined) {
    console.error("cannot upload user profile image, type is undefined.");
  }
  console.log(cmpName, "Uploading " + type + " for user with ID: " + userId);

  // Prepare the form data
  const formData = new FormData();
  formData.append("file", file); // The file to be uploaded

  // Create a Blob for the uploadInfo to specify the Content-Type as application/json
  const uploadInfoBlob = new Blob([JSON.stringify({ ownerUserId: userId })], {
    type: "application/json"
  });

  formData.append("uploadInfo", uploadInfoBlob);

  // Send a request to the Media Service to upload the profile image of the user.
  try {
    const response = await axios.post(
      type === "profile picture"
        ? import.meta.env.VITE_MEDIA_SERVICE_UPLOAD_USER_PROFILE_PICTURE
        : import.meta.env.VITE_MEDIA_SERVICE_UPLOAD_USER_PROFILE_BANNER,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    );

    console.log(cmpName, "Successfully uploaded " + type + " for user with ID: " + userId);

    return response.data;
  } catch (err) {
    console.error(
      cmpName,
      "Error uploading " + type + " for user with ID: " + userId + ". Error info: " + err
    );
    throw throwAxiosErr(err);
  }
}

export async function uploadGroupProfileImage(
  groupId: string,
  file: File,
  type: "profile picture" | "profile banner" | undefined
) {
  if (type === undefined) {
    console.error("cannot upload group profile image, type is undefined.");
  }
  console.log(cmpName, "Uploading " + type + " for group with ID: " + groupId);

  // Prepare the form data
  const formData = new FormData();
  formData.append("file", file); // The file to be uploaded

  // Create a Blob for the uploadInfo to specify the Content-Type as application/json
  const uploadInfoBlob = new Blob([JSON.stringify({ groupId: groupId })], {
    type: "application/json"
  });

  formData.append("uploadInfo", uploadInfoBlob);

  // Send a request to the Media Service to upload the profile image of the user.
  try {
    const response = await axios.post(
      type === "profile picture"
        ? import.meta.env.VITE_MEDIA_SERVICE_UPLOAD_GROUP_PROFILE_PICTURE
        : import.meta.env.VITE_MEDIA_SERVICE_UPLOAD_GROUP_PROFILE_BANNER,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    );

    console.log(cmpName, "Successfully uploaded " + type + " for group with ID: " + groupId);

    return response.data;
  } catch (err) {
    console.error(
      cmpName,
      "Error uploading " + type + " for group with ID: " + groupId + ". Error info: " + err
    );
    throw throwAxiosErr(err);
  }
}
