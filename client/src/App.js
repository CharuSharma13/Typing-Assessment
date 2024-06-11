import "./App.css";
import Form from "./components/form";
import TypingGame from "./components/typingGame";
import useWindowDimensions from "./utilities/utilities";
import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Outlet,
} from "react-router-dom";
import { isExpired, decodeToken } from "react-jwt";
import Cookies from "js-cookie";
import Navbar from "./components/common/navbar";
import Profile from "./components/profile";
import {
  loginFormDetails,
  registerFormDetails,
  resetPasswordDetails,
} from "./data/form";

function App() {
  const token = Cookies.get("token") || "";
  const decodedToken = decodeToken(token);
  const isTokenExpired = isExpired(token);
  let userData = null;
  if (decodedToken && !isTokenExpired) {
    userData = { ...decodedToken, token: token };
  }
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Root userData={userData} />}>
        <Route index element={<TypingGame userData={userData} />} />
        <Route path="/profile" element={<Profile userData={userData} />} />
        <Route
          path="/login"
          element={<Form formDetails={loginFormDetails} userData={userData} />}
        />
        <Route
          path="/register"
          element={
            <Form formDetails={registerFormDetails} userData={userData} />
          }
        />
        <Route
          path="/password/reset"
          element={
            <Form formDetails={resetPasswordDetails} userData={userData} />
          }
        />
      </Route>
    )
  );
  return (
    <div className="App">
      <RouterProvider router={router} userData={userData} />
    </div>
  );
}

const Root = ({ userData }) => {
  const { width } = useWindowDimensions();
  return (
    <>
      <Navbar userData={userData} />
      <Outlet />
    </>
  );
};

export default App;
