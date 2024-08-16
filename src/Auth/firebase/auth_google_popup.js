import axios from "axios";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { toast } from "react-toastify";
import { check, signupCheck } from "../../api/baseapi.js"; // Adjust the import path as needed
import { useLocation, useNavigate } from "react-router-dom";

const auth = getAuth();
const provider = new GoogleAuthProvider();

export const googlePopup = async (navigate, Courseid) => {

  let loc = "";

  const res = await signInWithPopup(auth, provider)
    .then(async (result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;
      console.log({ user, token });

      // Check if the user already exists
      try {
        const checkResponse = await check({ email: user.email });

        if (checkResponse.status === 200) {
          toast.success("User already registered. Logging in...");
          loc = login(checkResponse.data);
          return;
        }
        //  else {
        //   toast.info("User not found. Registering...");
        //   let data = {
        //     name: user.displayName,
        //     email: user.email,
        //     linkedin: null,
        //     password: null,
        //   };
        //   const config = {
        //     headers: { "Content-Type": "application/json" },
        //   };
        //   try {
        //     const signupResponse = await signupCheck(data, config);
        //     console.log(signupResponse.data);
        //     loc = login(signupResponse.data);
        //   } catch (signupError) {
        //     console.error("Signup error:", signupError);
        //     toast.error("Signup failed");
        //   }
        // }
      } catch (checkError) {
        if (checkError.response && checkError.response.status === 404) {
          toast.info("User not found. Registering...");
          let data = {
            name: user.displayName,
            email: user.email,
            linkedin: null,
            password: null,
          };
          const config = {
            headers: { "Content-Type": "application/json" },
          };
          try {
            const signupResponse = await signupCheck(data, config);
            console.log(signupResponse.data);
            loc = login(signupResponse.data);
          } catch (signupError) {
            console.error("Signup error:", signupError);
            toast.error("Signup failed");
          }
        } else {
          console.error("Check error:", checkError);
          toast.error("Error checking user");
        }
      }

      // if (loc === "home") {
      //   setTimeout(() => {
      //     if (Courseid) {
      //       navigate("../home/courseDetails/" + Courseid);
      //     } else {
      //       navigate("../home");
      //     }
      //   }, 5000);
      // } else if (loc === "quick-assessment") {
      //   setTimeout(() => {
      //     navigate("../quick-assessment");
      //   }, 5000);
      // }

      return loc;
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      const credential = GoogleAuthProvider.credentialFromError(error);
      console.log({ errorCode, errorMessage, credential });
      return { errorCode, errorMessage, credential };
    });

  return loc;
};

function login(data) {
  // Assuming data is already an object
  const userData = data;
  console.log(data._id)
  toast.success("Login Successful!");
  localStorage.setItem("userDataUpdated", JSON.stringify(userData));
  localStorage.setItem("isloggedin", true);
  localStorage.setItem("userid", data._id);
  localStorage.setItem("name", data.name);
  localStorage.setItem("email", data.email);
  localStorage.setItem("linkedin", data.linkedin);
  localStorage.setItem("elacomplete", data.elaComplete);
  
  return userData.elacomplete ? "home" : "quick-assessment";
}
