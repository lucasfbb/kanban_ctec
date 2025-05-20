export const onDragEnd = (result: any, columns: any, dispatch: any) => {
	if (!result.destination) return;
  
	const { source, destination } = result;
  
	if (source.droppableId !== destination.droppableId) {
		const sourceColumn = columns[source.droppableId];
		const destColumn = columns[destination.droppableId];
		const sourceItems = [...sourceColumn.items];
		const destItems = [...destColumn.items];
		const [movedItem] = sourceItems.splice(source.index, 1);

		// 🔁 Aqui detectamos exatamente quando muda de coluna
		console.log(`📦 Task "${movedItem.title}" foi movida de "${source.droppableId}" para "${destination.droppableId}"`);

		movedItem.status = destination.droppableId; // <-- atualiza status da task

		destItems.splice(destination.index, 0, movedItem);

		dispatch({
		type: "UPDATE_COLUMN",
		columnId: source.droppableId,
		items: sourceItems,
		});

		dispatch({
		type: "UPDATE_COLUMN",
		columnId: destination.droppableId,
		items: destItems,
		});
	} else {
		const column = columns[source.droppableId];
		const copiedItems = [...column.items];
		const [movedItem] = copiedItems.splice(source.index, 1);
		copiedItems.splice(destination.index, 0, movedItem);

		dispatch({
		type: "UPDATE_COLUMN",
		columnId: source.droppableId,
		items: copiedItems,
		});
	}
  };