import React from "react";
import "./ContactUs.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhone,
  faEnvelope,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";

import {
  faInstagram,
  faFacebook,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";

function ContactUs() {
  return (
    <div className="contactUs" id="contact">
      <section className="leftcontainer">
        <div className="leftRow">
          <h1>Contact Us</h1>
          <p>
            Feel free to get in touch with us. We are always open to discussing
            new projects, creative ideas, or opportunities to be part of your
            vision.
          </p>
        </div>
        <div className="leftRow">
          <a className="phone" href="tel:+919865149951">
            <FontAwesomeIcon icon={faPhone} />
            <div className="c1">+91-9865149951</div>
          </a>
          <a className="mail" href="mailto:info@lmsportal.co.in">
            <FontAwesomeIcon icon={faEnvelope} />
            <div className="c1">info@lmsportal.co.in</div>
          </a>
          <a
            className="location"
            href="https://www.google.com/maps/place/102+Street+4657+Road"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon icon={faLocationDot} />
            <div className="c1">102 Street 4657 Road</div>
          </a>
        </div>
        <div className="leftRow">
          <a
            className="facebook"
            href="https://www.facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
          >
            <FontAwesomeIcon icon={faFacebook} />
          </a>
          <a
            className="twitter"
            href="https://www.twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
          >
            <FontAwesomeIcon icon={faXTwitter} />
          </a>
          <a
            className="instagram"
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <FontAwesomeIcon icon={faInstagram} />
          </a>
        </div>
      </section>
      <section className="rightcontainer">
        <div className="rightContainerBox">
          <h6>Contact Information</h6>
          <form>
            <div className="rows">
              <div className="inputgroup">
                <input
                  type="text"
                  name="firstname"
                  placeholder=" "
                  id="firstname"
                />
                <label htmlFor="firstname">First Name</label>
              </div>
              <div className="inputgroup">
                <input
                  type="text"
                  name="lastname"
                  placeholder=" "
                  id="lastname"
                />
                <label htmlFor="lastname">Last Name</label>
              </div>
            </div>
            <div className="rows">
              <div className="inputgroup">
                <input type="text" name="Email" placeholder=" " id="email" />
                <label htmlFor="email">Email</label>
              </div>
              <div className="inputgroup">
                <input
                  type="text"
                  name="Companyname"
                  placeholder=" "
                  id="companyname"
                />
                <label htmlFor="companyname">Company Name</label>
              </div>
            </div>
            <div className="messagegroup">
              <textarea name="message" placeholder=" " id="message"></textarea>
              <label htmlFor="message">Have any message / Queries ?</label>
            </div>
            <div className="submit">
              <input type="submit" value="Submit" />
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}

export default ContactUs;