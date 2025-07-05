import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar, Target, TrendingUp } from 'lucide-react-native';
import { NutritionCard } from '@/components/NutritionCard';
import { MealSection } from '@/components/MealSection';
import { WaterTracker } from '@/components/WaterTracker';
import { FoodEntry, DailyGoals } from '@/types/food';
import { storage } from '@/utils/storage';
import {
  calculateDailyNutrition,
  getTodaysEntries,
  getDefaultGoals,
} from '@/utils/nutrition';
import { router } from 'expo-router';
import '../../global.css';
import AppText from '@/components/AppText';

export default function HomeScreen() {
  const [entries, setEntries] = useState<FoodEntry[]>([]);
  const [goals, setGoals] = useState<DailyGoals>({
    calories: 2000,
    protein: 150,
    carbs: 250,
    fat: 65,
    water: 2000,
  });
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const allEntries = await storage.getFoodEntries();
    const todaysEntries = getTodaysEntries(allEntries);
    setEntries(todaysEntries);

    const profile = await storage.getUserProfile();
    if (profile) {
      setGoals(profile.goals);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const todaysNutrition = calculateDailyNutrition(entries);

  const mealEntries = {
    breakfast: entries.filter((e) => e.mealType === 'breakfast'),
    lunch: entries.filter((e) => e.mealType === 'lunch'),
    dinner: entries.filter((e) => e.mealType === 'dinner'),
    snack: entries.filter((e) => e.mealType === 'snack'),
  };

  const handleAddFood = (mealType: string) => {
    router.push({
      pathname: '/log',
      params: { mealType },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <LinearGradient colors={['#22c55e', '#16a34a']}>
        <View className="flex-row px-6 pt-8 justify-between items-center mb-6">
          <View>
            <AppText className="text-white text-2xl font-inter-bold">
              Good Morning!
            </AppText>
            <AppText className="text-green-100 font-inter">
              Ready to track your nutrition?
            </AppText>
          </View>
          <TouchableOpacity className="bg-white/20 rounded-full p-3">
            <Calendar color="#ffffff" size={24} />
          </TouchableOpacity>
        </View>

        <View className="px-6">
          <View className="bg-white/20 rounded-2xl py-4 mb-10">
            <View className="flex-row justify-between items-center px-6">
              <View>
                <AppText className="text-white font-inter-medium">
                  Today's Calories
                </AppText>
                <AppText className="text-white text-2xl font-inter-bold">
                  {Math.round(todaysNutrition.calories)}
                </AppText>
              </View>
              <View className="items-end">
                <AppText className="text-green-100 font-inter">
                  Goal: {goals.calories}
                </AppText>
                <AppText className="text-white font-inter-medium">
                  {Math.round(
                    (todaysNutrition.calories / goals.calories) * 100
                  )}
                  %
                </AppText>
              </View>
            </View>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        className="flex-1 px-6 -mt-6"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="mb-6">
          <NutritionCard nutrition={todaysNutrition} goals={goals} />
        </View>

        <View className="mb-6">
          <WaterTracker />
        </View>

        <MealSection
          title="Breakfast"
          entries={mealEntries.breakfast}
          onAddFood={() => handleAddFood('breakfast')}
        />

        <MealSection
          title="Lunch"
          entries={mealEntries.lunch}
          onAddFood={() => handleAddFood('lunch')}
        />

        <MealSection
          title="Dinner"
          entries={mealEntries.dinner}
          onAddFood={() => handleAddFood('dinner')}
        />

        <MealSection
          title="Snacks"
          entries={mealEntries.snack}
          onAddFood={() => handleAddFood('snack')}
        />

        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}
