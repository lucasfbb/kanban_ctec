import { useNavigate, useLocation, useParams } from "react-router-dom";

import {
	IoAppsOutline,
	IoGridOutline,
	IoHomeOutline,
	IoLogOutOutline,
	IoNewspaperOutline,
	IoNotificationsOutline,
	IoPeopleOutline,
	IoPieChartOutline,
	IoDocumentLockOutline
  } from "react-icons/io5";

import logo from '../../assets/images/logo_pgm_inverter.png';
import Swal from "sweetalert2";

const Sidebar = () => {

	const location = useLocation();
	const navigate = useNavigate();

	const handleLogout = async () => {
		localStorage.removeItem("token"); // ou o nome que você usou

		await Swal.fire({
			icon: "success",
			title: "Logout feito com sucesso",
			confirmButtonText: "Ok",
			timerProgressBar: true,
			timer: 1000
		});


		navigate("/"); // redireciona para login
	};

	const navLinks = [
		{
			title: "Início",
			path: "/app/inicio",
			icon: <IoHomeOutline color="#555" width="22px" height="22px" />,
		},
		{
			title: "KanBans",
			path: "/app/kanban",
			icon: <IoAppsOutline color="#555" width="22px" height="22px" />,
		},
		{
			title: "Projetos",
			path: "/app/projetos",
			icon: <IoGridOutline color="#555" width="22px" height="22px" />,
		},
		{
			title: "Análises",
			path: "/analises",
			icon: <IoPieChartOutline color="#555" width="22px" height="22px" />,
		},
		{
			title: "Fluxos de trabalho",
			path: "/fluxos",
			icon: <IoPeopleOutline color="#555" width="22px" height="22px" />,
		},
		{
			title: "Notificações",
			path: "/notificacoes",
			icon: <IoNotificationsOutline color="#555" width="22px" height="22px" />,
		},
		{
			title: "Painel Admin",
			path: "/app/painel",
			icon: <IoDocumentLockOutline  color="#555" width="22px" height="22px" />,
		}
	];

	return (
		<div className="fixed left-0 top-0 md:w-[230px] w-[60px] overflow-hidden h-full flex flex-col">
			<div className="w-full flex items-center md:justify-start justify-center md:pl-5 h-[70px] bg-[#fff]">
				<img 
					src={logo} 
					alt="Logo" 
					className="md:h-8 h-6 object-contain"
				/>
			</div>
			<div className="w-full h-[calc(100vh-70px)] border-r flex flex-col md:items-start items-center gap-2 border-slate-300 bg-[#fff] py-5 md:px-3 px-3 relative">
				{navLinks.map((link) => {
					const isActive = location.pathname.startsWith(link.path);
					return (
						<div
							key={link.title}
							onClick={() => navigate(link.path)}
							className={`flex items-center gap-2 w-full rounded-lg hover:bg-orange-300 px-2 py-3 cursor-pointer ${
							isActive ? "bg-orange-300" : "bg-transparent"
							}`}
						>
							{link.icon}
							<span className="font-medium text-[15px] md:block hidden">{link.title}</span>
						</div>
					);
				})}
				<div onClick={handleLogout} className="flex absolute bottom-4 items-center md:justify-start justify-center gap-2 md:w-[90%] w-[70%] rounded-lg hover:bg-orange-300 px-2 py-3 cursor-pointer bg-gray-200">
					<IoLogOutOutline />
					<span className="font-medium text-[15px] md:block hidden">Sair</span>
				</div>
			</div>
		</div>
	);
};

export default Sidebar;
