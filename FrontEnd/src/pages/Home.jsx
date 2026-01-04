/**
 * HOME PAGE COMPONENT
 * ===================
 * Main dashboard/home page for NutriTrack app
 * Displays greeting, reminders, and daily tips
 * Fully modular with reusable sub-components
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GreetingCard from '../components/GreetingCard';
import ReminderCard from '../components/ReminderCard';
import NotificationCard from '../components/NotificationCard';
import NotificationBanner from '../components/NotificationBanner';
import TipCard from '../components/TipCard';
import BottomNavigation from '../components/BottomNavigation';
import NotificationService from '../services/NotificationService';
import { getReminders, getDailyTip, getCurrentUser, getAuthToken } from '../api';
import '../styles/Home.css';
import '../styles/NotificationCard.css';

export default function Home() {
  const navigate = useNavigate();
  // State for notification permission
  const [notificationPermission, setNotificationPermission] = useState(false);
  const [tip, setTip] = useState("Stay hydrated! Drink at least 8 glasses of water daily.");
  const [tipError, setTipError] = useState(null);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    userName: "Loading...",
    trimester: "Calculating...",
    dueDate: null
  });

  // Vaccine data for notification checking
  const vaccinesData = [
    {
      id: 1,
      name: "Tdap",
      emoji: "💉",
      description: "Tetanus, diphtheria, and pertussis",
      dueDate: "2025-01-05",
      status: "taken",
      forPerson: "Mother",
      details: "Single dose"
    },
    {
      id: 2,
      name: "Flu Shot",
      emoji: "💉",
      description: "Annual influenza vaccine",
      dueDate: "2026-01-04",
      status: "upcoming",
      forPerson: "Mother",
      details: "Yearly"
    },
    {
      id: 3,
      name: "Hepatitis B",
      emoji: "💉",
      description: "First dose at birth",
      dueDate: "2026-01-04",
      status: "taken",
      forPerson: "Baby",
      details: "1 of 3"
    },
    {
      id: 4,
      name: "Hepatitis B",
      emoji: "💉",
      description: "Second dose",
      dueDate: "2026-02-01",
      status: "upcoming",
      forPerson: "Baby",
      details: "2 of 3"
    },
    {
      id: 5,
      name: "DtaP",
      emoji: "💉",
      description: "Diphtheria, tetanus, pertussis",
      dueDate: "2026-02-04",
      status: "upcoming",
      forPerson: "Baby",
      details: "1 of 5"
    },
    {
      id: 6,
      name: "Polio",
      emoji: "💉",
      description: "Poliomyelitis vaccine",
      dueDate: "2026-02-04",
      status: "upcoming",
      forPerson: "Baby",
      details: "1 of 4"
    }
  ];

  // Initialize notification service on component mount
  useEffect(() => {
    const initializeNotifications = async () => {
      const hasPermission = await NotificationService.initialize();
      setNotificationPermission(hasPermission);

      // Get vaccines due within 7 days
      const upcomingVaccines = vaccinesData.filter(vaccine => {
        if (vaccine.status === 'taken') return false;
        return NotificationService.isDueWithinWeek(vaccine.dueDate);
      });

      // Send system notification if there are vaccines due
      if (upcomingVaccines.length > 0 && hasPermission) {
        // Add a small delay to ensure app is ready
        setTimeout(() => {
          NotificationService.sendVaccineReminders(upcomingVaccines);
        }, 1000);
      }
    };

    const fetchData = async () => {
      try {
        // Check if user is logged in
        const token = getAuthToken();
        if (!token) {
          console.log('No authentication token found');
          setUserData({
            userName: "Guest",
            trimester: "Unknown",
            dueDate: null
          });
          setLoading(false);
          return;
        }

        // Fetch current user from backend
        const user = await getCurrentUser();
        console.log('User data fetched:', user);
        
        // Calculate trimester based on due date
        let trimester = "Calculating...";
        if (user.due_date) {
          const now = new Date();
          const dueDate = new Date(user.due_date);
          const weeksPregnant = Math.floor((now - new Date(now.getFullYear() - 0.75, 0, 1)) / (7 * 24 * 60 * 60 * 1000));
          
          if (weeksPregnant < 13) {
            trimester = "Trimester 1";
          } else if (weeksPregnant < 26) {
            trimester = "Trimester 2";
          } else {
            trimester = "Trimester 3";
          }
        }
        
        setUserData({
          userName: user.full_name || "User",
          trimester: trimester,
          dueDate: user.due_date
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
        setUserData({
          userName: "Guest",
          trimester: "Unknown",
          dueDate: null
        });
      }

      try {
        // Fetch reminders from backend
        const remindersData = await getReminders();
        setReminders(remindersData.map(r => ({
          id: r.id,
          title: r.title,
          description: new Date(r.reminder_date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }),
          icon: r.type === 'vaccine' ? '💉' : '📅'
        })));
      } catch (error) {
        console.error('Error fetching reminders:', error);
        // Keep empty array if fetch fails
      }

      try {
        // Fetch daily tip from backend
        const tipData = await getDailyTip();
        setTip(tipData.tip);
      } catch (error) {
        console.error('Error fetching daily tip:', error);
        setTipError(error.message);
      }
      
      setLoading(false);
    };

    initializeNotifications();
    fetchData();
  }, []);

  return (
    <div className="home-container">
      {/* Main Content */}
      <div className="home-content">
        
        {/* Notification Permission Banner */}
        <NotificationBanner 
          onPermissionChange={(granted) => setNotificationPermission(granted)}
        />

        {/* Greeting Section */}
        <GreetingCard 
          userName={userData.userName}
          trimester={userData.trimester}
          dueDate={userData.dueDate}
        />

        {/* Vaccine Notifications - Shows alerts for vaccines due within 7 days */}
        <NotificationCard 
          vaccinesData={vaccinesData}
          onDismiss={() => console.log('Notification dismissed')}
        />

        {/* Reminders Section */}
        <ReminderCard reminders={reminders} />

        {/* Daily Tip Section */}
        <TipCard 
          title="Today's Tip"
          content={tipError ? `Tip unavailable: ${tipError}` : tip}
        />
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="Home" />
    </div>
  );
}
