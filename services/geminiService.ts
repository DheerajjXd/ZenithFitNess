
import { GoogleGenAI, Type } from "@google/genai";
import { AgeGroup, Workout } from "../types";

// Fix: Per @google/genai guidelines, initialize directly with process.env.API_KEY
// and assume it is set in the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const generateWorkoutPlan = async (ageGroup: AgeGroup): Promise<Workout[] | null> => {
  const prompt = `
    Generate a diverse and effective 7-day workout plan suitable for the '${ageGroup}' age group.
    For each day, provide a creative title and a list of 4-6 exercises.
    For each exercise, include a name, a brief description, a specific duration in seconds (if time-based) or a number of reps (if count-based), and a concise YouTube search query for a tutorial video.
    If an exercise is rep-based, set duration to 0. If it's duration-based, set reps to 0.
    Ensure the plan is balanced, targeting different muscle groups throughout the week, with appropriate rest days or light activity days.
    The response must be in JSON format.
  `;
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              day: { type: Type.STRING },
              title: { type: Type.STRING },
              exercises: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    description: { type: Type.STRING },
                    duration: { type: Type.INTEGER },
                    reps: { type: Type.INTEGER },
                    videoQuery: { type: Type.STRING },
                  },
                  required: ["name", "description", "duration", "reps", "videoQuery"],
                },
              },
            },
            required: ["day", "title", "exercises"],
          },
        },
      },
    });

    const jsonString = response.text;
    const workoutPlan: Workout[] = JSON.parse(jsonString);
    return workoutPlan;

  } catch (error) {
    console.error("Error generating workout plan:", error);
    return null;
  }
};
