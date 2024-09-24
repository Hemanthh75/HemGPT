import { Link, Outlet } from 'react-router-dom';
import './rootlayout.css';

const RootLayout = () => {
    return(
        <div className='rootLayout'>
            <header>
                <Link to="/" className='logo'>
                    <img src='/logo.png' alt="" />
                    <span>Hem AI</span>
                </Link>
                <div className="user">User</div>
            </header>
            <main>
                <Outlet />
            </main>
        </div>
    )
}

export default RootLayout;