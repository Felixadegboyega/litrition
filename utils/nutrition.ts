import { NutritionInfo, FoodEntry, DailyGoals } from '@/types/food';

export const calculateDailyNutrition = (entries: FoodEntry[]): NutritionInfo => {
  return entries.reduce(
    (total, entry) => ({
      calories: total.calories + entry.nutrition.calories,
      protein: total.protein + entry.nutrition.protein,
      carbs: total.carbs + entry.nutrition.carbs,
      fat: total.fat + entry.nutrition.fat,
      fiber: total.fiber + entry.nutrition.fiber,
      sugar: total.sugar + entry.nutrition.sugar,
      sodium: total.sodium + entry.nutrition.sodium,
    }),
    {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      sugar: 0,
      sodium: 0,
    }
  );
};

export const calculateBMR = (weight: number, height: number, age: number, gender: 'male' | 'female'): number => {
  // Mifflin-St Jeor Equation
  const base = 10 * weight + 6.25 * height - 5 * age;
  return gender === 'male' ? base + 5 : base - 161;
};

export const calculateDailyCalories = (bmr: number, activityLevel: string): number => {
  const multipliers = {
    sedentary: 1.2,
    lightly_active: 1.375,
    moderately_active: 1.55,
    very_active: 1.725,
  };
  return Math.round(bmr * (multipliers[activityLevel as keyof typeof multipliers] || 1.2));
};

export const getDefaultGoals = (weight: number, height: number, age: number, activityLevel: string): DailyGoals => {
  const bmr = calculateBMR(weight, height, age, 'male'); // Default to male for simplicity
  const calories = calculateDailyCalories(bmr, activityLevel);
  
  return {
    calories,
    protein: Math.round(weight * 1.6), // 1.6g per kg body weight
    carbs: Math.round(calories * 0.45 / 4), // 45% of calories from carbs
    fat: Math.round(calories * 0.25 / 9), // 25% of calories from fat
    water: 2000, // 2L default
  };
};

export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const getTodaysEntries = (entries: FoodEntry[]): FoodEntry[] => {
  const today = formatDate(new Date());
  return entries.filter(entry => formatDate(new Date(entry.timestamp)) === today);
};