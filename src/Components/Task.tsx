import { PiDotsNineBold } from 'react-icons/pi';
import { BsCalendar4Event } from 'react-icons/bs'

interface TaskProps {
    taskTitle: string;
    dueDate: string;
    category: string;
    value: string;
    onClick: () => void;
    handleChange: () => void
}

function Task({ taskTitle, dueDate, category, value, handleChange, onClick }: TaskProps) {
    

    return (
        <div className='task-container flex flex-row bg-[white] w-full my-2 rounded-md py-3 px-2 border-[1px] hover:cursor-pointer'>
            <div className='task-radio w-[10%]'>
                <input
                    type='radio'
                    value={value}
                    onChange={handleChange}
                />
            </div>
            <div className='task-content w-[70%]' onClick={onClick}>
                <p className='title font-medium'>{taskTitle}</p>
                <div className='due flex flex-row items-center gap-3'>
                    <BsCalendar4Event size={15}/>
                    <span className='date text-[12px]'>{dueDate}</span>
                </div>
                <small className='category bg-[#f2f7fb] p-1 w-[5rem] text-[#6374ae] rounded-lg'>{category}</small>
            </div>
            <div className='task-options w-[10%] ml-[20%] flex flex-col items-center justify-center' onClick={onClick}>
                <PiDotsNineBold
                    size={25}
                    className={'icon-button p-1 rounded-full'}
                />
            </div>
        </div>
    );
}

export default Task;
