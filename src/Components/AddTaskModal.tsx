import { useState } from 'react'
import { Modal } from '@mui/material';
import { AiOutlineCalendar } from 'react-icons/ai';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface ModalProps {
    isOpen: boolean;
    handleClose: () => void;
}



export default function AddTaskModal({ isOpen, handleClose }: ModalProps) {
    const [ date, setDate ] = useState(new Date())
    const [form, setForm] = useState({ topic: "", description: "" });
    const [selectedOption, setSelectedOption] = useState("personal");

    const handleSubmit = () => {
        console.log('Submitting..');
        console.log('Topic:', form.topic);
        console.log('Description:', form.description);
        console.log('Due Date:', date);
        console.log('Selected Option:', selectedOption);
    }
    
    return (
        <Modal
            open={isOpen}
            onClose={handleClose}
            className='modal flex flex-col items-center justify-center'
        >
            <form className='container w-[40%] bg-white h-[30%] flex flex-col p-2 items-center rounded-md shadow-[0_3px_10px_rgb(0,0,0,0.2)]'>
                <input
                    placeholder='Task name here'
                    value={form.topic}
                    onChange={(e) => setForm({ ...form, topic: e.target.value })}
                    className='task-name w-full h-10 outline-none'
                />
                <textarea
                    placeholder='Description'
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className='task-description w-full overflow-y-hidden outline-none'
                />
                <div className='footer flex flex-row w-full mt-10 py-2 items-center justify-between'>
                    <div className='footer-1 flex flex-row gap-2'>
                        <select
                            className="footer-btn flex flex-row items-center justify-center w-24 rounded-md gap-2 p-1 text-[12px] border-[1px] outline-none"
                            value={selectedOption}
                            onChange={(e) => setSelectedOption(e.target.value)}
                        >
                            <option value="personal">personal</option>
                            <option value="school">school</option>
                            <option value="work">work</option>
                        </select>

                        <DatePicker
                            customInput={
                                <div className="footer-btn flex flex-row items-center justify-center w-24 rounded-md gap-2 p-1 text-[12px] border-[1px]">
                                    <AiOutlineCalendar />
                                    Due Date
                                </div>
                            }
                            onChange={(date:any) => {
                                const formattedDate = date.toLocaleDateString("en-US", {
                                weekday: "short",
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                                });
                                console.log(formattedDate);
                                setDate(formattedDate);
                            }}
                            selected={date}
                            className="picker w-24 border-[1px] outline-none rounded"
                        />
                    </div>
                    <div className='footer-2 flex flex-row gap-2'>
                        <button onClick={handleClose} className='footer-btn flex flex-row items-center justify-center w-24 rounded-md gap-2 p-1 text-[12px] border-[1px]'>
                            Cancel
                        </button>
                        <div onClick={handleSubmit} className='footer-btn flex flex-row items-center justify-center w-24 rounded-md gap-2 p-1 text-[14px] border-[1px] bg-[blue] text-white hover:cursor-pointer'>
                            Add Task
                        </div>
                    </div>
                </div>
            </form>
        </Modal>
    );
}
