import { Outlet } from 'react-router-dom';
import './dashboardlayout.css';

const DashboardLayout = () => {
    return(
        <div className='dashboardlayout'>
            <div className="menu">MENU</div>
            <div className="content"><Outlet /></div>
        </div>
    )
}

export default DashboardLayout;