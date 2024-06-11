import React, { useState } from "react";
import { sanitize } from "isomorphic-dompurify";
import "../../css/form.css";

const Form = ({
  formDetails,
  handleMethod,
  inputRef,
  message,
  handleState,
}) => {
  const {
    formName,
    formDescription,
    fieldNames,
    btnTitle,
    identifier,
    alternative,
  } = formDetails;
  const [data, setData] = useState({});

  return (
    <>
      <div className="form_info">
        <h1 dangerouslySetInnerHTML={{ __html: sanitize(formName) }}></h1>
        <p>{formDescription}</p>
      </div>
      <div
        ref={inputRef}
        className={`input-wrapper ${identifier}_input-wrapper`}
      >
        {fieldNames.map((items, index) => {
          return (
            <input
              className="input-box"
              type={items === "password" ? items : "text"}
              fieldType={items}
              key={index}
              placeholder={items.charAt(0).toUpperCase() + items.slice(1)}
              onChange={(e) => {
                setData({
                  ...data,
                  [items.replaceAll(" ", "")]: e.target.value.trim(),
                });
              }}
            />
          );
        })}
      </div>
      <div className="button-wrapper">
        <p className="error-message">{message}</p>
        <div
          className="form-btn"
          onClick={(e) => {
            handleMethod(e, data);
          }}
        >
          {btnTitle}
        </div>

        {alternative &&
          alternative.map((items, index) => {
            return (
              <button
                className={`btn-links btn-${identifier}-${index + 1}`}
                onClick={() => {
                  handleState(items["cta"]);
                }}
                dangerouslySetInnerHTML={{ __html: sanitize(items["text"]) }}
              ></button>
            );
          })}
      </div>
    </>
  );
};

export default Form;
