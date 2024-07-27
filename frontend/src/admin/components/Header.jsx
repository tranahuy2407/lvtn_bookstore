import React, { useState, useEffect, useContext, } from 'react';
import { Menu, MenuButton, Transition, MenuItems, MenuItem } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/16/solid';
import classNames from 'classnames';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../authencation/AuthContext';

function Header() {

  const navigate = useNavigate();
  const { user, logout, ready } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login'); 
  };

  return (
    <div className='bg-white h-16 px-4 flex justify-between items-center border-b border-gray-200'>
      <div></div>
      <div className='flex items-center gap-2 mr-2'>
        <Menu as="div" className="relative">
          <MenuButton className="inline-flex items-center gap-2 rounded-md bg-gray-800 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-700 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white">
          {!!user && (
              <div>
                {user.name}
              </div>
            )}
            <ChevronDownIcon className="size-4 fill-white/60" />
          </MenuButton>
          <Transition
            enter="transition ease-out duration-75"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <MenuItems className="origin-top-right z-10 absolute right-0 mt-2 w-48 rounded-sm shadow-md p-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
              <MenuItem>
                {({ active }) => (
                  <div
                    onClick={() => navigate('/profile')}
                    className={classNames(
                      active && 'bg-gray-100',
                      'active:bg-gray-200 rounded-sm px-4 py-2 text-gray-700 cursor-pointer focus:bg-gray-200'
                    )}
                  >
                    Your Profile
                  </div>
                )}
              </MenuItem>
              <MenuItem>
                {({ active }) => (
                  <div
                    onClick={handleLogout}
                    className={classNames(
                      active && 'bg-gray-100',
                      'active:bg-gray-200 rounded-sm px-4 py-2 text-gray-700 cursor-pointer focus:bg-gray-200'
                    )}
                  >
                    Đăng xuất
                  </div>
                )}
              </MenuItem>
            </MenuItems>
          </Transition>
        </Menu>
      </div>
    </div>
  );
}

export default Header;
