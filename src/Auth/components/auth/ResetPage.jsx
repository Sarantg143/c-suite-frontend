import React, { useState } from "react";
import assets from "../assets/assets";
import { auth } from "../../firebase/firebaseConfig";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import { confirmPasswordReset} from "@firebase/auth";

function useQuery() {
  const location = useLocation();
  return new URLSearchParams(location.search);
}

const ResetPage = () => {
  const [form, setForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  
  // const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const query = useQuery();

  const handleValueChange = (type, value) => {
    setForm({ ...form, [type]: value });
  };

  const handleChangePassword = async () => {
    if (form.newPassword && form.newPassword !== form.confirmPassword) {
      toast.warning("Passwords do not match!");
      return;
    }
    try {
      await confirmPasswordReset(auth, query.get("oobCode"), form.newPassword);
      toast.success("Password updated successfully!");
    } catch (err) {
      toast.error(`Error: ${err.message}`);
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-top">
        <div className="logo-container">
          <img src={assets.Images.CSuiteLogo} alt="logo" className="logo-img" />
        </div>
        <div className="forgot-password-content">
          <img
            src={assets.Images.Lock}
            alt="forgot-password"
            className="forgot-password-img"
          />
          <h1 className="forgot-password-title">Change Password</h1>
          <p className="forgot-password-subtitle">
            Update your password with a new one
          </p>
          <form className="forgot-password-form">
            <div className="input-container">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                onChange={(e) =>
                  handleValueChange("newPassword", e.target.value)
                }
                className="input"
              />
              <img
                src={assets.Images.Lock_Vector}
                alt="mail-icon"
                className="input-icon"
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>
            <div className="input-container">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm Password"
                onChange={(e) =>
                  handleValueChange("confirmPassword", e.target.value)
                }
                className="input"
              />
              <img
                src={assets.Images.Lock_Vector}
                alt="mail-icon"
                className="input-icon"
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>
            <div
              onClick={() => handleChangePassword()}
              className="update-password-button"
            >
              <p>Update Password</p>
            </div>
          </form>
        </div>
        {/* {message && <p className="message">{message}</p>} */}
      </div>
    </div>
  );
};

export default ResetPage;
