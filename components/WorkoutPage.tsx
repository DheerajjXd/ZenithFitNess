import React, { useState, useEffect, useRef } from 'react';
import { Workout, Exercise } from '../types';
import { PlayIcon, PauseIcon, RefreshIcon, ClockIcon, VideoCameraIcon } from './Icons';

interface WorkoutPageProps {
  workout: Workout;
  onBack: () => void;
}

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const WorkoutPage: React.FC<WorkoutPageProps> = ({ workout, onBack }) => {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(workout.exercises[0].duration || 60);
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const currentExercise = workout.exercises[currentExerciseIndex];

  useEffect(() => {
    const newTime = workout.exercises[currentExerciseIndex].duration;
    // For rep-based exercises, default to a 60s timer as a pacer
    setTimeLeft(newTime > 0 ? newTime : 60);
    setIsActive(false);
  }, [currentExerciseIndex, workout.exercises]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      // Fix: Use `window.setInterval` to avoid TypeScript conflicts with Node.js's `Timeout` type.
      // In a browser environment, `setInterval` returns a number.
      intervalRef.current = window.setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      if (currentExerciseIndex < workout.exercises.length - 1) {
        setCurrentExerciseIndex(currentExerciseIndex + 1);
      } else {
        setIsActive(false);
      }
    }
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [isActive, timeLeft, currentExerciseIndex, workout.exercises.length]);

  const handleToggle = () => {
    setIsActive(!isActive);
  };

  const handleReset = () => {
    const newTime = workout.exercises[currentExerciseIndex].duration;
    setTimeLeft(newTime > 0 ? newTime : 60);
    setIsActive(false);
  };

  const handleNext = () => {
    if (currentExerciseIndex < workout.exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(currentExerciseIndex - 1);
    }
  };

  return (
    <div className="p-4 animate-fadeIn">
      <button onClick={onBack} className="mb-4 text-brand-primary hover:underline">
        &larr; Back to Dashboard
      </button>
      <h1 className="text-3xl font-bold text-brand-accent">{workout.title}</h1>
      <p className="text-gray-400 mb-6">Day: {workout.day}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Timer Section */}
        <div className="flex flex-col items-center justify-center bg-brand-gray p-8 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-2">{currentExercise.name}</h2>
          <p className="text-center text-gray-300 mb-4">{currentExercise.description}</p>
          <div className="relative w-64 h-64 flex items-center justify-center">
            <svg className="absolute w-full h-full" viewBox="0 0 100 100">
              <circle className="text-brand-dark" strokeWidth="7" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" />
              <circle
                className="text-brand-primary"
                strokeWidth="7"
                strokeDasharray="283"
                strokeDashoffset={283 - (timeLeft / (currentExercise.duration || 60)) * 283}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r="45"
                cx="50"
                cy="50"
                style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
              />
            </svg>
            <div className="text-6xl font-bold text-brand-light">{formatTime(timeLeft)}</div>
          </div>
          <div className="flex items-center space-x-6 mt-6">
            <button onClick={handleReset} className="text-gray-400 hover:text-white transition-colors">
              <RefreshIcon />
            </button>
            <button onClick={handleToggle} className="text-brand-primary hover:text-brand-accent transition-colors">
              {isActive ? <PauseIcon /> : <PlayIcon />}
            </button>
            <div className="w-8"></div> {/* Spacer */}
          </div>
        </div>

        {/* Exercise List */}
        <div className="flex flex-col">
          <h3 className="text-xl font-semibold mb-4 text-brand-accent">Exercise List</h3>
          <div className="space-y-3 overflow-y-auto max-h-[60vh] pr-2">
            {workout.exercises.map((exercise, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg cursor-pointer transition-all ${
                  index === currentExerciseIndex
                    ? 'bg-brand-secondary shadow-md ring-2 ring-brand-primary'
                    : 'bg-brand-gray hover:bg-opacity-80'
                }`}
                onClick={() => setCurrentExerciseIndex(index)}
              >
                <h4 className="font-bold">{exercise.name}</h4>
                <div className="text-sm text-gray-300 flex items-center justify-between">
                  <span>
                    <ClockIcon />
                    {exercise.duration > 0 ? `${exercise.duration}s` : `${exercise.reps} reps`}
                  </span>
                  <a
                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(exercise.videoQuery)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-brand-primary hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <VideoCameraIcon /> Watch
                  </a>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4">
            <button onClick={handlePrev} disabled={currentExerciseIndex === 0} className="px-4 py-2 bg-brand-secondary rounded-lg disabled:opacity-50 disabled:cursor-not-allowed">Previous</button>
            <button onClick={handleNext} disabled={currentExerciseIndex === workout.exercises.length - 1} className="px-4 py-2 bg-brand-primary rounded-lg disabled:opacity-50 disabled:cursor-not-allowed">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutPage;
