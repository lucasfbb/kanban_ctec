import {DndContext} from '@dnd-kit/core';
// import {Draggable} from './Draggable';
// import {Droppable} from './Droppable';
import { useState } from 'react';
import { Columns } from '../../types';
import { Board } from '../../data/board';

const Boards = () => {
    const [columns, setColumns] = useState<Columns>(Board)
    return (
        <>
            <DndContext onDragEnd={(result: any) => console.log(result)}>
                <div className='w-full fflex items-start justify-between px-5 pb-8 md:gap-0 gap-10'></div>
            </DndContext>
            
        </>
    )
}

export default Boards;