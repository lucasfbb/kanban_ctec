import {
	ChevronDown,
	NotificationsOutline,
	PersonCircle,
	PersonOutline,
	SearchOutline,
	SettingsOutline,
	ShareSocialOutline,
} from "react-ionicons";

interface NavbarProps {
	boards: { id: number; title: string }[];
	selectedBoardId: number | null;
	onSelectBoard: (id: number) => void;
}

const Navbar = ({ boards, selectedBoardId, onSelectBoard }: NavbarProps) => {
	return (
		<div className="md:w-[calc(100%-230px)] w-[calc(100%-60px)] fixed flex items-center justify-between pl-2 pr-6 h-[70px] top-0 md:left-[230px] left-[60px] border-b border-slate-300 bg-[#fff]">
			<div className="flex items-center gap-3 cursor-pointer">
				<PersonCircle
					color="#fb923c"
					width={"28px"}
					height={"28px"}
				/>
				<select
					value={selectedBoardId || ''}
					onChange={(e) => onSelectBoard?.(Number(e.target.value))} // safe call
					className="cursor-pointer"
				>
					<option value="" disabled>Selecionar Board</option>
					{boards?.map((board) => (
						<option key={board.id} value={board.id} className="text-black cursor-pointer">
						{board.title}
						</option>
					))}
				</select>
				
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
				<div className="grid place-items-center bg-gray-100 rounded-full p-2 cursor-pointer">
					<PersonOutline color={"#444"} />
				</div>
			</div>
		</div>
	);
};

export default Navbar;
