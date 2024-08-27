import axios from "axios";
import { UserSignupData } from "../models/UserSignupData.model";
import { throwAxiosErr } from "./error.service";
import { UserData } from "../models/UserData.model";

const userServiceUrl = 
    import.meta.env.VITE_BASE_URL + 
    import.meta.env.VITE_API_GATEWAY_URL + 
    import.meta.env.VITE_USER_SERVICE_URL;


/**
 * 
 * @param userData 
 * @param setError 
 */
export async function validateUserData(
    userData : UserSignupData,
    passwordConfirm : string,
    setErrorMessage : React.Dispatch<React.SetStateAction<string>>
) : Promise<boolean>   {
    if (!(await validateUsername(userData.username, setErrorMessage))) {
        return false;
    }
    if (!(await validateEmail(userData.email, setErrorMessage))) {
        return false;
    }
    if (!validatePassword(userData.password, passwordConfirm, setErrorMessage)) {
        return false;
    }
    return true;
  }

/**
 * Validate the entered username.
 * @param username Username to check.
 * @param setErrorMessage Hook to display the error message.
 * @returns Promise of a boolean value, true if valid, otherwise false.
 */
async function validateUsername(
    username: string,
    setErrorMessage : React.Dispatch<React.SetStateAction<string>>
): Promise<boolean> {
    const validCharactersPattern = /^[a-zA-Z0-9_]*$/;
    if (!username) {
        setErrorMessage("Username is required.");
        return false;
    }
    if (!username.match(validCharactersPattern)) {
        setErrorMessage("Username contains invalid characters.");
        return false;
    }
    if (username.length < 4) {
        setErrorMessage("Username is too short. It must be at least 4 characters long.");
        return false;
    }

    // Check if the username chosen already exists in the database
    try {
        const isUsernameTaken = await checkUsernameTaken(username);
        if(isUsernameTaken) {
            setErrorMessage(`The username ${username} already exists.`);
            return false;
        }
    } catch(err) {
        setErrorMessage("Could not check if username was already taken. " + err);
    }
    return true;
}

/**
 * Validate the entered password.
 * @param password Password to check.
 * @param setErrorMessage Hook to display the error message.
 * @returns Promise of a boolean value, true if valid, otherwise false.
 */
function validatePassword(
    password: string,
    passwordConfirm: string,
    setErrorMessage : React.Dispatch<React.SetStateAction<string>>
): boolean {
    const validCharactersPattern = /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{}|;:'",.<>?/`~]*$/;
    if (!password) {
        setErrorMessage("Password is required.");
        return false;
    }
    if (!password.match(validCharactersPattern)) {
        setErrorMessage("Password contains invalid characters.");
        return false;
    }
    if (password.length < 6) {
        setErrorMessage("Password is too short. It must be at least 6 characters long.");
        return false;
    }
    if(password !== passwordConfirm) {
        setErrorMessage("The password and confirmation password do not match.");
        return false;
    }
    return true;
}

/**
 * Validate the entered email.
 * @param email Email to check.
 * @param setErrorMessage Hook to display the error message.
 * @returns Promise of a boolean value, true if valid, otherwise false.
 */
async function validateEmail(
    email: string,
    setErrorMessage : React.Dispatch<React.SetStateAction<string>>
): Promise<boolean> {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email) {
        setErrorMessage("Email is required.");
        return false;
    }
    if (!email.match(emailPattern)) {
        setErrorMessage("Invalid email format.");
        return false;
    }

    // Check if the email chosen already exists in the database
    try {
        const isEmailTaken = await checkEmailTaken(email);
        if(isEmailTaken) {
            setErrorMessage(`The email ${email} already exists.`);
            return false;
        }
    } catch(err) {
        setErrorMessage("Could not check if email was already taken. " + err);
    }
    return true;
}

/**
 * Send a request to user-service to check if the username is already taken.
 * @param username Username to check.
 */
export async function checkUsernameTaken(username : string) : Promise<boolean>{
    try {
        const response = await axios
            .create({
                baseURL: userServiceUrl,
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true
            })
            .get(import.meta.env.VITE_USER_SERVICE_USERNAME_TAKEN, { params: { username } });

        return response.data.isUsernameExists;
    } catch (err) {
        console.error("Error validating the username: " + username + ".");
        throw throwAxiosErr(err);
    }
}

/**
 * Send a request to user-service to check if the email is already taken.
 * @param email Email to check.
 */
export async function checkEmailTaken(email : string) : Promise<boolean> {
    try {
        const response = await axios
            .create({
                baseURL: userServiceUrl,
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true
            })
            .get(import.meta.env.VITE_USER_SERVICE_EMAIL_TAKEN, { params: { email } });

        return response.data.isEmailExists;
    } catch (err) {
        console.error("Error validating the email: " + email + ".");
        throw throwAxiosErr(err);
    }
}

/**
 * Send a request to user-service to signup the user.
 * @param userData Information of the user, filled in the sign up form.
 * @returns Full information of the signed up user.
 */
export async function invokeSignUp(userData : UserSignupData) : Promise<UserData>{
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
        console.error("Error signing up the user: " + userData + ".");
        throw throwAxiosErr(err);
    }
}