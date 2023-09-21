import {
  createBrowserRouter,

  RouterProvider,
} from "react-router-dom";
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import SignUp from "./pages/SignUp";
import LogIn from "./pages/LogIn";
import ManageApp from "./pages/ManageApp";
import ProtectedRoute from "./components/ProtectedRoute";
import UnProtectedRoute from "./components/UnProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Home/>
    ),
  },
  {
    path: "manage",
    element: <ProtectedRoute>
      <Dashboard/>
    </ProtectedRoute>,
  },
  {
    path: "manage/:appId/:appName/:env",
    element: <ProtectedRoute>
      <ManageApp/>
    </ProtectedRoute>,
  },
  {
    path: "signup",
    element: <UnProtectedRoute>
      <SignUp/>
    </UnProtectedRoute>,
  },
  {
    path: "login",
    element: <UnProtectedRoute>
      <LogIn/>
    </UnProtectedRoute>,
  },
]);

function Router() {

  return (
  <div>
    <RouterProvider router={router}/>
  </div>

  )
}

export default Router
