import { Navigate, createBrowserRouter } from "react-router-dom";
import { PageWrapper } from "../components/PageWrapper";
import { Main } from "../pages/Main/Main";
import { Login } from "../pages/Auth/Login/Login";
import { Register } from "../pages/Auth/Register/Register";
import { Verify } from "../pages/Auth/Verify/Verify";
import { Property } from "../pages/Property/Property";
import { Search } from "../pages/Search/Search";
import { Loader } from "../components/UI/Loader/Loader";
import { FAQ } from "../pages/FAQ/FAQ.jsx";
import { ForgotPassword } from "../pages/Auth/ForgotPassword/ForgotPassword";
import { MapView } from "../pages/MapView/MapView";
import { Profile } from "../pages/Profile/Profile";
import { Payment } from "../pages/Payment/Payment";
import { Gallery } from "../pages/Gallery/Gallery";
import { ShowMore } from "../pages/ShowMore/ShowMore";
import { EditProfile } from "../pages/EditProfile/EditProfile.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <PageWrapper Component={<Main />} />,
  },
  {
    path: "/search",
    element: <PageWrapper Component={<Search />} />,
  },
  {
    path: "/faq",
    element: <PageWrapper Component={<FAQ />} />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/forgotPassword",
    element: <ForgotPassword />,
  },
  {
    path: "/verify/:token",
    element: <Verify />,
  },
  {
    path: "/property/:id",
    element: <PageWrapper Component={<Property />} />,
  },
  {
    path: "/map",
    element: <PageWrapper Component={<MapView />} />,
  },
  {
    path: "/*",
    element: <Navigate to='/' />,
  },
  {
    path: "/payment/:id",
    element: <PageWrapper Component={<Payment />} />,
  },
  {
    path: "/property/:id/gallery",
    element: <PageWrapper Component={<Gallery />} />,
  },
  {
    path: "/all/:category",
    element: <PageWrapper Component={<ShowMore />} />,
  },
  {
    path: "/editProfile/:id",
    element: <PageWrapper Component={<EditProfile />} />,
  },
]);

export const LoadingRoute = createBrowserRouter([
  {
    path: "/*",
    element: (
      <div>
        <Loader />
      </div>
    ),
  },
]);

export const AuthRouter = createBrowserRouter([
  {
    path: "/",
    element: <PageWrapper Component={<Main />} />,
  },
  {
    path: "/property/:id/gallery",
    element: <PageWrapper Component={<Gallery />} />,
  },
  {
    path: "/profile",
    element: <PageWrapper Component={<Profile />} />,
  },
  {
    path: "/search",
    element: <PageWrapper Component={<Search />} />,
  },
  {
    path: "/faq",
    element: <PageWrapper Component={<FAQ />} />,
  },
  {
    path: "/forgotPassword",
    element: <ForgotPassword />,
  },
  {
    path: "/property/:id",
    element: <PageWrapper Component={<Property />} />,
  },
  {
    path: "/map",
    element: <PageWrapper Component={<MapView />} />,
  },
  {
    path: "/*",
    element: <Navigate to='/' />,
  },
  {
    path: "/payment/:id",
    element: <PageWrapper Component={<Payment />} />,
  },
  {
    path: "/all/:category",
    element: <PageWrapper Component={<ShowMore />} />,
  },
]);
