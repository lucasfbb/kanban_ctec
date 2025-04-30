import { Outlet } from "react-router";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Navigate } from 'react-router-dom';

import { BoardInterface } from "../types/index";
import { useState } from "react";

const Layout = () => {
	const [boards, setBoards] = useState<BoardInterface[]>([]);
	const [selectedBoardId, setSelectedBoardId] = useState<number | null>(null);

	const token = localStorage.getItem("token");

	if (!token) {
		return <Navigate to="/" />;
	} else {
		console.log('Token -> ', token)
	}

	return (
		<div className="w-screen h-screen relative">
			<Sidebar />
			<Navbar 
				boards={boards}
				selectedBoardId={selectedBoardId}
				onSelectBoard={(id) => setSelectedBoardId(id)}
			/>
			<div className="md:pl-[250px] pl-[60px] pr-[20px] pt-[70px] w-full h-full overflow-y-auto">
				<Outlet />
			</div>
		</div>
	);
};

export default Layout;
