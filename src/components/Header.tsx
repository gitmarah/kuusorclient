import React from 'react';
import { useAppSelector } from '../app/hooks';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { FolderClosed, Plus } from 'lucide-react';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const user = useAppSelector(state => state.auth.user);
  const location = useLocation();
  const pathname = location.pathname;
  
  return (
    <header className='fixed left-0 right-0 h-13 bg-white px-4 md:px-0 shadow-xs border-b border-gray-100 z-50 flex'>
      <div className='w-full md:max-w-3/4 md:mx-auto flex items-center justify-between'>
        <div className='flex items-center gap-1'>
            <h1 onClick={() => navigate("/")} className='text-xl font-coiny text-pri font-bold cursor-pointer'>Kuusor</h1>        
        </div>
        {user && <div className='flex gap-1 items-center'>
          {(pathname === "/" && user?.role === "COMPANY") && <div onClick={() => navigate(`/postinternship`)} className='w-9 aspect-square rounded-full overflow-hidden border border-pri text-pri flex justify-center items-center cursor-pointer'>
            <Plus />
          </div>}
          {(pathname === "/" && user?.role === "STUDENT") && <div onClick={() => navigate(`/applications`)} className='w-9 aspect-square rounded-full overflow-hidden border border-pri text-pri flex justify-center items-center cursor-pointer'>
            <FolderClosed size={18} className='active:scale-90' />
          </div>}
          <div onClick={() => navigate(`/profile/${user?.id}`)} className='w-9 aspect-square rounded-full overflow-hidden border border-gray-200 cursor-pointer'>
            <img src={user?.profileUrl ? user.profileUrl : '/profile.jpg'} />
          </div>          
        </div>}
        {!user && <div className='flex gap-1 items-center'>
          <button onClick={() => navigate("/signin")} className='bg-pri text-sm px-3 py-1 text-white rounded-full cursor-pointer hover:opacity-95 active:scale-95 transition-all font-thin'>Signin</button>         
          <button onClick={() => navigate("/signup")} className='bg-pri text-sm px-3 py-1 text-white rounded-full cursor-pointer hover:opacity-95 active:scale-95 transition-all'>Create an account</button>         
        </div>}
      </div>
    </header>
  )
}

export default Header;