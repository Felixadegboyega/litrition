import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { Search, QrCode, Plus } from 'lucide-react-native';
import { FoodCard } from '@/components/FoodCard';
import { FoodItem, FoodEntry } from '@/types/food';
import { storage } from '@/utils/storage';
import { sampleFoods } from '@/data/sampleFoods';
import '../../global.css';
import AppText from '@/components/AppText';

export default function LogScreen() {
  const { mealType = 'breakfast' } = useLocalSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [filteredFoods, setFilteredFoods] = useState<FoodItem[]>([]);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [servings, setServings] = useState('1');

  useEffect(() => {
    loadFoods();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = foods.filter(
        (food) =>
          food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          food.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (food.brand &&
            food.brand.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredFoods(filtered);
    } else {
      setFilteredFoods(foods);
    }
  }, [searchQuery, foods]);

  const loadFoods = async () => {
    const storedFoods = await storage.getFoodItems();
    const allFoods = [...sampleFoods, ...storedFoods];
    setFoods(allFoods);
    setFilteredFoods(allFoods);
  };

  const handleFoodSelect = (food: FoodItem) => {
    setSelectedFood(food);
  };

  const handleAddFood = async () => {
    if (!selectedFood) return;

    const servingAmount = parseFloat(servings);
    if (isNaN(servingAmount) || servingAmount <= 0) {
      Alert.alert('Invalid Serving', 'Please enter a valid serving amount.');
      return;
    }

    const entry: FoodEntry = {
      id: Date.now().toString(),
      foodId: selectedFood.id,
      foodName: selectedFood.name,
      servings: servingAmount,
      mealType: mealType as 'breakfast' | 'lunch' | 'dinner' | 'snack',
      timestamp: new Date(),
      nutrition: {
        calories: selectedFood.nutrition.calories * servingAmount,
        protein: selectedFood.nutrition.protein * servingAmount,
        carbs: selectedFood.nutrition.carbs * servingAmount,
        fat: selectedFood.nutrition.fat * servingAmount,
        fiber: selectedFood.nutrition.fiber * servingAmount,
        sugar: selectedFood.nutrition.sugar * servingAmount,
        sodium: selectedFood.nutrition.sodium * servingAmount,
      },
    };

    await storage.saveFoodEntry(entry);

    Alert.alert('Success', 'Food added to your log!', [
      {
        text: 'OK',
        onPress: () => {
          setSelectedFood(null);
          setServings('1');
        },
      },
    ]);
  };

  const mealTypeNames = {
    breakfast: 'Breakfast',
    lunch: 'Lunch',
    dinner: 'Dinner',
    snack: 'Snacks',
  };

  if (selectedFood) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="px-6 py-4 bg-white border-b border-gray-200">
          <TouchableOpacity
            onPress={() => setSelectedFood(null)}
            className="mb-4"
          >
            <AppText className="text-primary-600 font-inter-medium">
              ← Back to search
            </AppText>
          </TouchableOpacity>
          <AppText className="text-2xl font-inter-bold text-gray-800">
            Add to {mealTypeNames[mealType as keyof typeof mealTypeNames]}
          </AppText>
        </View>

        <ScrollView className="flex-1 px-6 py-6">
          <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
            <AppText className="text-xl font-inter-bold text-gray-800 mb-4">
              {selectedFood.name}
            </AppText>

            <View className="flex-row items-center mb-4">
              <AppText className="text-gray-700 font-inter-medium mr-4">
                Servings:
              </AppText>
              <TextInput
                value={servings}
                onChangeText={setServings}
                keyboardType="numeric"
                className="border border-gray-300 rounded-lg px-4 py-2 text-center font-inter w-20"
              />
            </View>

            <View className="border-t border-gray-200 pt-4">
              <AppText className="text-lg font-inter-bold text-gray-800 mb-3">
                Nutrition (per {servings} serving
                {parseFloat(servings) !== 1 ? 's' : ''})
              </AppText>

              <View className="space-y-2">
                <View className="flex-row justify-between">
                  <AppText className="text-gray-600 font-inter">
                    Calories
                  </AppText>
                  <AppText className="font-inter-medium">
                    {Math.round(
                      selectedFood.nutrition.calories *
                        parseFloat(servings || '1')
                    )}
                  </AppText>
                </View>
                <View className="flex-row justify-between">
                  <AppText className="text-gray-600 font-inter">
                    Protein
                  </AppText>
                  <AppText className="font-inter-medium">
                    {Math.round(
                      selectedFood.nutrition.protein *
                        parseFloat(servings || '1')
                    )}
                    g
                  </AppText>
                </View>
                <View className="flex-row justify-between">
                  <AppText className="text-gray-600 font-inter">Carbs</AppText>
                  <AppText className="font-inter-medium">
                    {Math.round(
                      selectedFood.nutrition.carbs * parseFloat(servings || '1')
                    )}
                    g
                  </AppText>
                </View>
                <View className="flex-row justify-between">
                  <AppText className="text-gray-600 font-inter">Fat</AppText>
                  <AppText className="font-inter-medium">
                    {Math.round(
                      selectedFood.nutrition.fat * parseFloat(servings || '1')
                    )}
                    g
                  </AppText>
                </View>
              </View>
            </View>
          </View>

          <TouchableOpacity
            onPress={handleAddFood}
            className="bg-primary-600 rounded-2xl p-4 items-center"
          >
            <AppText className="text-white font-inter-bold text-lg">
              Add to Log
            </AppText>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-6 py-4 bg-white border-b border-gray-200">
        <AppText className="text-2xl font-inter-bold text-gray-800 mb-4">
          Add to {mealTypeNames[mealType as keyof typeof mealTypeNames]}
        </AppText>

        <View className="flex-row space-x-3">
          <View className="flex-1 flex-row items-center bg-gray-100 rounded-xl px-4 py-3">
            <Search color="#6b7280" size={20} />
            <TextInput
              placeholder="Search foods..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="flex-1 ml-3 font-inter text-gray-800"
            />
          </View>
          <TouchableOpacity className="bg-primary-600 rounded-xl p-3">
            <QrCode color="#ffffff" size={20} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 px-6 py-4">
        {filteredFoods.length === 0 ? (
          <View className="flex-1 items-center justify-center py-12">
            <AppText className="text-gray-500 font-inter text-center">
              No foods found. Try a different search term.
            </AppText>
          </View>
        ) : (
          filteredFoods.map((food) => (
            <FoodCard
              key={food.id}
              food={food}
              onPress={() => handleFoodSelect(food)}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
