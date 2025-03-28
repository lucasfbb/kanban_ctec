import { RouteObject } from "react-router";
import Layout from "../layout";
import Boards from "../pages/Boards";
import Login from "../pages/Login";

const routes: RouteObject[] = [
	{
	  path: "/",
	  element: <Login />,
	},
	{
	  path: "/app",
	  element: <Layout />,
	  children: [
		{ path: "", element: <Boards /> },
	  ],
	},
  ];

export default routes
