
export enum AgeGroup {
  Kids = "Kids (5-12)",
  Teens = "Teens (13-18)",
  Adults = "Adults (19-50)",
  Seniors = "Seniors (51+)",
}

export interface Exercise {
  name: string;
  description: string;
  duration: number; // in seconds
  reps: number;
  videoQuery: string;
}

export interface Workout {
  day: string;
  title: string;
  exercises: Exercise[];
}

export interface UserProfile {
  name: string;
  ageGroup: AgeGroup;
  workoutsCompleted: number;
  streak: number;
  avatar: string;
}

export interface ProgressData {
  day: string;
  minutes: number;
}
