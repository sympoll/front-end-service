import axios from "axios";
import { UserData } from "../models/UserData.model";
import { throwAxiosErr } from "./error.service";

const userServiceUrl = 
    import.meta.env.VITE_BASE_URL + 
    import.meta.env.VITE_API_GATEWAY_URL + 
    import.meta.env.VITE_USER_SERVICE_URL;


/**
 * 
 * @param userData 
 * @param setError 
 */
export function validateUserData(
    userData : UserData,
    passwordConfirm : string,
    setErrorMessage : React.Dispatch<React.SetStateAction<string>>
) : boolean   {
    // Validate username
    if (!validateUsername(userData.username, setErrorMessage)) {
      return false;
    }
  
    // Validate email
    if (!validateEmail(userData.email, setErrorMessage)) {
        return false;
        }

    // Validate password
    if (!validatePassword(userData.password, passwordConfirm, setErrorMessage)) {
      return false;
    }
  
    return true;
  }

function validateUsername(
    username: string,
    setErrorMessage : React.Dispatch<React.SetStateAction<string>>
): boolean {
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

    // TODO: -----------------------------------
    // Check if the username chosen already exist
    // if (checkUsernameExists(username)) {
    //   setErrorMessage(`The username ${username} already exists.`);
    //   return false;
    // }
    return true;
}

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

function validateEmail(
    email: string,
    setErrorMessage : React.Dispatch<React.SetStateAction<string>>
): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email) {
        setErrorMessage("Email is required.");
        return false;
    }
    if (!email.match(emailPattern)) {
        setErrorMessage("Invalid email format.");
        return false;
    }

    // TODO: -------------------
    // Check if the chosen email already exist
    // if (checkEmailExists(email)) {
    //   setErrorMessage(`An account with the email ${email} already exists.`);
    //   return false;
    // }
    return true;
}


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

        return response;
    } catch (err) {
        console.error("Error signing up the user: " + userData + ".");
        throw throwAxiosErr(err);
    }
}