import { useState } from 'react'
import { Modal } from '@mui/material';
import { AiOutlineCalendar } from 'react-icons/ai';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Oval } from 'react-loader-spinner'
import { Firestore } from '../Utils/Auth';
import Cookies from 'js-cookie';

interface ModalProps {
    isOpen: boolean;
    handleClose: () => void;
}



export default function AddTaskModal({ isOpen, handleClose }: ModalProps) {
    const [ isLoading, setIsLoading ] = useState(false)
    const [ date, setDate ] = useState(new Date())
    const [form, setForm] = useState({ topic: "", description: "" });
    const [selectedOption, setSelectedOption] = useState("personal");

    const handleSubmit = async () => {
        setIsLoading(true)
        try {
            if(!form.topic || !form.description){
                setIsLoading(false)
                alert('Please fill in all the details about the task')
            } else {
                const email:any = Cookies.get('userEmail')
                const results = await Firestore.AddDataToFirestore(form.topic, form.description, date, selectedOption, email )
                !results ? setIsLoading(false) : console.log('SuccessFully saved')
            }
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
            handleClose()
            setForm({topic:'', description: ''})
        }
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
                                setDate(date)
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
                            {!isLoading ? <h4>Add Task</h4>: <Oval height={25} strokeWidth={5} secondaryColor='white' color='white'/>}
                        </div>
                    </div>
                </div>
            </form>
        </Modal>
    );
}
