import { FiMenu } from "react-icons/fi";
import { AiFillCloseCircle } from 'react-icons/ai';
import { Link } from 'react-router-dom'; // Ensure correct import for Link

import Footer from '../Components/Footer';

function HomeLayout({ children }) {
    function changeWidth() {
        const drawerSide = document.getElementsByClassName("drawer-side");
        if (drawerSide[0]) {
            drawerSide[0].style.width = 'auto'; // Corrected to set width to auto when opening
        }
    }
    function hideDrawer() {
        const element = document.getElementsByClassName("drawer-toggle");
        if (element[0]) {
            element[0].checked = false;
        }

        changeWidth(); // Corrected function name
    }
    return (
        <div className="min-h-[90vh]">
            <div className="drawer absolute left-0 z-50 w-fit">
                <input type="checkbox" id="my-drawer" className="drawer-toggle" />
                <div className="drawer-content">
                    <label htmlFor="my-drawer" className="cursor-pointer relative">
                        <FiMenu
                            onClick={changeWidth}
                            size={"32px"}
                            className="font-bold text-white m-4"
                        />
                    </label>
                </div>
                <div className="drawer-side w-0">
                    <label htmlFor="my-drawer"></label>
                    <ul className="menu p-4 w-48 sm:w-80 bg-base-100 text-base-content relative">
                        <li className="w-fit absolute right-2 z-50">
                            <button onClick={hideDrawer}>
                                <AiFillCloseCircle size={24} />
                            </button>
                        </li>
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/courses">Courses</Link>
                        </li>
                        <li>
                            <Link to="/contact">Contact</Link>
                        </li>
                        <li>
                            <Link to="/about">About Us</Link>
                        </li>
                    </ul>
                </div>
            </div>

            {children}
            <Footer />
        </div>
    );
}

export default HomeLayout;
