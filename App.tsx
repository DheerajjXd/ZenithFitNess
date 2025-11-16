
import React, { useState, useEffect, useCallback } from 'react';
import { AgeGroup, Workout, UserProfile, ProgressData } from './types';
import { generateWorkoutPlan } from './services/geminiService';
import Dashboard from './components/Dashboard';
import ProfilePage from './components/ProfilePage';
import WorkoutPage from './components/WorkoutPage';
import { HomeIcon, ChartBarIcon, UserIcon } from './components/Icons';

type Page = 'dashboard' | 'profile' | 'workout';

const AgeSelector: React.FC<{ onSelect: (ageGroup: AgeGroup) => void }> = ({ onSelect }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-brand-dark p-4 text-center">
      <h1 className="text-4xl md:text-5xl font-extrabold text-brand-accent mb-4">Welcome to ZenithFit</h1>
      <p className="text-lg text-gray-300 mb-8 max-w-2xl">Your personal AI fitness coach. Select your age group to get a personalized workout plan.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.values(AgeGroup).map((group) => (
          <button
            key={group}
            onClick={() => onSelect(group)}
            className="bg-brand-primary hover:bg-brand-secondary text-white font-bold py-4 px-8 rounded-lg transition-transform hover:scale-105"
          >
            {group}
          </button>
        ))}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [workouts, setWorkouts] = useState<Workout[] | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mockProgress: ProgressData[] = [
    { day: 'Mon', minutes: 30 },
    { day: 'Tue', minutes: 45 },
    { day: 'Wed', minutes: 0 },
    { day: 'Thu', minutes: 60 },
    { day: 'Fri', minutes: 25 },
    { day: 'Sat', minutes: 75 },
    { day: 'Sun', minutes: 0 },
  ];

  const handleSelectAgeGroup = useCallback(async (ageGroup: AgeGroup) => {
    setIsLoading(true);
    setError(null);
    const newUserProfile: UserProfile = {
      name: "Alex",
      ageGroup,
      workoutsCompleted: 12,
      streak: 5,
      avatar: `https://picsum.photos/seed/${ageGroup}/200`,
    };
    setUserProfile(newUserProfile);

    try {
      const plan = await generateWorkoutPlan(ageGroup);
      if (plan) {
        setWorkouts(plan);
      } else {
        setError("Failed to generate workout plan. Please try again.");
      }
    } catch (e) {
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const handleSelectWorkout = (workout: Workout) => {
    setSelectedWorkout(workout);
    setCurrentPage('workout');
  }

  const renderPage = () => {
    if (currentPage === 'workout' && selectedWorkout) {
        return <WorkoutPage workout={selectedWorkout} onBack={() => setCurrentPage('dashboard')} />;
    }
    if (currentPage === 'profile' && userProfile) {
        return <ProfilePage user={userProfile} />;
    }
    if (currentPage === 'dashboard' && userProfile && workouts) {
        return <Dashboard userName={userProfile.name} workouts={workouts} progressData={mockProgress} onSelectWorkout={handleSelectWorkout}/>;
    }
    return null; // Should not happen in normal flow
  };

  if (!userProfile) {
    return <AgeSelector onSelect={handleSelectAgeGroup} />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-brand-dark">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-brand-primary"></div>
        <p className="text-white mt-4 text-xl">Generating your personalized plan...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-brand-dark p-4">
        <p className="text-red-500 text-xl mb-4">{error}</p>
        <button
          onClick={() => setUserProfile(null)}
          className="bg-brand-primary hover:bg-brand-secondary text-white font-bold py-2 px-4 rounded"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-dark font-sans">
      <main className="pb-20">
        {renderPage()}
      </main>
      <nav className="fixed bottom-0 left-0 right-0 bg-brand-gray/80 backdrop-blur-sm shadow-lg border-t border-brand-secondary/50">
        <div className="max-w-4xl mx-auto flex justify-around p-2">
          <button onClick={() => setCurrentPage('dashboard')} className={`flex flex-col items-center p-2 rounded-lg transition-colors ${currentPage === 'dashboard' ? 'text-brand-primary' : 'text-gray-400 hover:text-white'}`}>
            <HomeIcon />
            <span className="text-xs">Home</span>
          </button>
          <button disabled className={`flex flex-col items-center p-2 rounded-lg transition-colors text-gray-600 cursor-not-allowed`}>
            <ChartBarIcon />
            <span className="text-xs">Progress</span>
          </button>
          <button onClick={() => setCurrentPage('profile')} className={`flex flex-col items-center p-2 rounded-lg transition-colors ${currentPage === 'profile' ? 'text-brand-primary' : 'text-gray-400 hover:text-white'}`}>
            <UserIcon />
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </nav>
      <style>{`
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default App;
