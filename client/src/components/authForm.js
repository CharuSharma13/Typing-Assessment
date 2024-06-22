import React, { useState, useRef, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Form from "./common/form";
import hero from "../images/hero.svg";

const AuthForm = ({ formDetails, userData }) => {
  axios.defaults.withCredentials = true;

  let [searchParams] = useSearchParams();
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    if (userData) {
      navigate("/");
    }
  }, [userData, navigate]);

  const handleState = (navigateTo) => {
    setErrorMessage("");
    const elements = inputRef.current.querySelectorAll("input");
    elements.forEach((items) => {
      items.value = "";
    });
    navigate(navigateTo);
  };

  const handleSubmit = async (event, userData) => {
    event.preventDefault();
    const elements = Array.from(inputRef.current.querySelectorAll("input"));
    const errorMessages = elements
      .map((item) => {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        let errorMessage = "";
        const value = item.value;
        const valueLength = value.length;
        if (
          item.getAttribute("fieldtype") === "name" &&
          (!valueLength || valueLength < 4)
        ) {
          errorMessage = "Username should contain at least 4 characters";
        } else if (
          item.getAttribute("fieldtype") === "email" &&
          (!valueLength || value.match(emailPattern) == null)
        ) {
          errorMessage = "Please enter a valid email";
        } else if (
          item.getAttribute("fieldtype") === "password" &&
          (!valueLength || valueLength < 8)
        ) {
          errorMessage = "Password should contain at least 8 characters";
        }
        return errorMessage;
      })
      .filter((errorMessage) => errorMessage !== "");
    if (errorMessages.length > 0) {
      setErrorMessage(errorMessages[0]);
    } else {
      try {
        const res = await axios(
          `/auth/${formDetails.identifier}`,
          {
            method: formDetails.identifier === "resetPassword" ? "put" : "post",
            data: userData,
          }       
        );

        if (res.status === 200) {
          localStorage.setItem("isLoggedIn", true);
          if (formDetails.identifier === "resetPassword") {
            setErrorMessage(res.data.message);
          } else {
            window.location.href = searchParams.get("destination") || "/";
          }
        }
      } catch (error) {
        const { status, data } = error.response;
        if (status === 401) {
          setErrorMessage(data.message);
        }
      }
    }
  };

  return (
    <div className={`page form ${formDetails.identifier}_form-wrapper`}>
      <img src={hero} alt="hero" className="hero-image" />
      <div className="cover wrapper">
        <Form
          formDetails={formDetails}
          handleMethod={handleSubmit}
          inputRef={inputRef}
          message={errorMessage}
          handleState={handleState}
        />
      </div>
    </div>
  );
};

export default AuthForm;
