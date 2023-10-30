import React, { useEffect, useState } from 'react';
import { setIsAuthenticated } from '../Utils/Slicer';
import { useDispatch } from 'react-redux';
import { AiOutlineStar, AiOutlineSearch, AiOutlineCalendar, AiOutlineCheck } from 'react-icons/ai';
import { BsTrash } from 'react-icons/bs';
import { BiCog } from 'react-icons/bi';
import { SlLogout } from 'react-icons/sl';
import Task from '../Components/Task';
import AddTaskModal from '../Components/AddTaskModal';
import Cookies from 'js-cookie';
import { Firestore, collection, deleteDoc, onSnapshot, query, where } from 'firebase/firestore';
import { Db } from '../Utils/Firebase';
import { GrAdd } from 'react-icons/gr'
import { IoCheckmarkDoneOutline } from 'react-icons/io5'
import { AiOutlineCopy } from 'react-icons/ai';

type Tab = 'today' | 'upcoming' | 'completed' | 'deleted' | 'settings';

const Sidebar: React.FC<{ onSelectTab: (tab: Tab) => void }> = ({ onSelectTab }) => {
    const dispatch = useDispatch()
    const handleLogOut = () => {
        dispatch(setIsAuthenticated(false))
        Cookies.remove('accessToken')
        Cookies.remove('userEmail')
        Cookies.remove('userName')
    }
    return (
        <aside>
            <div className="sidebar__container h-full w-60 flex flex-col align-middle justify-between border-r-[1.5px]">
                <ul className="sidebar_ul">
                    <h1 className="logo text-[1.5rem] font-semibold border-b-[1.5px] p-2">
                        Task+
                    </h1>
                    <li onClick={() => onSelectTab('today')}>
                        <AiOutlineStar />
                        Today
                    </li>
                    <li onClick={() => onSelectTab('upcoming')}>
                        <AiOutlineCalendar />
                        Upcoming
                    </li>
                    <li onClick={() => onSelectTab('completed')}>
                        <AiOutlineCheck />
                        Completed
                    </li>
                    <li onClick={() => onSelectTab('deleted')}>
                        <BsTrash />
                        Deleted
                    </li>
                </ul>
                <ul>
                    <li onClick={() => onSelectTab('settings')}>
                        <BiCog />
                        Settings
                    </li>
                    <li onClick={() => handleLogOut()}>
                        <SlLogout />
                        LogOut
                    </li>
                </ul>
            </div>
        </aside>
    );
};

interface CenterBarProps {
    selectedTab: Tab;
}

interface Task {
    id: string;
    Email: string;
    Category: string;
    DueDate: { seconds: number; nanoseconds: number };
    Topic: string;
    Description: string;
}

const CenterBar: React.FC<CenterBarProps> = ({ selectedTab}) => {
    const [ modalOpen, setModalOpen ] = useState(false)
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [tasks, setTasks] = useState<{ id: string }[]>([]);
    const handleOpen = () => setModalOpen(true)
    const handleModalClose = () => setModalOpen(false)
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Task[]>([]);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    
        const filteredTasks:any = tasks.filter((task) => {
        const taskInfo = `${task.Topic} ${task.Category}`;
        return taskInfo.toLowerCase().includes(query.toLowerCase());
        });
    
        setSearchResults(filteredTasks);
    };
    

    
    const fetchTasks = () => {
        const email = Cookies.get('userEmail');
        console.log(email)
        if (email !== undefined) {
            const taskCollection = collection(Db, 'Tasks');
            const taskQuery = query(taskCollection, where('Email', '==', email));
        
            const unsubscribe = onSnapshot(taskQuery, (snapshot) => {
                const updatedTasks = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setTasks(updatedTasks);
            });
    
            return () => unsubscribe();
        } else {
            console.log('Email not found in cookies');
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);
    const handleTaskClick = (item:any) => {
        console.log(item)
        setSelectedTask(item)
    }

    const deleteTask = async (taskId: string) => {
        try {
            const taskRef = doc(Db, 'Tasks', taskId); // Use taskRef instead of tasksRef
            await deleteDoc(taskRef); // Use `await` to wait for the deletion to complete
        } catch (error) {
            console.log('Error deleting task', error);
        }
    };
    
    
    const renderTabContent = () => {
        switch (selectedTab) {
            case 'today':
                return (
                    <div className='todayTask h-full overflow-y-auto scrollbar-hide'>
                        <button
                            onClick={() => handleOpen()}
                            className='task-btn bg-[red] w-[5rem] h-[25px] text-[0.9rem] rounded-md'
                        >
                            New Task
                        </button>
                        <AddTaskModal isOpen={modalOpen} handleClose={() => handleModalClose()}/>
                        {tasks.map((item: any) => {
                            const dueDate = item.DueDate.toDate();
                            const options = { weekday: 'short',day: 'numeric', month: 'short', year: 'numeric' };
                            const formattedDueDate = dueDate.toLocaleDateString(undefined, options);
                            
                            return (
                                <Task
                                    taskTitle={item.Topic}
                                    dueDate={formattedDueDate}
                                    category={item.Category}
                                    key={item.id}
                                    value={item.id}
                                    handleChange={() => deleteTask(item.id)}
                                    onClick={() => handleTaskClick(item)}
                                />
                            );
                        })}
                    </div>
                );
            case 'upcoming':
                return <div>Upcoming Tab Content</div>;
            case 'completed':
                return <div>Completed Tab Content</div>;
            case 'deleted':
                return <div>Deleted Tab Content</div>;
            case 'settings':
                return <div>Settings Tab Content</div>;
            default:
                return <div>Default Tab Content</div>;
        }
    };

    const handleCopyToClipboard = () => {
        if (selectedTask) {
            const taskInfo = `Task: ${selectedTask.Topic}\nDescription: ${selectedTask.Description}\nCategory: ${selectedTask.Category}\nDue Date: ${selectedTask.DueDate}`;
        
            const textArea = document.createElement('textarea');
            textArea.value = taskInfo;
        
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
        
            alert('Task information copied to clipboard');
        }
    };

    return (
        <div className="centerBar_container w-[80rem] p-4">
            <header className="header border-b-[1.5px] flex flex-row gap-20 p-4 items-center">
                <h1>Tasks</h1>
                <div className='filter flex flex-col w-[40%]'>
                    <div className="search-container flex flex-row items-center w-full border-[1px] rounded-sm">
                        <AiOutlineSearch size={35} className='searchIcon px-2 bg-[blue] hover:cursor-pointer' />
                        <input
                            placeholder="Search tasks"
                            className="search-input w-full p-1 outline-none"
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </div>

                    {searchQuery && (
                        <div className="search-results absolute bg-white border-2 mt-9 w-[31%] py-2 shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]">
                            {searchResults.map((task) => (
                                <div className='filters hover:cursor-pointer pl-3 hover:bg-[gray]' onClick={() => {setSearchQuery(''), setSelectedTask(task)}}>
                                    <h6>{task.Topic}</h6>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </header>
            <div className="tab-content w-full h-[90%] flex flex-row pt-3">
                <div className='task w-[60%] border-r-[1.5px] px-5'>
                    
                    {renderTabContent()}
                </div>
                <div className='taskContent w-[40%]'>
                    {selectedTask ? (
                        <div className='task-containe w-full h-full flex flex-col ml-2'>
                            <h1 className='task-title text-[1.5rem] font-semibold'>
                                Task:
                            </h1>
                            <h4 className='task-title text-[1.2rem] font-semibold'>
                                {selectedTask.Topic}
                            </h4>
                            <small className='describe text-[14px] mt-1 mb-5'>
                                {selectedTask.Description}
                            </small>
                            <div className='cat flex flexx-row items-center gap-10'>
                                <small>Category</small>
                                <span>{selectedTask.Category}</span>
                            </div>
                            <div className='cat flex flexx-row items-center gap-10'>
                                <small>Due Date</small>
                            </div>
                            <div className='subTask-Conatainer mt-10'>
                                <h1 className='title font-semibold text-[1rem]'>Subtask:</h1>
                                <div className='subBtn p-3 flex flex-row items-center gap-2 border-b-[1px] hover:cursor-pointer'>
                                    <GrAdd size={20}/>
                                    Add New Subtask
                                </div>
                            </div>
                            <div className='task-footer mt-[30vh] flex flex-row items-center justify-between px-5'>
                                <button className='finish bg-[yellow] p-2 rounded-lg text-[15px] flex flex-row items-center justify-center gap-2'>
                                    <IoCheckmarkDoneOutline size={20}/>
                                    Save Changes
                                </button>
                                <button onClick={handleCopyToClipboard} className='copy bg-[yellow] p-2 rounded-lg text-[15px] flex flex-row items-center justify-center gap-2'>
                                    <AiOutlineCopy size={20}/>
                                    Copy
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p>No task selected</p>
                    )}
                </div>
            </div>
        </div>
    );
};

function Home() {
    const [selectedTab, setSelectedTab] = useState<Tab>('today'); // Initialize with 'today'

    const onSelectTab = (tab: Tab) => {
        setSelectedTab(tab);
    };

    return (
        <div className="home-container w-full h-full flex flex-row">
            <Sidebar onSelectTab={onSelectTab} />
            <CenterBar selectedTab={selectedTab}/>
        </div>
    );
}

export default Home;
function doc(Db: Firestore, arg1: string, taskId: any): import("@firebase/firestore").DocumentReference<unknown, import("@firebase/firestore").DocumentData> {
    throw new Error('Function not implemented.');
}

