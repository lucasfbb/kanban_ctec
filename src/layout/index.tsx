import { Navigate, Outlet, useNavigate } from "react-router";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { BoardInterface } from "../types/index";
import { useEffect, useState } from "react";
import api from "../services/api";

const Layout = () => {
	const [boards, setBoards] = useState<BoardInterface[]>([]);
	const [selectedBoardId, setSelectedBoardId] = useState<number | null>(null);
	const [selectedBoardTitle, setSelectedBoardTitle] = useState("");

	const token = localStorage.getItem("token");

	const navigate = useNavigate();

	if (!token) {
		return <Navigate to="/" />;
	} else {
		console.log('Token -> ', token)
	}

	useEffect(() => {
		const boardId = localStorage.getItem("selectedBoardId");
		const token = localStorage.getItem("token");
	  
		if (!boardId || !token) return;
	  
		api.get(`/boards`, {
		  headers: { Authorization: `Bearer ${token}` },
		}).then((res) => {
		  const current = res.data.find((b:any) => b.id === Number(boardId));
		  if (current) {
			setSelectedBoardTitle(current.title);
			setSelectedBoardId(current.id);
		  }
		});
	  }, []);

	  const handleSelectBoard = (id: number, title: string) => {
		localStorage.setItem("selectedBoardId", id.toString());
		setSelectedBoardId(id);
		setSelectedBoardTitle(title);
		navigate("/app");
	  };

	return (
		<div className="w-screen h-screen relative">
			<Sidebar />
			<Navbar
				boards={boards}
				selectedBoardId={selectedBoardId}
				selectedBoardTitle={selectedBoardTitle}
				onSelectBoard={handleSelectBoard}
			/>
			<div className="md:pl-[250px] pl-[60px] pr-[20px] pt-[70px] w-full h-full overflow-y-auto">
				<Outlet />
			</div>
		</div>
	);
};

export default Layout;
