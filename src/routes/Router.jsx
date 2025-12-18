import { createBrowserRouter } from "react-router";
import RootLayout from "../rootlayout/RootLayout";
import Home from "../Pages/Home";
import Login from "../Pages/Login";
import Registration from "../Pages/Registration";



const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children:[
        {
            index:true,
            Component: Home,
        },
        {
            path:"/login",
            Component: Login,
        },
        {
            path:"/registration",
            Component: Registration,
        }
    ]
  },
]);

export default router;