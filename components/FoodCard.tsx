import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { FoodItem } from '@/types/food';
import '../global.css';
import AppText from './AppText';

interface FoodCardProps {
  food: FoodItem;
  onPress: () => void;
}

export function FoodCard({ food, onPress }: FoodCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-3"
    >
      <View className="flex-row">
        <Image
          source={{ uri: food.image }}
          className="w-16 h-16 rounded-xl mr-4"
          resizeMode="cover"
        />
        <View className="flex-1">
          <AppText className="text-lg font-inter-bold text-gray-800 mb-1">
            {food.name}
          </AppText>
          {food.brand && (
            <AppText className="text-sm text-gray-600 mb-2 font-inter">
              {food.brand}
            </AppText>
          )}
          <View className="flex-row justify-between">
            <AppText className="text-sm text-gray-500 font-inter">
              {food.servingSize} {food.servingUnit}
            </AppText>
            <AppText className="text-sm font-inter-medium text-primary-600">
              {food.nutrition.calories} cal
            </AppText>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
