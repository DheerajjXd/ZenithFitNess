
import React from 'react';
import { Workout, ProgressData } from '../types';
import ProgressChart from './ProgressChart';
import { ClockIcon } from './Icons';

interface DashboardProps {
  userName: string;
  workouts: Workout[];
  progressData: ProgressData[];
  onSelectWorkout: (workout: Workout) => void;
}

const WorkoutCard: React.FC<{ workout: Workout, onSelect: () => void }> = ({ workout, onSelect }) => {
    const totalDuration = workout.exercises.reduce((acc, ex) => acc + ex.duration, 0);
    const totalMinutes = Math.ceil(totalDuration / 60);

    return (
        <div 
            onClick={onSelect}
            className="bg-brand-gray p-6 rounded-2xl shadow-lg hover:shadow-brand-primary/50 hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between"
        >
            <div>
                <div className="flex justify-between items-start">
                    <p className="text-sm font-semibold text-brand-primary">{workout.day}</p>
                    <div className="flex items-center text-sm text-gray-400">
                        <ClockIcon className="h-4 w-4 mr-1"/> {totalMinutes} min
                    </div>
                </div>
                <h3 className="text-xl font-bold mt-2 text-white">{workout.title}</h3>
                <p className="text-gray-400 text-sm mt-2 line-clamp-2">
                    {workout.exercises.map(e => e.name).join(', ')}
                </p>
            </div>
            <button className="mt-4 w-full bg-brand-secondary text-brand-light font-semibold py-2 px-4 rounded-lg hover:bg-brand-primary transition-colors">
                Start Workout
            </button>
        </div>
    );
};


const Dashboard: React.FC<DashboardProps> = ({ userName, workouts, progressData, onSelectWorkout }) => {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const todaysWorkout = workouts.find(w => w.day === today) || workouts[0];

  return (
    <div className="p-4 md:p-8 space-y-8 animate-fadeIn">
      <div>
        <h1 className="text-3xl font-bold">Hello, {userName}</h1>
        <p className="text-gray-400">Ready to crush your goals today?</p>
      </div>

      {todaysWorkout && (
        <div className="bg-gradient-to-br from-brand-secondary to-brand-primary text-white p-8 rounded-2xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
                <p className="font-semibold text-brand-accent">WORKOUT OF THE DAY</p>
                <h2 className="text-4xl font-extrabold mt-1">{todaysWorkout.title}</h2>
                <p className="mt-2 max-w-lg">{todaysWorkout.exercises.map(e => e.name).join(' • ')}</p>
            </div>
            <button
                onClick={() => onSelectWorkout(todaysWorkout)}
                className="bg-brand-accent text-brand-dark font-bold py-3 px-8 rounded-full shadow-lg hover:scale-105 transition-transform whitespace-nowrap"
            >
                Let's Go!
            </button>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-bold mb-4 text-brand-accent">Your Weekly Plan</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {workouts.map((workout, index) => (
            <WorkoutCard key={index} workout={workout} onSelect={() => onSelectWorkout(workout)} />
          ))}
        </div>
      </div>

      <ProgressChart data={progressData} />
    </div>
  );
};

export default Dashboard;
