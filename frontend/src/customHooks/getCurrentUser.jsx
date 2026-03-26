import { useEffect } from "react";
import { serverUrl } from "../App";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../redux/userSlice";

const getCurrentUser = () => {
  let dispatch = useDispatch();

  // useEffect to run automatically
  useEffect(() => {
    const fetchUser = async () => {
      try {
        let result = await axios.get(serverUrl + "/api/user/currentuser", {
          withCredentials: true,
        });
        dispatch(setUserData(result.data)); // to set data on UserSlice
      } catch (error) {
        console.log(error);
        dispatch(setUserData(null)); // set data to null again
      }
    };
    fetchUser();
  }, []);
};

export default getCurrentUser;
