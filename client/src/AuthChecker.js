import Cookies from "universal-cookie";

const authCheck = async () => {
  const cookies = new Cookies();
  const status = await cookies.get("jwt_authorization");
  console.log("Status: ", status);
  return status !== undefined;
};
function logOut() {
  const cookies = new Cookies();
  cookies.remove("jwt_authorization");
}
export { authCheck, logOut };
