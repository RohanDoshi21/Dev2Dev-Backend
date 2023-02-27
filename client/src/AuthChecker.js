import Cookies from "universal-cookie";

const cookies = new Cookies();

function authCheck() {
  const status = cookies.get("jwt_authorization");
  console.log(status);
  return status !== undefined;
}
function logOut() {
  cookies.remove("jwt_authorization");
}

const config = {
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + cookies.get("jwt_authorization")
    }
}


export {authCheck, logOut, config};
