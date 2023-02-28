import Cookies from "universal-cookie";
import { logoutUrl } from "./constants/urls";
import { useHistory } from "react-router-dom";

const cookies = new Cookies();

// const authCheck = async () => {
const authCheck = () => {
  // const token = await cookies.get("jwt_authorization");
  const token = localStorage.getItem("jwt_authorization");
  // console.log("Status: ", status);
  // console.log("Status: ", token);
  return token !== null;
};

const logOut = async () => {
  try {
    const token = await localStorage.getItem("jwt_authorization");
    console.log("My token is ", token);
    localStorage.removeItem("jwt_authorization");
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const res = await fetch(logoutUrl, options);
    const data = await res.json();
    res = data;
    console.log(data);
    return data;
  } catch (error) {
    console.log("ERROR: ", error);
    return { error: "Something went wrong" };
  }
};

const config = {
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + localStorage.getItem("jwt_authorization"),
  },
};

export { authCheck, logOut, config };
