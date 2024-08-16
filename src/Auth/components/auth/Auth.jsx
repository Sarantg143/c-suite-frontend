import React, { useEffect, useState } from "react";
import "./auth.css";
import assets from "../assets/assets";
import EmailSuccessResponse from "./EmailSuccessResponse";
import gsap from "gsap";
import ForgotPassword from "./ForgotPassword";
import Login from "./Login";
import SignUp from "./SignUp";

const Auth = () => {
  const [currentRightSlide, setCurrentRightSlide] = useState("login");
  const [currentLeftSlide, setCurrentLeftSlide] = useState("forgot-password");
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState(null);

  const toggleAnimation = () => {
    const t1 = gsap.timeline();
    t1.to(
      "#animation-fromRight",
      { xPercent: -10, duration: 0.5, zIndex: 0 },
      0
    );
    t1.to(".auth-content-left", { xPercent: 150, duration: 0.5 }, 0);
    t1.to("#animation-fromLeft", { xPercent: 0, duration: 0.5, zIndex: 10 }, 0);
  };

  const toggleAnimationBack = () => {
    const t1 = gsap.timeline();
    t1.to("#animation-fromLeft", { xPercent: 10, duration: 0.5, zIndex: 0 }, 0);
    t1.to(
      "#animation-fromRight",
      { xPercent: 0, duration: 0.5, zIndex: 10 },
      0
    );
    t1.to(".auth-content-left", { xPercent: 0, duration: 0.5 }, 0);
  };

  const handleSlideChage = (slide) => {
    if (slide === "login" || slide === "email-response") {
      toggleAnimationBack();
      setCurrentRightSlide(slide);
    }
    if (slide === "signup" || slide === "forgot-password") {
      toggleAnimation();
      setCurrentLeftSlide(slide);
    }
  };

  const renderLeftSlide = () => {
    if (currentLeftSlide === "forgot-password")
      return (
        <ForgotPassword
          toggleSlide={(slide) => handleSlideChage(slide)}
          updateEmail={(email) => setForgotPasswordEmail(email)}
        />
      );
    if (currentLeftSlide === "signup")
      return <SignUp toggleSlide={(slide) => handleSlideChage(slide)} />;
  };

  const renderRightSlide = () => {
    if (currentRightSlide === "login")
      return <Login toggleSlide={(slide) => handleSlideChage(slide)} />;
    if (currentRightSlide === "email-response")
      return (
        <EmailSuccessResponse
          toggleSlide={(slide) => handleSlideChage(slide)}
          email={forgotPasswordEmail}
        />
      );
  };

  useEffect(() => {
    const t2 = gsap.timeline();
    const t4 = gsap.timeline();
    gsap.set(".auth-bg-svg", { autoAlpha: 1 });
    t2.to(
      ".auth-bg-svg",
      {
        xPercent: -110,
        duration: 1,
        opacity: 1,
        scale: 1,
        stagger: {
          each: 2,
          repeat: -1,
          repeatDelay: 5,
        },
      },
      1
    );
    t2.to(
      ".auth-bg-svg",
      {
        xPercent: -210,
        duration: 1,
        stagger: { each: 2, repeat: -1, repeatDelay: 5 },
        opacity: 0,
        scale: 0.5,
        delay: 2,
      },
      1
    );
    t4.to(
      ".circle-1",
      {
        width: "1.5rem",
        x: -6,
        duration: 0.4,
        stagger: { each: 2, repeat: -1, repeatDelay: 5.7 },
      },
      1
    );
    t4.to(
      ".circle-1",
      {
        width: "0.6rem",
        duration: 0.3,
        x: 0,
        stagger: { each: 2, repeat: -1, repeatDelay: 5.8 },
        delay: 2,
      },
      1
    );
  }, []);

  return (
    <div className="screen-container">
      <div className="main-container">
        <div id="animation-fromLeft" className="left-panel">
          {renderLeftSlide()}
        </div>
        <div className="auth-content-left">
          <div className="image-container">
            <img
              src={assets.Images.Auth_Marquee_1}
              alt="login-svg"
              className="auth-bg-svg"
            />
            <img
              src={assets.Images.Auth_Marquee_3}
              alt="login-svg"
              className="auth-bg-svg"
            />
            <img
              src={assets.Images.Auth_Marquee_2}
              alt="login-svg"
              className="auth-bg-svg"
            />
          </div>
          <div className="circle-container">
            <div className="circle"></div>
            <div className="circle circle-2"></div>
            <div className="circle circle-3"></div>
          </div>
        </div>
        <div id="animation-fromRight" className="right-panel">
          {renderRightSlide()}
        </div>
      </div>
    </div>
  );
};

export default Auth;
