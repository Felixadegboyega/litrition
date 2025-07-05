import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  User,
  Target,
  Bell,
  Download,
  Upload,
  Info,
} from 'lucide-react-native';
import { UserProfile } from '@/types/food';
import { storage } from '@/utils/storage';
import { getDefaultGoals } from '@/utils/nutrition';
import '../../global.css';
import AppText from '@/components/AppText';

export default function SettingsScreen() {
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    age: 25,
    height: 170,
    weight: 70,
    activityLevel: 'moderately_active',
    goals: {
      calories: 2000,
      protein: 150,
      carbs: 250,
      fat: 65,
      water: 2000,
    },
    reminderTimes: ['08:00', '12:00', '18:00'],
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const savedProfile = await storage.getUserProfile();
    if (savedProfile) {
      setProfile(savedProfile);
    }
  };

  const saveProfile = async () => {
    const updatedGoals = getDefaultGoals(
      profile.weight,
      profile.height,
      profile.age,
      profile.activityLevel
    );

    const updatedProfile = {
      ...profile,
      goals: updatedGoals,
    };

    await storage.saveUserProfile(updatedProfile);
    setProfile(updatedProfile);
    Alert.alert('Success', 'Profile saved successfully!');
  };

  const SettingCard = ({ icon, title, children }: any) => (
    <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-4">
      <View className="flex-row items-center mb-4">
        {icon}
        <AppText className="text-lg font-inter-bold text-gray-800 ml-3">
          {title}
        </AppText>
      </View>
      {children}
    </View>
  );

  const InputField = ({
    label,
    value,
    onChangeText,
    keyboardType = 'default',
  }: any) => (
    <View className="mb-4">
      <AppText className="text-gray-700 font-inter-medium mb-2">
        {label}
      </AppText>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        className="border border-gray-300 rounded-lg px-4 py-3 font-inter text-gray-800"
      />
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-6 py-4 bg-white border-b border-gray-200">
        <AppText className="text-2xl font-inter-bold text-gray-800">
          Settings
        </AppText>
        <AppText className="text-gray-600 font-inter">
          Customize your nutrition tracking
        </AppText>
      </View>

      <ScrollView className="flex-1 px-6 py-6">
        <SettingCard icon={<User color="#22c55e" size={24} />} title="Profile">
          <InputField
            label="Name"
            value={profile.name}
            onChangeText={(text: string) =>
              setProfile({ ...profile, name: text })
            }
          />
          <InputField
            label="Age"
            value={profile.age.toString()}
            onChangeText={(text: string) =>
              setProfile({ ...profile, age: parseInt(text) || 0 })
            }
            keyboardType="numeric"
          />
          <InputField
            label="Height (cm)"
            value={profile.height.toString()}
            onChangeText={(text: string) =>
              setProfile({ ...profile, height: parseInt(text) || 0 })
            }
            keyboardType="numeric"
          />
          <InputField
            label="Weight (kg)"
            value={profile.weight.toString()}
            onChangeText={(text: string) =>
              setProfile({ ...profile, weight: parseInt(text) || 0 })
            }
            keyboardType="numeric"
          />

          <AppText className="text-gray-700 font-inter-medium mb-2">
            Activity Level
          </AppText>
          <View className="space-y-2">
            {[
              { key: 'sedentary', label: 'Sedentary (little/no exercise)' },
              {
                key: 'lightly_active',
                label: 'Lightly Active (light exercise)',
              },
              {
                key: 'moderately_active',
                label: 'Moderately Active (moderate exercise)',
              },
              { key: 'very_active', label: 'Very Active (hard exercise)' },
            ].map((activity) => (
              <TouchableOpacity
                key={activity.key}
                onPress={() =>
                  setProfile({ ...profile, activityLevel: activity.key as any })
                }
                className={`p-3 rounded-lg border ${
                  profile.activityLevel === activity.key
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-300'
                }`}
              >
                <Text
                  className={`font-inter ${
                    profile.activityLevel === activity.key
                      ? 'text-primary-700'
                      : 'text-gray-700'
                  }`}
                >
                  {activity.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </SettingCard>

        <SettingCard
          icon={<Target color="#3b82f6" size={24} />}
          title="Daily Goals"
        >
          <View className="space-y-3">
            <View className="flex-row justify-between items-center">
              <AppText className="text-gray-700 font-inter">Calories</AppText>
              <AppText className="font-inter-bold text-gray-800">
                {profile.goals.calories}
              </AppText>
            </View>
            <View className="flex-row justify-between items-center">
              <AppText className="text-gray-700 font-inter">Protein</AppText>
              <AppText className="font-inter-bold text-gray-800">
                {profile.goals.protein}g
              </AppText>
            </View>
            <View className="flex-row justify-between items-center">
              <AppText className="text-gray-700 font-inter">Carbs</AppText>
              <AppText className="font-inter-bold text-gray-800">
                {profile.goals.carbs}g
              </AppText>
            </View>
            <View className="flex-row justify-between items-center">
              <AppText className="text-gray-700 font-inter">Fat</AppText>
              <AppText className="font-inter-bold text-gray-800">
                {profile.goals.fat}g
              </AppText>
            </View>
          </View>
          <AppText className="text-gray-500 font-inter text-sm mt-3">
            Goals are calculated based on your profile
          </AppText>
        </SettingCard>

        <SettingCard
          icon={<Bell color="#f59e0b" size={24} />}
          title="Reminders"
        >
          <AppText className="text-gray-600 font-inter mb-3">
            Get notified to log your meals
          </AppText>
          <View className="space-y-2">
            {profile.reminderTimes.map((time, index) => (
              <View
                key={index}
                className="flex-row justify-between items-center p-3 bg-gray-50 rounded-lg"
              >
                <AppText className="font-inter text-gray-700">{time}</AppText>
                <TouchableOpacity className="text-primary-600">
                  <AppText className="text-primary-600 font-inter">
                    Edit
                  </AppText>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </SettingCard>

        <View className="flex-row space-x-4 mb-6">
          <TouchableOpacity className="flex-1 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 items-center">
            <Download color="#6b7280" size={24} />
            <AppText className="text-gray-700 font-inter-medium mt-2">
              Export Data
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 items-center">
            <Upload color="#6b7280" size={24} />
            <AppText className="text-gray-700 font-inter-medium mt-2">
              Import Data
            </AppText>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={saveProfile}
          className="bg-primary-600 rounded-2xl p-4 items-center mb-6"
        >
          <AppText className="text-white font-inter-bold text-lg">
            Save Profile
          </AppText>
        </TouchableOpacity>

        <View className="bg-primary-50 rounded-2xl p-6">
          <View className="flex-row items-center mb-3">
            <Info color="#22c55e" size={20} />
            <AppText className="text-primary-800 font-inter-bold ml-2">
              About
            </AppText>
          </View>
          <AppText className="text-primary-700 font-inter">
            NutriTracker v1.0.0 - Your personal nutrition companion
          </AppText>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
