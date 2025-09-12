import React, { Suspense, useLayoutEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import {
  AuthProvider,
  useAuthContext,
} from "./components/context/useAuthContext";
import { ThemeProvider } from "./components/context";
import ErrorBoundary from "./components/ErrorBoundary";
import { getAppRoutes } from "./components/AppRoute";
import BasicDetail from "./components/pages/BasicDetail";
import { SuspenseFallback } from "./components/SuspenseFallback";

// Lazy imports
const Home = React.lazy(() => import("./components/pages/Home"));
const Hometwo = React.lazy(() => import("./components/pages/Hometwo"));
const Blog = React.lazy(() => import("./components/pages/Blog"));
const Blogstandard = React.lazy(() =>
  import("./components/pages/Blogstandard")
);
const Blogdetails = React.lazy(() => import("./components/pages/Blogdetails"));
const About = React.lazy(() => import("./components/pages/About"));
const Services = React.lazy(() => import("./components/pages/Services"));
const Servicedetails = React.lazy(() =>
  import("./components/pages/Servicedetails")
);
const Faqs = React.lazy(() => import("./components/pages/Faqs"));
const Appointment = React.lazy(() => import("./components/pages/Appointment"));
const Clinicgrid = React.lazy(() => import("./components/pages/Clinicgrid"));
const Cliniclist = React.lazy(() => import("./components/pages/Cliniclist"));
const Clinicdetails = React.lazy(() =>
  import("./components/pages/Clinicdetails")
);
const ClinicListdetails = React.lazy(() =>
  import("./components/pages/ClinicListdetails")
);
const Doctorgrid = React.lazy(() => import("./components/pages/Doctorgrid"));
const Doctorlist = React.lazy(() => import("./components/pages/Doctorlist"));
const Doctordetails = React.lazy(() =>
  import("./components/pages/Doctordetails")
);
const Contact = React.lazy(() => import("./components/pages/Contact"));
const Errorpage = React.lazy(() => import("./components/pages/Errorpage"));

const HospitalList = React.lazy(()=> import('./components/pages/HospitalList'));


// Scroll to top on route change
function ScrollToTop({ children }) {
  const location = useLocation();
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  return children || null;
}

// This component is inside AuthProvider, so hooks work fine
function AppRoutes() {
  const auth = useAuthContext();

  return (
    <Routes>
      {/* Public and static routes */}
      <Route path="/" element={<Home />} />
      <Route path="/home-v2" element={<Hometwo />} />

      <Route path="/blog" element={<Blog />} />
      <Route path="/blog-standard" element={<Blogstandard />} />
      <Route
        path="/blog-details/:id"
        element={<Blogdetails key={window.location.pathname} />}
      />
      <Route
        path="/blog/cat/:catId"
        element={<Blog key={window.location.pathname} />}
      />
      <Route
        path="/blog/tag/:tagId"
        element={<Blog key={window.location.pathname} />}
      />
      <Route
        path="/blog/search/:query"
        element={<Blog key={window.location.pathname} />}
      />
      <Route
        path="/blog/author/:authorId"
        element={<Blog key={window.location.pathname} />}
      />

      <Route path="/about" element={<About />} />
      <Route path="/services" element={<Services />} />
      <Route
        path="/service/cat/:catId"
        element={<Services key={window.location.pathname} />}
      />
      <Route
        path="/service-details/:id"
        element={<Servicedetails key={window.location.pathname} />}
      />

      <Route path="/faqs" element={<Faqs />} />
      <Route path="/appointment" element={<Appointment />} />

      <Route path="/clinic-grid" element={<Clinicgrid />} />
      <Route path="/clinic-list" element={<Cliniclist />} />
      <Route
        path="/clinic/cat/:catId"
        element={<Clinicgrid key={window.location.pathname} />}
      />
      <Route
        path="/clinic-details/:id"
        element={<Clinicdetails key={window.location.pathname} />}
      />
      <Route
        path="/clinic-list-details"
        element={<ClinicListdetails key={window.location.pathname} />}
      />

      <Route path="/doctor-grid" element={<Doctorgrid />} />
      <Route path="/doctor-list" element={<Doctorlist />} />
      <Route
        path="/doctor/cat/:catId"
        element={<Doctorgrid key={window.location.pathname} />}
      />
      <Route
        path="/doctor-details"
        element={<Doctordetails key={window.location.pathname} />}
      />

      <Route path="/contact" element={<Contact />} />
      <Route path="/basic-details" element={<BasicDetail />} />

      <Route path="/hospital-list" element={<HospitalList />} />

      {/* Dynamically generated routes based on auth */}
      {getAppRoutes(auth)}

      {/* Fallback */}
      <Route path="*" element={<Errorpage />} />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider>
      <HelmetProvider>
        <ErrorBoundary>
          <Router>
            <AuthProvider>
              <Suspense
                fallback={
                  <SuspenseFallback
                    text="Loading..."
                    variant="success"
                    centered={true}
                  />
                }
              >
                <ScrollToTop>
                  <AppRoutes />
                </ScrollToTop>
              </Suspense>
            </AuthProvider>
          </Router>
        </ErrorBoundary>
      </HelmetProvider>
    </ThemeProvider>
  );
}

export default App;
