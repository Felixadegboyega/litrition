import AsyncStorage from '@react-native-async-storage/async-storage';
import { FoodEntry, FoodItem, UserProfile, MealPlan } from '@/types/food';

const KEYS = {
  FOOD_ENTRIES: 'food_entries',
  FOOD_ITEMS: 'food_items',
  USER_PROFILE: 'user_profile',
  MEAL_PLANS: 'meal_plans',
  WATER_INTAKE: 'water_intake',
};

export const storage = {
  // Food Entries
  async getFoodEntries(): Promise<FoodEntry[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.FOOD_ENTRIES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting food entries:', error);
      return [];
    }
  },

  async saveFoodEntry(entry: FoodEntry): Promise<void> {
    try {
      const entries = await this.getFoodEntries();
      entries.push(entry);
      await AsyncStorage.setItem(KEYS.FOOD_ENTRIES, JSON.stringify(entries));
    } catch (error) {
      console.error('Error saving food entry:', error);
    }
  },

  async deleteFoodEntry(id: string): Promise<void> {
    try {
      const entries = await this.getFoodEntries();
      const filtered = entries.filter(entry => entry.id !== id);
      await AsyncStorage.setItem(KEYS.FOOD_ENTRIES, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting food entry:', error);
    }
  },

  // Food Items
  async getFoodItems(): Promise<FoodItem[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.FOOD_ITEMS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting food items:', error);
      return [];
    }
  },

  async saveFoodItem(item: FoodItem): Promise<void> {
    try {
      const items = await this.getFoodItems();
      const existingIndex = items.findIndex(i => i.id === item.id);
      if (existingIndex >= 0) {
        items[existingIndex] = item;
      } else {
        items.push(item);
      }
      await AsyncStorage.setItem(KEYS.FOOD_ITEMS, JSON.stringify(items));
    } catch (error) {
      console.error('Error saving food item:', error);
    }
  },

  // User Profile
  async getUserProfile(): Promise<UserProfile | null> {
    try {
      const data = await AsyncStorage.getItem(KEYS.USER_PROFILE);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  },

  async saveUserProfile(profile: UserProfile): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.USER_PROFILE, JSON.stringify(profile));
    } catch (error) {
      console.error('Error saving user profile:', error);
    }
  },

  // Water Intake
  async getWaterIntake(date: string): Promise<number> {
    try {
      const data = await AsyncStorage.getItem(`${KEYS.WATER_INTAKE}_${date}`);
      return data ? parseInt(data) : 0;
    } catch (error) {
      console.error('Error getting water intake:', error);
      return 0;
    }
  },

  async saveWaterIntake(date: string, amount: number): Promise<void> {
    try {
      await AsyncStorage.setItem(`${KEYS.WATER_INTAKE}_${date}`, amount.toString());
    } catch (error) {
      console.error('Error saving water intake:', error);
    }
  },

  // Meal Plans
  async getMealPlans(): Promise<MealPlan[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.MEAL_PLANS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting meal plans:', error);
      return [];
    }
  },

  async saveMealPlan(plan: MealPlan): Promise<void> {
    try {
      const plans = await this.getMealPlans();
      const existingIndex = plans.findIndex(p => p.id === plan.id);
      if (existingIndex >= 0) {
        plans[existingIndex] = plan;
      } else {
        plans.push(plan);
      }
      await AsyncStorage.setItem(KEYS.MEAL_PLANS, JSON.stringify(plans));
    } catch (error) {
      console.error('Error saving meal plan:', error);
    }
  },
};