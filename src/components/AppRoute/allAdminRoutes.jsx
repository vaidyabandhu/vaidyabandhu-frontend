import { lazy } from "react";

const Dashboard = lazy(() => import("../pages/Dashboard"));
const Appointments = lazy(() => import("../pages/Appointments"));
const Slots = lazy(() => import("../pages/Slots"));
const MyProfile = lazy(() => import("../pages/MyProfile"));
const Patients = lazy(() => import("../pages/Patients"));
const PatientsDetails = lazy(() => import("../pages/PatientsDetails"));

const doctorRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    element: <Dashboard />,
  },
  {
    path: "/doc-appointment",
    name: "Appointments",
    element: <Appointments />,
  },
  {
    path: "/doc-slots",
    name: "Slots",
    element: <Slots />,
  },
  {
    path: "/patient-list",
    name: "Patient List",
    element: <Patients />,
  },
  {
    path: "/patient-details/:id",
    name: "Patient Details",
    element: <PatientsDetails />,
  },
  {
    path: "/myProfile",
    name: "My Profile",
    element: <MyProfile />,
  },
];

const allAdminRoutes = [...doctorRoutes];

export { allAdminRoutes };
