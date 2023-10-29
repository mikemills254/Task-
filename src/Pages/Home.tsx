import React, { useState } from 'react';
import { setIsAuthenticated } from '../Utils/Slicer';
import { useDispatch } from 'react-redux';
import { AiOutlineStar, AiOutlineSearch, AiOutlineCalendar, AiOutlineCheck } from 'react-icons/ai';
import { BsTrash } from 'react-icons/bs';
import { BiCog } from 'react-icons/bi';
import { SlLogout } from 'react-icons/sl';
import Task from '../Components/Task';
import Button from '../Components/Button';

type Tab = 'today' | 'upcoming' | 'completed' | 'deleted' | 'settings';

const Sidebar: React.FC<{ onSelectTab: (tab: Tab) => void }> = ({ onSelectTab }) => {
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
                    <li>
                        <SlLogout />
                        LogOut
                    </li>
                </ul>
            </div>
        </aside>
    );
};

const CenterBar: React.FC<{ selectedTab: Tab }> = ({ selectedTab }) => {
    const renderTabContent = () => {
        // Depending on the selectedTab, render the appropriate content.
        switch (selectedTab) {
            case 'today':
                return (
                    <div className='todayTask h-full overflow-y-auto scrollbar-hide'>
                        <Task/>
                        <Task/>
                        <Task/>
                        <Task/>
                        <Task/>
                        <Task/>
                        <Task/>
                        <Task/>
                        <Task/>
                        <Task/>
                        <Task/>
                        <Task/>
                        <Task/>
                        <Task/>
                        <Task/>
                        <Task/>
                        <Task/>
                        <Task/>
                        <Task/>
                        <Task/>
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
                    <Button
                        text='New Task'
                        ContainerStyle={'addtask-btn bg-[red] w-20 h-6 font-semibold p-2 text-[13px]'}
                    />
                    {renderTabContent()}
                </div>
                <div>
                    div1
                </div>
            </div>
        </div>
    );
};

function Home() {
    const dispatch = useDispatch();
    const [selectedTab, setSelectedTab] = useState<Tab>('today'); // Initialize with 'today'

    const onSelectTab = (tab: Tab) => {
        setSelectedTab(tab);
    };

    const logout = () => {
        dispatch(setIsAuthenticated(false));
    }

    return (
        <div className="home-container w-full h-full flex flex-row">
            <Sidebar onSelectTab={onSelectTab} />
            <CenterBar selectedTab={selectedTab} />
        </div>
    );
}

export default Home;
