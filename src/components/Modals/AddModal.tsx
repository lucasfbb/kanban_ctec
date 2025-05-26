/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { getRandomColors } from "../../helpers/getRandomColors";
import { v4 as uuidv4 } from "uuid";
import { useBoard } from "../../context/BoardContext";

interface Tag {
	title: string;
	bg: string;
	text: string;
}

interface AddModalProps {
	isOpen: boolean;
	onClose: () => void;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	handleAddTask: (taskData: any) => void;
	selectedColumn: string;
}

interface UserOption {
	id: number;
	username: string;
}

const AddModal = ({ isOpen, onClose, setOpen, handleAddTask, selectedColumn }: AddModalProps) => {
	const initialTaskData = {
		id: uuidv4(),
		title: "",
		description: "",
		priority: "",
		deadline: 0,
		image: "",
		alt: "",
		tags: [] as Tag[],
		status: "", // ← adicionar aqui também
	};

	const [users, setUsers] = useState<UserOption[]>([]);
	const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
	const [taskData, setTaskData] = useState(initialTaskData);
	const [tagTitle, setTagTitle] = useState("");

	const { isPrivate } = useBoard();

	useEffect(() => {
		if (isOpen) {
			const token = localStorage.getItem("token");
			fetch("http://localhost:8000/users", {
				headers: { Authorization: `Bearer ${token}` }
			})
				.then((res) => res.json())
				.then(setUsers)
				.catch(console.error);
		}

		// console.log(isPrivate)

	}, [isOpen]);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setTaskData({ ...taskData, [name]: value });
	};

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			const reader = new FileReader();
			reader.onload = function (e) {
				if (e.target) {
					setTaskData({ ...taskData, image: e.target.result as string });
				}
			};
			reader.readAsDataURL(e.target.files[0]);
		}
	};

	const handleAddTag = () => {
		if (tagTitle.trim() !== "") {
			const { bg, text } = getRandomColors();
			const newTag: Tag = { title: tagTitle.trim(), bg, text };
			setTaskData({ ...taskData, tags: [...taskData.tags, newTag] });
			setTagTitle("");
		}
	};

	const closeModal = () => {
		setOpen(false);
		onClose();
		setTaskData(initialTaskData);
	};

	// const handleSubmit = () => {
	// 	handleAddTask(taskData);
	// 	closeModal();
	// };

	const handleSubmit = () => {
		const fullTaskData = {
			...taskData,
			assignee_ids: selectedUsers,
			status: selectedColumn,
		};
		handleAddTask(fullTaskData);
		closeModal();
	};

	

	return (
		<div
			className={`fixed inset-0 z-50 grid place-items-center ${isOpen ? "grid" : "hidden"}`}
		>
			<div
				className="w-full h-full bg-black opacity-70 absolute left-0 top-0 z-20"
				onClick={closeModal}
			></div>
			<div className="md:w-[30vw] w-[90%] bg-white rounded-lg shadow-md z-50 flex flex-col items-center gap-3 px-5 py-6">
				<input
					type="text"
					name="title"
					value={taskData.title}
					onChange={handleChange}
					placeholder="Título"
					className="w-full h-12 px-3 outline-none rounded-md bg-slate-100 border border-slate-300 text-sm font-medium"
				/>
				<input
					type="text"
					name="description"
					value={taskData.description}
					onChange={handleChange}
					placeholder="Descrição"
					className="w-full h-12 px-3 outline-none rounded-md bg-slate-100 border border-slate-300 text-sm font-medium"
				/>
				<select
					name="priority"
					onChange={handleChange}
					value={taskData.priority}
					className="w-full h-12 px-2 outline-none rounded-md bg-slate-100 border border-slate-300 text-sm"
				>
					<option value="">Prioridade</option>
					<option value="baixa">Baixa</option>
					<option value="media">Média</option>
					<option value="alta">Alta</option>
					<option value="muito_alta">Muito alta</option>
				</select>
				<input
					type="number"
					id="deadline"
					name="deadline"
					value={taskData.deadline === 0 ? "" : taskData.deadline}
					onChange={(e) => {
					const value = parseInt(e.target.value, 10);
					setTaskData({ ...taskData, deadline: isNaN(value) ? 0 : value });
					}}
					placeholder="Tempo estimado (em dias)"
					className="w-full h-12 px-3 outline-none rounded-md bg-slate-100 border border-slate-300 text-sm"
					min={1}
				/>
				<input
					type="text"
					value={tagTitle}
					onChange={(e) => setTagTitle(e.target.value)}
					placeholder="Titulo da Tag"
					className="w-full h-12 px-3 outline-none rounded-md bg-slate-100 border border-slate-300 text-sm"
				/>
				<button
					className="w-full rounded-md h-9 bg-slate-500 text-amber-50 font-medium"
					onClick={handleAddTag}
				>
					Adicionar Tag
				</button>
				<div className="w-full">
					{taskData.tags && <span>Tags:</span>}
					{taskData.tags.map((tag, index) => (
						<div
							key={index}
							className="inline-block mx-1 px-[10px] py-[2px] text-[13px] font-medium rounded-md"
							style={{ backgroundColor: tag.bg, color: tag.text }}
						>
							{tag.title}
						</div>
					))}
				</div>
				{!isPrivate && (
					<div className="w-full mt-2">
						<label className="text-sm text-gray-600">Responsáveis:</label>
						<div className="flex flex-col gap-2 mt-1 max-h-40 overflow-y-auto border rounded-md p-2 bg-slate-100">
						{users.map((user) => (
							<label key={user.id} className="flex items-center gap-2 text-sm text-gray-800">
							<input
								type="checkbox"
								value={user.id}
								checked={selectedUsers.includes(user.id)}
								onChange={() => {
								setSelectedUsers((prev) =>
									prev.includes(user.id)
									? prev.filter((id) => id !== user.id)
									: [...prev, user.id]
								);
								}}
							/>
							{user.username}
							</label>
						))}
						</div>
					</div>
					)}

					{!isPrivate && selectedUsers.length > 0 && (
						<div className="w-full mt-2 text-sm text-gray-600">
							Selecionados:
							<ul className="list-disc pl-5 text-gray-800">
							{users
								.filter((u) => selectedUsers.includes(u.id))
								.map((u) => (
								<li key={u.id}>{u.username}</li>
								))}
							</ul>
						</div>
					)}

				{selectedUsers.length > 0 && (
					<div className="w-full mt-2 text-sm text-gray-600">
						Selecionados:
						<ul className="list-disc pl-5 text-gray-800">
						{users
							.filter((u) => selectedUsers.includes(u.id))
							.map((u) => (
							<li key={u.id}>{u.username}</li>
							))}
						</ul>
					</div>
				)}

				<div className="w-full flex items-center gap-4 justify-between">
					<input
						type="text"
						name="alt"
						value={taskData.alt}
						onChange={handleChange}
						placeholder="Image Alt"
						className="w-full h-12 px-3 outline-none rounded-md bg-slate-100 border border-slate-300 text-sm"
					/>
					<input
						type="file"
						name="image"
						onChange={handleImageChange}
						className="w-full"
					/>
				</div>
				<button
					className="w-full mt-3 rounded-md h-9 bg-orange-400 text-blue-50 font-medium"
					onClick={handleSubmit}
				>
					Adicionar tarefa
				</button>
			</div>
		</div>
	);
};

export default AddModal;
