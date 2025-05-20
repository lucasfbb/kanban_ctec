import { Navigate, Outlet, useNavigate, useLocation } from "react-router";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { BoardInterface } from "../types/index";
import { useEffect, useRef, useState } from "react";
import api from "../services/api";
import { useBoard } from "../context/BoardContext";

const Layout = () => {
	
	const location = useLocation();
	const token = localStorage.getItem("token");

	if (!token) {
		return <Navigate to="/" />;
	} else {
		// console.log('Token -> ', token)
	}

	const { unsavedChanges, handleSaveBoard } = useBoard();
	const previousPath = useRef(location.pathname);
	
	useEffect(() => {
		const from = previousPath.current;
		const to = location.pathname;
	
		const saiuDoKanban = from.startsWith("/app/kanban/") && !to.startsWith("/app/kanban/");
	
		if (saiuDoKanban && unsavedChanges) {
			console.log("💾 Salvando alterações antes de sair do Kanban...");
	
			(async () => {
				try {
					await handleSaveBoard(); // Aguarda o salvamento terminar
				} catch (err) {
					console.error("Erro ao salvar ao sair do Kanban:", err);
				}
			})();
		}
	
		previousPath.current = to;
	}, [location.pathname]);

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
