import { Navigate, Outlet, useNavigate, useLocation } from "react-router";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { BoardInterface } from "../types/index";
import { useEffect, useState } from "react";
import api from "../services/api";

const Layout = () => {
	
	const location = useLocation();
	const token = localStorage.getItem("token");

	if (!token) {
		return <Navigate to="/" />;
	} else {
		// console.log('Token -> ', token)
	}

	// Verifica a rota atual
	const isKanbanBoard = /^\/app\/kanban\/[^/]+$/.test(location.pathname);
	
	return (
		<div className={`w-screen h-screen relative ${!isKanbanBoard ? "backdrop-blur-sm bg-white/30" : ""}`}>
			<Sidebar />
			<Navbar />

			<div className="md:pl-[250px] pl-[60px] pr-[20px] pt-[70px] w-full h-full overflow-y-auto">
				<Outlet key={location.pathname} />
			</div>
		</div>
	);
};

export default Layout;
