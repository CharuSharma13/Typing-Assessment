export const registerFormDetails = {
  identifier: "register",
  formName: "Adventure starts here!",
  formDescription: "Please create your account and start the adventure",
  fieldNames: ["name", "email", "password"],
  btnTitle: "Register",
  alternative: [
    {
      text: "Already have an account? <span>Sign in</span> instead",
      cta: "/login",
    },
  ],
};

export const loginFormDetails = {
  identifier: "login",
  formName: "Welcome Back!",
  formDescription: "Please login to your account and start the adventure",
  fieldNames: ["email", "password"],
  btnTitle: "Login",
  alternative: [
    {
      text: "<span>forgot Password?</span>",
      cta: "/password/reset",
    },
    {
      text: "Don't have an account? <span>Register</span>",
      cta: "/register",
    },
  ],
};

export const resetPasswordDetails = {
  identifier: "resetPassword",
  formName: "Forgotten your password?",
  formDescription: " Please enter your email with new password",
  fieldNames: ["email", "password"],
  btnTitle: "Reset My Password",
  alternative: [
    {
      text: "Go Back to <span>Sign In</span>",
      cta: "/login",
    },
  ],
};
