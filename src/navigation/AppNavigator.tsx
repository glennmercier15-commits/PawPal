import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { usePetStore } from '../store/usePetStore';
import { SplashScreen } from '../screens/SplashScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { PetSelectScreen } from '../screens/PetSelectScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { CareScreen } from '../screens/CareScreen';
import { ShopScreen } from '../screens/ShopScreen';
import { DiaryScreen } from '../screens/DiaryScreen';
import { ParentDashboard } from '../screens/ParentDashboard';
import { MiniGameScreen } from '../screens/MiniGameScreen';
import { AchievementsScreen } from '../screens/AchievementsScreen';
import { BedtimeScreen } from '../screens/BedtimeScreen';
import { StoryReaderScreen } from '../screens/StoryReaderScreen';
import { StorySetupScreen } from '../screens/StorySetupScreen';
import { ChatScreen } from '../screens/ChatScreen';
import { ThemeProvider, useTheme } from '../theme/ThemeContext';
import SparkleBackground from '../components/SparkleBackground';

const BottomTabBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, isDark } = useTheme();

  const tabs = [
    { 
      id: 'home', path: '/home', icon: '🏠', label: 'Home',
      color: '#FF9ECA', bgActive: isDark ? '#4A1060' : '#FFD6EC'
    },
    { 
      id: 'care', path: '/care', icon: '🛁', label: 'Care',
      color: '#80DEEA', bgActive: isDark ? '#1C4A5A' : '#D4F5F9'
    },
    { 
      id: 'games', path: '/games', icon: '🎮', label: 'Games',
      color: '#FFC107', bgActive: isDark ? '#6B5B10' : '#FFF5CC'
    },
    { 
      id: 'shop', path: '/shop', icon: '🛍️', label: 'Shop',
      color: '#B388FF', bgActive: isDark ? '#3D2A60' : '#EDE7F6'
    },
    { 
      id: 'diary', path: '/diary', icon: '📓', label: 'Diary',
      color: '#FF9ECA', bgActive: isDark ? '#4A1060' : '#FFE4F0'
    },
  ];

  return (
    <div className="fixed bottom-0 w-full max-w-md left-1/2 transform -translate-x-1/2 pb-safe px-4 my-3 z-50">
      <div 
        className="rounded-[28px] px-3 py-3 flex justify-between items-center relative overflow-hidden transition-colors duration-300"
        style={{
          backgroundColor: theme.card,
          boxShadow: isDark ? '0px 6px 14px rgba(0, 0, 0, 0.4)' : '0px 6px 14px rgba(192, 96, 144, 0.15)',
        }}
      >
        {tabs.map((tab) => {
          const isActive = location.pathname.includes(tab.path);
          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.path)}
              className="relative flex items-center justify-center p-2 rounded-2xl transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]"
              style={{
                backgroundColor: isActive ? tab.bgActive : 'transparent',
                width: isActive ? 'auto' : '52px',
                paddingRight: isActive ? '16px' : '8px',
                paddingLeft: isActive ? '12px' : '8px',
              }}
            >
              <div className="text-[22px] flex items-center justify-center w-8 h-8 opacity-100 flex-shrink-0">
                <span className={`transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-50 grayscale'}`} style={{ filter: isActive ? 'none' : 'grayscale(100%) opacity(50%)' }}>
                  {tab.icon}
                </span>
              </div>
              <div 
                className="overflow-hidden whitespace-nowrap transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]"
                style={{
                  width: isActive ? 'auto' : '0px',
                  opacity: isActive ? 1 : 0,
                  marginLeft: isActive ? '4px' : '0px',
                }}
              >
                <span 
                  className="font-bold text-[14px]"
                  style={{ color: tab.color }}
                >
                  {tab.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  const petType = usePetStore(state => state.petType);
  const { theme } = useTheme();
  
  if (!petType) {
    return <Navigate to="/select" replace />;
  }
  
  return (
    <div className="h-full w-full relative pb-24 min-h-screen transition-colors duration-300" style={{ backgroundColor: theme.background }}>
      <SparkleBackground count={12} />
      {children}
      <BottomTabBar />
    </div>
  );
};

export const AppNavigator = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SplashScreen />} />
          <Route path="/onboarding" element={<OnboardingScreen />} />
          <Route path="/select" element={<PetSelectScreen />} />
          
          {/* Protected Routes */}
          <Route path="/home" element={<ProtectedLayout><HomeScreen /></ProtectedLayout>} />
          <Route path="/care" element={<ProtectedLayout><CareScreen /></ProtectedLayout>} />
          <Route path="/games" element={<ProtectedLayout><MiniGameScreen /></ProtectedLayout>} />
          <Route path="/shop" element={<ProtectedLayout><ShopScreen /></ProtectedLayout>} />
          <Route path="/diary" element={<ProtectedLayout><DiaryScreen /></ProtectedLayout>} />
          <Route path="/achievements" element={<ProtectedLayout><AchievementsScreen /></ProtectedLayout>} />
          <Route path="/parent" element={<ProtectedLayout><ParentDashboard /></ProtectedLayout>} />
          <Route path="/chat" element={<ProtectedLayout><ChatScreen /></ProtectedLayout>} />
          <Route path="/story" element={<ProtectedLayout><StorySetupScreen /></ProtectedLayout>} />
          <Route path="/story-reader" element={<ProtectedLayout><StoryReaderScreen /></ProtectedLayout>} />
          <Route path="/bedtime" element={<BedtimeScreen />} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};
