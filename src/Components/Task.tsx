import { useState } from 'react';
import { PiDotsNineBold } from 'react-icons/pi';

interface TaskProps {
    onClick: (taskContent: string) => void;
    isSelected: boolean;
    taskContent: string;
}

function Task({ onClick, isSelected, taskContent }: TaskProps) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <div
            className={`task-component border-[1.8px] p-2 flex flex-row cursor-pointer items-center justify-between my-3 rounded-md relative${isSelected ? ' selected' : ''}`}
            onClick={() => onClick(taskContent)}
        >
            <input type="radio" checked={isSelected} />
            <p className='task-title max-w-[20rem]'>{taskContent}</p>
            <h6 className='task-category bg-[green] w-20 flex items-center justify-center rounded-full text-[14px] text-white'>school</h6>
            <div className="task-options">
                <PiDotsNineBold 
                    size={20}
                    className={`icon-button p-1 rounded-full hover:cursor-pointer${isDropdownOpen ? ' active' : ''}`}
                    onClick={toggleDropdown}
                />
                {isDropdownOpen && (
                    <div className="dropdown-menu absolute right-0 mt-2 bg-[red] border-[1.8px] rounded-md shadow-md z-30">
                        <div className="dropdown-item">Option 1</div>
                        <div className="dropdown-item">Option 2</div>
                        <div className="dropdown-item">Option 3</div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Task;
