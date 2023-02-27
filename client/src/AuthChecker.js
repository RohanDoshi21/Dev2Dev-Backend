import Cookies from "universal-cookie";

function authCheck() {
  const cookies = new Cookies();
  const status = cookies.get("jwt_authorization");
  console.log(status);
  return status !== undefined;
}
function logOut() {
  const cookies = new Cookies();
  cookies.remove("jwt_authorization");
}
export {authCheck, logOut};
