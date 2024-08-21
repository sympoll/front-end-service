import axios from "axios";
import { UserData } from "../models/UserData.model";
import { throwAxiosErr } from "./error.service";

const userServiceUrl = 
    import.meta.env.VITE_BASE_URL + 
    import.meta.env.VITE_API_GATEWAY_URL + 
    import.meta.env.VITE_USER_SERVICE_URL;


    
/**
 * Send a request to user-service to signup the user.
 * @param userData Information of the user, filled in the sign up form.
 */
export async function invokeSignUp(userData : UserData) {
    try {
        const response = await axios
            .create({
                baseURL: userServiceUrl,
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true
            })
            .post("", userData);

        return response.data;
    } catch (err) {
        console.error("Error signing up the use:r " + userData + ".");
        throw throwAxiosErr(err);
    }
}