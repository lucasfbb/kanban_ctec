import { RouteObject } from "react-router";
import Layout from "../layout";
import Boards from "../pages/Boards";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Inicio from "../pages/Inicio";

const routes: RouteObject[] = [
	{
	  path: "/",
	  element: <Login />,
	},
	{
		path: "/register",
		element: <Register />,
	},
	{
	  path: "/app",
	  element: <Layout />,
	  children: [
		{ path: "", element: <Boards /> },
		{ path: "inicio", element: <Inicio /> },
	  ],
	},
  ];

export default routes
