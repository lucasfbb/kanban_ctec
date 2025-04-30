export const onDragEnd = (result: any, columns: any, dispatch: any) => {
	const { source, destination } = result;
  
	if (!destination) return;
  
	if (source.droppableId !== destination.droppableId) {
	  const sourceCol = columns[source.droppableId];
	  const destCol = columns[destination.droppableId];
  
	  const sourceItems = [...sourceCol.items];
	  const destItems = [...destCol.items];
  
	  const [movedItem] = sourceItems.splice(source.index, 1);
	  destItems.splice(destination.index, 0, movedItem);
  
	  dispatch({
		type: "MOVE_TASK",
		payload: {
		  sourceId: source.droppableId,
		  destId: destination.droppableId,
		  sourceItems,
		  destItems,
		},
	  });
	} else {
	  const column = columns[source.droppableId];
	  const items = [...column.items];
	  const [movedItem] = items.splice(source.index, 1);
	  items.splice(destination.index, 0, movedItem);
  
	  dispatch({
		type: "UPDATE_COLUMN",
		columnId: source.droppableId,
		items,
	  });
	}
  };