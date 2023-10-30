import React, { useEffect, useState } from 'react';
import { setIsAuthenticated } from '../Utils/Slicer';
import { useDispatch } from 'react-redux';
import { AiOutlineStar, AiOutlineSearch, AiOutlineCheck } from 'react-icons/ai';
import { BiCog } from 'react-icons/bi';
import { SlLogout } from 'react-icons/sl';
import Task from '../Components/Task';
import AddTaskModal from '../Components/AddTaskModal';
import Cookies from 'js-cookie';
import { collection, deleteDoc, onSnapshot, query, where, doc, addDoc } from 'firebase/firestore';
import { Db } from '../Utils/Firebase';
import { GrAdd } from 'react-icons/gr'
import { IoCheckmarkDoneOutline } from 'react-icons/io5'
import { AiOutlineCopy } from 'react-icons/ai';
import { AiOutlineClose } from 'react-icons/ai'

type Tab = 'today' | 'upcoming' | 'completed' | 'deleted' | 'settings';

const Sidebar: React.FC<{ onSelectTab: (tab: Tab) => void }> = ({ onSelectTab }) => {
    const [activeTab, setActiveTab] = useState<Tab>('today');
    const dispatch = useDispatch();
    
        const handleLogOut = () => {
            dispatch(setIsAuthenticated(false));
            Cookies.remove('accessToken');
            Cookies.remove('userEmail');
            Cookies.remove('userName');
        };
    
    return (
        <aside>
            <div className="sidebar__container h-[100vh] w-60 flex flex-col align-middle justify-between border-r-[1.5px]">
                <ul className="sidebar_ul">
                    <div className='thisLogo flex flex-row items-center'>
                        <h1 className="logo text-[1.5rem] font-semibold border-b-[1.5px] p-2">
                            Task+
                        </h1>
                    </div>
                    
                    <li
                        onClick={() => {
                            onSelectTab('today');
                            setActiveTab('today');
                        }}
                        className={`tab-item ${activeTab === 'today' ? 'activeTab' : 'inactive'}`}
                    >
                        <AiOutlineStar />
                        <span>Today</span>
                    </li>
                    <li
                        onClick={() => {
                            onSelectTab('completed');
                            setActiveTab('completed');
                        }}
                        className={`tab-item ${activeTab === 'completed' ? 'activeTab' : 'inactive'}`}
                    >
                    <AiOutlineCheck />
                        <span>Completed</span>
                    </li>
                </ul>
                <ul>
                    <li
                        onClick={() => {
                            onSelectTab('settings');
                            setActiveTab('settings');
                        }}
                        className={`tab-item ${activeTab === 'settings' ? 'activeTab' : 'inactive'}`}
                    >
                        <BiCog />
                        <span>Settings</span>
                    </li>
                    <li onClick={() => handleLogOut()}>
                        <SlLogout />
                        <span>LogOut</span>
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
    const [tasks, setTasks] = useState<{ id: string; Topic: string; Category: string }[]>([]);
    const [ localtask, setLocalTasks ] = useState<{ id: string }[]>([]);
    const handleOpen = () => setModalOpen(true)
    const handleModalClose = () => setModalOpen(false)
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Task[]>([]);
    const [isTaskContentVisible, setIsTaskContentVisible] = useState(false);
    const [ completed, setCompleted ] = useState<{ id: string; Topic: string; Category: string }[]>([]);


    const handleSearch = (query: string) => {
        setSearchQuery(query);
    
        const filteredTasks:any = tasks.filter((task) => {
        const taskInfo = `${task.Topic} ${task.Category}`;
        return taskInfo.toLowerCase().includes(query.toLowerCase());
        });

        console.log(localtask)
    
        setSearchResults(filteredTasks);
    };

    const FetchCompletedtask = () => {
        
        const email = Cookies.get('userEmail');
        console.log(email)
        if (email !== undefined) {
            const taskCollection = collection(Db, 'Completed');
            const taskQuery = query(taskCollection, where('Email', '==', email));
        
            const unsubscribe = onSnapshot(taskQuery, (snapshot) => {
                let updatedTasks = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    Topic: doc.data().TaskName,
                    Category: doc.data().Description,
                }));
                console.log('fromCompleted', completed)
                setCompleted(updatedTasks);
            });
            
    
            return () => unsubscribe();
        } else {
            console.log('Email not found in cookies');
        }
    }
    
    const fetchTasks = () => {
        const email = Cookies.get('userEmail');
        console.log(email)
        if (email !== undefined) {
            const taskCollection = collection(Db, 'Tasks');
            const taskQuery = query(taskCollection, where('Email', '==', email));
        
            const unsubscribe = onSnapshot(taskQuery, (snapshot) => {
                let updatedTasks = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                const localTask = JSON.parse(localStorage.getItem('tasks')|| '[]')
                console.log('local storage', localTask)
                const mergedTasks = [...localTask, ...updatedTasks];
            
                setTasks(mergedTasks);
                
                setLocalTasks(mergedTasks);
            });
    
            return () => unsubscribe();
        } else {
            console.log('Email not found in cookies');
        }
    };

    useEffect(() => {
        fetchTasks();
        FetchCompletedtask()

    }, []);
    const handleTaskClick = (item:any) => {
        console.log(item)
        setSelectedTask(item)
        if(window.innerWidth <= 768) {
            setIsTaskContentVisible(true)
        } else {
            alert('We are in desktop')
        }
    }

    const deleteTask = async (task: any) => {
        try {
            await addDoc(collection(Db, 'Completed'), {
                TaskName: task?.Topic || '',
                Email: task?.Email || '' ,
                Description: task?.Description || ''
            })
                .then(async() => {
                    const taskRef = doc(Db, 'Tasks', task.id);
                    await deleteDoc(taskRef);
                })
            
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
                            className='task-btn bg-[#cbffeb] w-[10rem] h-[30px] font-semibold text-[0.9rem] rounded-md text-[#00332b] shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]'
                        >
                            New Task
                        </button>
                        <AddTaskModal isOpen={modalOpen} handleClose={() => handleModalClose()}/>
                        {tasks.map((item: any) => {
                            const dueDateTimestamp = item.DueDate.seconds * 1000;
                            const dueDate = new Date(dueDateTimestamp);
                            
                            const options:any = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' };
                            const formattedDueDate = dueDate.toLocaleDateString(undefined, options);
                            
                            return (
                                <Task
                                    taskTitle={item.Topic}
                                    category={item.Category}
                                    dueDate={formattedDueDate}
                                    key={item.id}
                                    value={item.id}
                                    handleChange={() => deleteTask(item)}
                                    onClick={() => handleTaskClick(item)}
                                />
                            );
                        })}

                    </div>
                );
            case 'completed':
                return (
                    <div className='completedTask w-full h-[100%]'>
                        {completed.map((item:any) => {
                            return(
                                <div className='completedComponent flex flex-row items-center justify-between bg-[#cbffeb] w-full my-2 rounded-md py-3 px-2 border-[1px] hover:cursor-pointer'>
                                    <div className='completedTaskDetails'>
                                        <p className='title font-medium text-[#00ad88]'>{item.Topic}</p>
                                        <small className='description text-[#008a70]'>{item.Category}</small>
                                    </div>
                                    <AiOutlineCheck size={25} className='checkIcon p-1 bg-[#e9fff8] rounded-full text-[#00d4a4]' />
                                </div>
                            )
                        })}
                    </div>
                )
            default:
                return <div>Start Tasking</div>;
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
        <div className="centerBar_container w-[80rem] p-4 flex flex-col flex-grow-0">
            <header className="header border-b-[1.5px]  flex flex-row gap-20 p-4 items-center">
                <h1>Tasks</h1>
                <div className='filter flex flex-col w-[40%]'>
                    <div className="search-container flex flex-row items-center w-full border-[1px] rounded-sm">
                        <AiOutlineSearch size={35} className='searchIcon px-2 bg-[#00d4a4] hover:cursor-pointer' color='#00332b' />
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
                                <div className='filters hover:cursor-pointer pl-3 hover:bg-[gray]' onClick={() => {setSearchQuery(''), setSelectedTask(task), setIsTaskContentVisible(true)}}>
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
                <div className={`taskContent w-[40%] ${isTaskContentVisible ? '' : 'mobile-hidden'}`}>
                <button className='closeBtn hidden ml-[91%] mt-5' onClick={() => setIsTaskContentVisible(false)}>
                    <AiOutlineClose size={20}/>
                </button>
                    {selectedTask ? (
                        <div className='task-container w-full h-full flex flex-col ml-2'>
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
                                <small>Category:</small>
                                <span>{selectedTask.Category}</span>
                            </div>
                            <div className='cat flex flexx-row items-center gap-10'>
                                <small>Due Date:</small>
                            </div>
                            <div className='subTask-Conatainer mt-10'>
                                <h1 className='title font-semibold text-[1rem]'>Subtask:</h1>
                                <div className='subBtn p-3 flex flex-row items-center gap-2 border-b-[1px] hover:cursor-pointer'>
                                    <GrAdd size={20}/>
                                    Add New Subtask
                                </div>
                            </div>
                            <div className='task-footer mt-[30vh] flex flex-row items-center justify-between px-5'>
                                <button className='finish bg-[#00d4a4] p-2 rounded-lg text-[15px] flex flex-row items-center justify-center gap-2'>
                                    <IoCheckmarkDoneOutline size={20} className='saveIcon'/>
                                    Save Changes
                                </button>
                                <button onClick={handleCopyToClipboard} className='copy bg-[#00d4a4] p-2 rounded-lg text-[15px] flex flex-row items-center justify-center gap-2'>
                                    <AiOutlineCopy size={20} className='copyIcon'/>
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
    const [selectedTab, setSelectedTab] = useState<Tab>('today');

    const onSelectTab = (tab: Tab) => {
        setSelectedTab(tab);
    };

    return (
        <div className="home-container w-full flex flex-row">
            <Sidebar onSelectTab={onSelectTab} />
            <CenterBar selectedTab={selectedTab}/> 
        </div>
    );
}

export default Home;


