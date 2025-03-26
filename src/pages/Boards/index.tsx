import {DndContext} from '@dnd-kit/core';
import {Draggable} from './Draggable';
import {Droppable} from './Droppable';

const Boards = () => {
    return (
        <>
            <DndContext onDragEnd={(result: any) => console.log(result)}>
                <div className=''></div>
            </DndContext>
        
        
        </>
    )
}

export default Boards;