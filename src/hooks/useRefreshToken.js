import { useDispatch } from "react-redux";
import { setCredentials, logOut } from "../features/auth/authSlice";
import { useRefreshMutation } from "../features/auth/authApiSlice";
import { useToast } from "@chakra-ui/react";

const useRefreshToken = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const [refresh] = useRefreshMutation();

  const refreshAccessToken = async () => {
    try {
      const response = await refresh().unwrap();
      if (response) {
        dispatch(setCredentials(response));
      } else {
        dispatch(logOut());
      }
    } catch (error) {
      // toast({
      //   title: "Session expired",
      //   description: "Login again",
      //   status: "error",
      //   duration: 5000,
      //   isClosable: true,
      //   position: "bottom",
      // });
      dispatch(logOut());
    }
  };

  return refreshAccessToken;
};

export default useRefreshToken;
