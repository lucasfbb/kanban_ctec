import {
	ChevronDown,
	NotificationsOutline,
	PersonCircle,
	PersonOutline,
	SearchOutline,
	SettingsOutline,
	ShareSocialOutline,
} from "react-ionicons";
import { useNavigate } from "react-router-dom";

const Navbar = () => {

	const navigate = useNavigate();

	return (
		<div className="md:w-[calc(100%-230px)] w-[calc(100%-60px)] fixed flex items-center justify-between pl-2 pr-6 h-[70px] top-0 md:left-[230px] left-[60px] border-b border-slate-300 bg-[#fff]">
			<div className="flex items-center gap-3 cursor-pointer">
				<PersonCircle
					color="#fb923c"
					width={"28px"}
					height={"28px"}
				/>

				<h2 className="cursor-pointer bg-transparent outline-none text-orange-400 font-semibold text-lg">BOARD</h2>
				
			</div>
			<div className="md:w-[800px] w-[130px] bg-gray-100 rounded-lg px-3 py-[10px] flex items-center gap-2">
				<SearchOutline color={"#999"} />
				<input
					type="text"
					placeholder="Pesquisar"
					className="w-full bg-gray-100 outline-none text-[15px]"
				/>
			</div>
			<div className="md:flex hidden items-center gap-4">
				<div className="grid place-items-center bg-gray-100 rounded-full p-2 cursor-pointer">
					<ShareSocialOutline color={"#444"} />
				</div>
				<div className="grid place-items-center bg-gray-100 rounded-full p-2 cursor-pointer">
					<SettingsOutline color={"#444"} />
				</div>
				<div className="grid place-items-center bg-gray-100 rounded-full p-2 cursor-pointer" onClick={() => navigate("/app/perfil")}>
					<PersonOutline color={"#444"} />
				</div>
			</div>
		</div>
	);
};

export default Navbar;
