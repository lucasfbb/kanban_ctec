import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
	IoChevronDown,
	IoNotificationsOutline,
	IoPersonCircle,
	IoPersonOutline,
	IoSearchOutline,
	IoSettingsOutline,
	IoShareSocialOutline,
} from "react-icons/io5";

import api from "../../services/api";
import { useUser } from "../../context/UserContext";

const Navbar = () => {

	const { user } = useUser();

	const [title, setTitle] = useState("");
	
	const foto = user?.foto ? `http://localhost:8000/${user.foto}` : null;

	const { id } = useParams();
	const location = useLocation();
	
	const navigate = useNavigate();

	useEffect(() => {
		const isKanbanBoard = /^\/app\/kanban\/[^/]+$/.test(location.pathname);
		const token = localStorage.getItem("token");
	
		if (isKanbanBoard && id && token) {
		  api
			.get(`/boards/${id}`, {
			  headers: {
				Authorization: `Bearer ${token}`,
			  },
			})
			.then((res) => {
			  setTitle(res.data.board_title);
			})
			.catch((err) => console.error("Erro ao buscar board:", err));
		} else {
		  setTitle("");
		}

	  }, [location.pathname, id]);

	return (
		<div className="md:w-[calc(100%-230px)] w-[calc(100%-60px)] fixed flex items-center justify-between pl-2 pr-6 h-[70px] top-0 md:left-[230px] left-[60px] border-b border-slate-300 bg-[#fff]">
			<div className="flex items-center gap-3 cursor-pointer">
				<IoPersonCircle
					color="#fb923c"
					width={"28px"}
					height={"28px"}
				/>

				<h2 className="cursor-pointer bg-transparent outline-none text-orange-400 font-semibold text-lg">{title}</h2>
				
			</div>

			<div className="md:w-[800px] w-[130px] bg-gray-100 rounded-lg px-3 py-[10px] flex items-center gap-2">
				<IoSearchOutline color={"#999"} />
				<input
					type="text"
					placeholder="Pesquisar"
					className="w-full bg-gray-100 outline-none text-[15px]"
				/>
			</div>
			<div className="md:flex hidden items-center gap-4">
				<div className="grid place-items-center bg-gray-100 rounded-full p-2 cursor-pointer">
					<IoShareSocialOutline color={"#444"} />
				</div>
				<div className="grid place-items-center bg-gray-100 rounded-full p-2 cursor-pointer">
					<IoSettingsOutline color={"#444"} />
				</div>
				<div className="grid place-items-center bg-gray-100 rounded-full p-2 cursor-pointer" onClick={() => navigate("/app/perfil")}>
					{/* <IoPersonOutline color={"#444"} /> */}
					{foto ? (
						<img
							src={foto}
							alt="Foto de perfil"
							className="w-8 h-8 rounded-full object-cover"
						/>
					) : (
						<div>Foto</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default Navbar;
