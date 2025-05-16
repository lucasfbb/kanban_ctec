// export type TaskT = {
// 	id: string;
// 	title: string;
// 	description: string;
// 	priority: string;
// 	deadline: number;
// 	image?: string;
// 	alt?: string;
// 	tags: { title: string; bg: string; text: string }[];
// };
export type TaskT = {
	id: string | number;
	title: string;
	description: string;
	priority: string;
	deadline: number;
	image?: string;
	alt?: string;
	tags: { title: string; bg: string; text: string }[];
	assignees?: { id: number; username: string; foto?: string }[];
};

type Column = {
	name: string;
	items: TaskT[];
};

export type Columns = {
	[key: string]: Column;
};

export interface BoardInterface {
	id: number;
	title: string;
}
