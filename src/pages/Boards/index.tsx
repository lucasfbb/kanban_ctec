/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useState, useEffect } from "react";
import { onDragEnd } from "../../helpers/onDragEnd";
import { IoAddOutline } from "react-icons/io5";
import AddModal from "../../components/Modals/AddModal";
import Task from "../../components/Task";
import api from "../../services/api";
import { useBoard } from "../../context/BoardContext";

const Home = () => {
  const { state: columns, dispatch } = useBoard();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState("");
  const [title, setTitle] = useState("");

  const { id } = useParams();

  const openModal = (columnId: string) => {
    setSelectedColumn(columnId);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleAddTask = (taskData: any) => {
    dispatch({
      type: "UPDATE_COLUMN",
      columnId: selectedColumn,
      items: [...columns[selectedColumn].items, {
        ...taskData,
        assignees: taskData.assignees || []
      }],
    });
  };

  const handleSaveBoard = async () => {
    const token = localStorage.getItem("token");
    const boardId = localStorage.getItem("selectedBoardId");
    
    if (!token || !boardId) return;
    
    try {
      const payload = Object.entries(columns).reduce((acc, [key, value]) => {
      acc[key] = {
        name: value.name,
        items: value.items.map((item: any) => ({
          title: item.title,
          description: item.description,
          deadline: item.deadline,
          priority: item.priority,
          status: key,
          assignees: item.assignees ? item.assignees.map((u: any) => u.id) : [],
        })),
      };
      return acc;
      }, {} as any);
    
      await api.put(`/boards/${boardId}/save`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    
      console.log("Board salvo com sucesso");
    } catch (err) {
      console.error("Erro ao salvar board:", err);
    }
  };

  // useEffect para buscar o board atual ao montar
  useEffect(() => {
    const token = localStorage.getItem("token");
  
    if (!id || !token) return;
  
    api
      .get(`/boards/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res)
        dispatch({ type: "SET_COLUMNS", payload: res.data.columns });
        setTitle(res.data.board_title);
      })
      .catch((err) => console.error("Erro ao buscar board:", err));
  }, [id, dispatch]);

  // useEffect para salvar automaticamente a cada 10 minutos
  useEffect(() => {
    const interval = setInterval(() => {
      handleSaveBoard();
    }, 10 * 60 * 1000); // 10 minutos
    
    return () => clearInterval(interval); // limpa ao desmontar
  }, [columns]);

  // useEffect para salvar ao sair da tela
  useEffect(() => {
    const handleBeforeUnload = () => {
      handleSaveBoard();
    };
    
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [columns]);

  return (
    <>
      <DragDropContext onDragEnd={(result: any) => onDragEnd(result, columns, dispatch)}>
        <div className="w-full flex items-start justify-between px-5 pb-8 md:gap-0 gap-10">
          {Object.entries(columns).map(([columnId, column]: any) => (
            <div key={columnId} className="w-full flex flex-col gap-0">
              <Droppable droppableId={columnId}>
                {(provided: any) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="flex flex-col md:w-[290px] w-[250px] gap-3 items-center py-5"
                  >
                    <div className="flex items-center justify-center py-[10px] w-full bg-white rounded-lg shadow-sm text-[#555] font-medium text-[15px]">
                      {column.name}
                    </div>
                    {column.items.map((task: any, index: any) => (
                      <Draggable key={task.id.toString()} draggableId={task.id.toString()} index={index}>
                        {(provided: any) => (
                          <Task provided={provided} task={task} />
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
              <div
                onClick={() => openModal(columnId)}
                className="flex cursor-pointer items-center justify-center gap-1 py-[10px] md:w-[90%] w-full opacity-90 bg-white rounded-lg shadow-sm text-[#555] font-medium text-[15px]"
              >
                <IoAddOutline color={"#555"} />
                Add Task
              </div>
            </div>
          ))}
        </div>
      </DragDropContext>

	  <div className="flex justify-end px-5 pt-4">
		<button
      onClick={handleSaveBoard}
      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition shadow-md"
		>
		Salvar alterações
		</button>
  	  </div>

      <AddModal
        isOpen={modalOpen}
        onClose={closeModal}
        setOpen={setModalOpen}
        handleAddTask={handleAddTask}
      />
    </>
  );
};

export default Home;
