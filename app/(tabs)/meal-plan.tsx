import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, Plus, ChefHat } from 'lucide-react-native';
import { MealPlan } from '@/types/food';
import { storage } from '@/utils/storage';
import '../../global.css';
import AppText from '@/components/AppText';

export default function MealPlanScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);

  useEffect(() => {
    loadMealPlans();
  }, []);

  const loadMealPlans = async () => {
    const plans = await storage.getMealPlans();
    setMealPlans(plans);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getDayPlan = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return mealPlans.find(
      (plan) => plan.date.toString().split('T')[0] === dateStr
    );
  };

  const getWeekDays = () => {
    const days = [];
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const MealPlanCard = ({
    title,
    foods,
    icon,
  }: {
    title: string;
    foods: any[];
    icon: React.ReactNode;
  }) => (
    <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-4">
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center">
          {icon}
          <AppText className="text-lg font-inter-bold text-gray-800 ml-2">
            {title}
          </AppText>
        </View>
        <TouchableOpacity className="bg-primary-50 rounded-full p-2">
          <Plus color="#22c55e" size={16} />
        </TouchableOpacity>
      </View>

      {foods.length === 0 ? (
        <TouchableOpacity className="border-2 border-dashed border-gray-300 rounded-xl p-6 items-center">
          <Plus color="#9ca3af" size={24} />
          <AppText className="text-gray-500 font-inter mt-2">
            Plan your {title.toLowerCase()}
          </AppText>
        </TouchableOpacity>
      ) : (
        <View>
          {foods.map((food, index) => (
            <View
              key={index}
              className="flex-row justify-between items-center py-2"
            >
              <AppText className="text-gray-800 font-inter-medium">
                {food.name}
              </AppText>
              <AppText className="text-gray-600 font-inter">
                {food.nutrition.calories} cal
              </AppText>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  const currentPlan = getDayPlan(selectedDate);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-6 py-4 bg-white border-b border-gray-200">
        <AppText className="text-2xl font-inter-bold text-gray-800 mb-4">
          Meal Plan
        </AppText>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row space-x-3">
            {getWeekDays().map((day, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedDate(day)}
                className={`px-4 py-3 rounded-xl ${
                  day.toDateString() === selectedDate.toDateString()
                    ? 'bg-primary-600'
                    : 'bg-gray-100'
                }`}
              >
                <AppText
                  className={`text-sm font-inter-medium ${
                    day.toDateString() === selectedDate.toDateString()
                      ? 'text-white'
                      : 'text-gray-600'
                  }`}
                >
                  {day.toLocaleDateString('en-US', { weekday: 'short' })}
                </AppText>
                <AppText
                  className={`text-lg font-inter-bold ${
                    day.toDateString() === selectedDate.toDateString()
                      ? 'text-white'
                      : 'text-gray-800'
                  }`}
                >
                  {day.getDate()}
                </AppText>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      <ScrollView className="flex-1 px-6 py-6">
        <View className="mb-6">
          <AppText className="text-lg font-inter-bold text-gray-800 mb-2">
            {formatDate(selectedDate)}
          </AppText>
          <AppText className="text-gray-600 font-inter">
            Plan your meals for the day
          </AppText>
        </View>

        <MealPlanCard
          title="Breakfast"
          foods={currentPlan?.meals.breakfast || []}
          icon={<ChefHat color="#f59e0b" size={20} />}
        />

        <MealPlanCard
          title="Lunch"
          foods={currentPlan?.meals.lunch || []}
          icon={<ChefHat color="#10b981" size={20} />}
        />

        <MealPlanCard
          title="Dinner"
          foods={currentPlan?.meals.dinner || []}
          icon={<ChefHat color="#8b5cf6" size={20} />}
        />

        <MealPlanCard
          title="Snacks"
          foods={currentPlan?.meals.snacks || []}
          icon={<ChefHat color="#f97316" size={20} />}
        />

        <View className="bg-primary-50 rounded-2xl p-6 mt-4">
          <AppText className="text-primary-800 font-inter-bold text-lg mb-2">
            Quick Tips
          </AppText>
          <AppText className="text-primary-700 font-inter">
            • Plan your meals ahead to make better nutrition choices
          </AppText>
          <AppText className="text-primary-700 font-inter">
            • Include a variety of fruits and vegetables
          </AppText>
          <AppText className="text-primary-700 font-inter">
            • Balance your macronutrients throughout the day
          </AppText>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
