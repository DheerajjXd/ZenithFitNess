
import React from 'react';
import { UserProfile } from '../types';
import { ChartBarIcon, FireIcon, UserIcon } from './Icons';

interface ProfilePageProps {
  user: UserProfile;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user }) => {
  return (
    <div className="p-4 md:p-8 animate-fadeIn">
      <h1 className="text-3xl font-bold text-brand-accent mb-8">My Profile</h1>
      <div className="bg-brand-gray rounded-2xl shadow-lg p-8 flex flex-col md:flex-row items-center gap-8">
        <div className="relative">
          <img src={user.avatar} alt="User Avatar" className="w-32 h-32 rounded-full ring-4 ring-brand-primary" />
        </div>
        <div className="text-center md:text-left">
          <h2 className="text-4xl font-extrabold text-white">{user.name}</h2>
          <p className="text-lg text-brand-primary">{user.ageGroup}</p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-brand-gray p-6 rounded-xl shadow-lg flex items-center gap-4">
          <div className="bg-brand-secondary p-3 rounded-full">
            <ChartBarIcon className="h-8 w-8 text-brand-primary" />
          </div>
          <div>
            <p className="text-gray-400">Workouts Completed</p>
            <p className="text-2xl font-bold">{user.workoutsCompleted}</p>
          </div>
        </div>
        <div className="bg-brand-gray p-6 rounded-xl shadow-lg flex items-center gap-4">
          <div className="bg-brand-secondary p-3 rounded-full">
            <FireIcon className="h-8 w-8 text-brand-accent" />
          </div>
          <div>
            <p className="text-gray-400">Current Streak</p>
            <p className="text-2xl font-bold">{user.streak} Days</p>
          </div>
        </div>
        <div className="bg-brand-gray p-6 rounded-xl shadow-lg flex items-center gap-4">
          <div className="bg-brand-secondary p-3 rounded-full">
            <UserIcon className="h-8 w-8 text-gray-300" />
          </div>
          <div>
            <p className="text-gray-400">Fitness Level</p>
            <p className="text-2xl font-bold">Intermediate</p>
          </div>
        </div>
      </div>
      
      <div className="mt-8 bg-brand-gray p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-bold text-brand-accent mb-4">Settings</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p>Notifications</p>
            <label className="switch relative inline-block w-12 h-6">
              <input type="checkbox" className="opacity-0 w-0 h-0" />
              <span className="slider absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-brand-dark rounded-full transition-all before:absolute before:h-4 before:w-4 before:left-1 before:bottom-1 before:bg-white before:rounded-full before:transition-all"></span>
            </label>
          </div>
          <div className="flex justify-between items-center">
            <p>Dark Mode</p>
            <label className="switch relative inline-block w-12 h-6">
              <input type="checkbox" className="opacity-0 w-0 h-0" defaultChecked/>
              <span className="slider absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-brand-dark rounded-full transition-all before:absolute before:h-4 before:w-4 before:left-1 before:bottom-1 before:bg-white before:rounded-full before:transition-all"></span>
            </label>
          </div>
          <button className="w-full mt-4 bg-brand-primary hover:bg-brand-secondary text-white font-bold py-2 px-4 rounded-lg transition-colors">
            Change Age Group
          </button>
        </div>
      </div>
       <style>{`
          .switch input:checked + .slider { background-color: #00A8E8; }
          .switch input:checked + .slider:before { transform: translateX(24px); }
        `}</style>
    </div>
  );
};

export default ProfilePage;
