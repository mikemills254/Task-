import { useState } from 'react';
import { PiDotsNineBold } from 'react-icons/pi';
import { AiOutlineCopy } from 'react-icons/ai';
import { BsTrash } from 'react-icons/bs';
import { BsCalendar4Event } from 'react-icons/bs'

interface TaskProps {
    taskTitle: string;
    dueDate: string;
    category: string;
    onClick: () => void;
}

function Task({ taskTitle, dueDate, category, onClick }: TaskProps) {
    const [ isDropdownOpen, setisDropdownOpen ] = useState (false) 

    const toggleDropdown = () => {
        setisDropdownOpen(!isDropdownOpen);
    }

    return (
        <div onClick={onClick} className='task-container flex flex-row bg-[white] w-full my-2 rounded-md py-3 px-2 border-[1px] hover:cursor-pointer'>
            <div className='task-radio w-[10%]'>
                <input
                    type='radio'
                />
            </div>
            <div className='task-content w-[70%]'>
                <p className='title font-medium'>{taskTitle}</p>
                <div className='due flex flex-row items-center gap-3'>
                    <BsCalendar4Event size={15}/>
                    <span className='date text-[12px]'>{dueDate}</span>
                </div>
                <small className='category bg-[#f2f7fb] p-1 w-[5rem] text-[#6374ae] rounded-lg'>{category}</small>
            </div>
            <div className='task-options w-[10%] ml-[20%] flex flex-col items-center justify-center'>
                <PiDotsNineBold
                    size={25}
                    className={`icon-button p-1 rounded-full hover:cursor-pointer${isDropdownOpen ? ' active' : ''}`}
                    onClick={toggleDropdown}
                />
                {isDropdownOpen && (
                <div className="dropdown-menu absolute mt-[6rem] border-[1.8px] z-30 w-[6rem] py-2 shadow-[rgba(0, 0, 0, 0.24) 0px 3px 8px]">
                    <div className="dropdown-item mb-1 pl-3 flex flex-row items-center gap-2">
                        <AiOutlineCopy />
                        Copy
                    </div>
                    <div className="dropdown-item pl-3 flex flex-row items-center gap-2">
                        <BsTrash />
                        Delete
                    </div>
                </div>
                )}
            </div>
        </div>
    );
}

export default Task;
