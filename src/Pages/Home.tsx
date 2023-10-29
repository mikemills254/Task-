import React, { useState } from 'react';
import { setIsAuthenticated } from '../Utils/Slicer';
import { useDispatch } from 'react-redux';
import { AiOutlineStar, AiOutlineSearch, AiOutlineCalendar, AiOutlineCheck } from 'react-icons/ai';
import { BsTrash } from 'react-icons/bs';
import { BiCog } from 'react-icons/bi';
import { SlLogout } from 'react-icons/sl';
import Task from '../Components/Task';
import Button from '../Components/Button';
import AddTaskModal from '../Components/AddTaskModal';

type Tab = 'today' | 'upcoming' | 'completed' | 'deleted' | 'settings';

const Sidebar: React.FC<{ onSelectTab: (tab: Tab) => void }> = ({ onSelectTab }) => {
    const dispatch = useDispatch()
    const handleLogOut = () => {
        dispatch(setIsAuthenticated(false))
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

const CenterBar: React.FC<CenterBarProps> = ({ selectedTab}) => {
    const [ modalOpen, setModalOpen ] = useState(false)
    const [ selectedTask, setSelectedTask ] = useState(false)
    const handleOpen = () => setModalOpen(true)
    const handleModalClose = () => setModalOpen(false)
    
    const handleClick = (taskContent:string) => {
        console.log(taskContent);
        setSelectedTask(true)
    }
    
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
                        <Task
                            onClick={() => handleClick('Task one')} isSelected={selectedTask} taskContent={'helloe'}                        />
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

    return (
        <div className="centerBar_container w-[80rem] p-4">
            <header className="header border-b-[1.5px] flex flex-row gap-20 p-4 items-center">
                <h1>Tasks</h1>
                <div className="search-container flex flex-row items-center w-[40%] border-[1px] rounded-sm">
                    <AiOutlineSearch size={35} className='searchIcon px-2 bg-[blue] hover:cursor-pointer' />
                    <input
                        placeholder="search here"
                        className="search-input w-full p-1 outline-none"
                    />
                </div>
            </header>
            <div className="tab-content w-full h-[90%] flex flex-row pt-3">
                <div className='task w-[60%] border-r-[1.5px] px-5'>
                    
                    {renderTabContent()}
                </div>
                <div className='taskContent'>
                    {selectedTask && <div>{selectedTask}</div>}
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
