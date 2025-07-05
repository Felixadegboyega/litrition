export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
}

export interface FoodItem {
  id: string;
  name: string;
  brand?: string;
  servingSize: string;
  servingUnit: string;
  nutrition: NutritionInfo;
  barcode?: string;
  image?: string;
  category: string;
}

export interface FoodEntry {
  id: string;
  foodId: string;
  foodName: string;
  servings: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  timestamp: Date;
  nutrition: NutritionInfo;
}

export interface DailyGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  water: number;
}

export interface UserProfile {
  name: string;
  age: number;
  height: number;
  weight: number;
  activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active';
  goals: DailyGoals;
  reminderTimes: string[];
}

export interface MealPlan {
  id: string;
  date: Date;
  meals: {
    breakfast: FoodItem[];
    lunch: FoodItem[];
    dinner: FoodItem[];
    snacks: FoodItem[];
  };
}