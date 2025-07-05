import React from 'react';
import { View, Text } from 'react-native';
import { NutritionInfo, DailyGoals } from '@/types/food';
import '../global.css';
import AppText from './AppText';

interface NutritionCardProps {
  nutrition: NutritionInfo;
  goals: DailyGoals;
}

export function NutritionCard({ nutrition, goals }: NutritionCardProps) {
  const getProgressColor = (current: number, goal: number) => {
    const percentage = (current / goal) * 100;
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  const getProgressWidth = (current: number, goal: number) => {
    return Math.min((current / goal) * 100, 100);
  };

  const MacroItem = ({
    label,
    current,
    goal,
    unit,
  }: {
    label: string;
    current: number;
    goal: number;
    unit: string;
  }) => (
    <View className="mb-4">
      <View className="flex-row justify-between items-center mb-2">
        <AppText className="text-gray-700 font-inter-medium">{label}</AppText>
        <AppText className="text-gray-600 font-inter">
          {Math.round(current)}/{Math.round(goal)}
          {unit}
        </AppText>
      </View>
      <View className="h-2 bg-gray-200 rounded-full">
        <View
          className={`h-full rounded-full ${getProgressColor(current, goal)}`}
          style={{ width: `${getProgressWidth(current, goal)}%` }}
        />
      </View>
    </View>
  );

  return (
    <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <AppText className="text-lg font-inter-bold text-gray-800 mb-6">
        Today's Nutrition
      </AppText>

      <MacroItem
        label="Calories"
        current={nutrition.calories}
        goal={goals.calories}
        unit=" kcal"
      />
      <MacroItem
        label="Protein"
        current={nutrition.protein}
        goal={goals.protein}
        unit="g"
      />
      <MacroItem
        label="Carbs"
        current={nutrition.carbs}
        goal={goals.carbs}
        unit="g"
      />
      <MacroItem
        label="Fat"
        current={nutrition.fat}
        goal={goals.fat}
        unit="g"
      />
    </View>
  );
}
