import { Navigate, RouteObject } from "react-router";
import Layout from "../layout";
import Boards from "../pages/Boards";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Inicio from "../pages/Inicio";
import Kanban from "../pages/Kanban";
import Perfil from "../pages/Perfil";
import Projetos from "../pages/Projetos";
import Painel from "../pages/Painel";
import Prazos from "../pages/Prazos";

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
			{ path: "", element: <Navigate to="/app/inicio" /> },
			{ path: "inicio", element: <Inicio /> },
			{ path: "prazos", element: <Prazos /> },
			{ path: "kanban", element: <Kanban /> },            // rota sem ID
			{ path: "kanban/:id", element: <Boards /> },
			{ path: "perfil", element: <Perfil /> },
			{ path: "projetos", element: <Projetos /> },
			{ path: "painel", element: <Painel /> },
		],
	}
  ];

export default routes
