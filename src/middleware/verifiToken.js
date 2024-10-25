import axios from "axios";
// import { useDispatch } from "react-redux";
import { logOut } from "../features/auth/authSlice";
const VITE_API_URL = import.meta.env.VITE_API_URL

const verifyToken = async (token, dispatch, refresh) => {
  if (token) {
    const url = `${VITE_API_URL}/auth/verify-token`; // Adjust the endpoint as needed
    const config = {
      headers: {
        authorization: `Bearer ${token}`, // Add the token as Authorization header
      },
      withCredentials: true, // Include cookies in the request
    };

    try {
      const response = await axios.post(url, {}, config);

      return response.data.verified;
    } catch (error) {
      console.log(error.response.data.statusCode);
      if (error.response.data.statusCode === 403) {
        refresh();
      } else {
        dispatch(logOut());
        throw error;
      }
      // console.error("Error verifying token:", error.response.data);
    }
  } else {
   return false
  }
};

export default verifyToken;
