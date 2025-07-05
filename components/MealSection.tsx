import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FoodEntry } from '@/types/food';
import { Plus } from 'lucide-react-native';
import '../global.css';
import AppText from './AppText';

interface MealSectionProps {
  title: string;
  entries: FoodEntry[];
  onAddFood: () => void;
}

export function MealSection({ title, entries, onAddFood }: MealSectionProps) {
  const totalCalories = entries.reduce(
    (sum, entry) => sum + entry.nutrition.calories,
    0
  );

  return (
    <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-4">
      <View className="flex-row justify-between items-center mb-4">
        <AppText className="text-lg font-inter-bold text-gray-800">
          {title}
        </AppText>
        <View className="flex-row items-center">
          <AppText className="text-sm text-gray-600 font-inter mr-3">
            {Math.round(totalCalories)} cal
          </AppText>
          <TouchableOpacity
            onPress={onAddFood}
            className="bg-primary-50 rounded-full p-2"
          >
            <Plus color="#22c55e" size={16} />
          </TouchableOpacity>
        </View>
      </View>

      {entries.length === 0 ? (
        <TouchableOpacity
          onPress={onAddFood}
          className="border-2 border-dashed border-gray-300 rounded-xl p-6 items-center"
        >
          <Plus color="#9ca3af" size={24} />
          <AppText className="text-gray-500 font-inter mt-2">Add food</AppText>
        </TouchableOpacity>
      ) : (
        <View>
          {entries.map((entry) => (
            <View
              key={entry.id}
              className="flex-row justify-between items-center py-2"
            >
              <View className="flex-1">
                <AppText className="text-gray-800 font-inter-medium">
                  {entry.foodName}
                </AppText>
                <AppText className="text-gray-500 text-sm font-inter">
                  {entry.servings} serving{entry.servings !== 1 ? 's' : ''}
                </AppText>
              </View>
              <AppText className="text-gray-600 font-inter">
                {Math.round(entry.nutrition.calories)} cal
              </AppText>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
