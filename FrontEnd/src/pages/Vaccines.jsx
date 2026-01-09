/**
 * VACCINES PAGE COMPONENT
 * =======================
 * Displays vaccine tracker with status tracking
 * Shows completed, pending, and upcoming vaccines
 * Fully modular with reusable sub-components
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import VaccinesHeader from '../components/VaccinesHeader';
import VaccineCard from '../components/VaccineCard';
import KhopCard from '../components/KhopCard';
import BottomNavigation from '../components/BottomNavigation';
import NotificationService from '../services/NotificationService';
import { getAllVaccines, getUserVaccineReminders, createVaccineReminder, updateVaccineReminderStatus, getCurrentUser, getBabies } from '../api';
import { getNextDoseDate, isVaccineDueWithin, generateAutomaticVaccineReminders } from '../utils/vaccineSchedule';
import '../styles/Vaccines.css';

export default function Vaccines() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [allVaccines, setAllVaccines] = useState([]);
  const [userReminders, setUserReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [autoSetupDone, setAutoSetupDone] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showKhopCard, setShowKhopCard] = useState(false);
  const [babies, setBabies] = useState([]);
  const [selectedBaby, setSelectedBaby] = useState(null);
  
  // Fetch all available vaccines and user reminders on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vaccinesData, remindersData, user, babiesData] = await Promise.all([
          getAllVaccines(),
          getUserVaccineReminders().catch(() => []),
          getCurrentUser().catch(() => null),
          getBabies().catch(() => [])
        ]);
        
        setAllVaccines(vaccinesData || []);
        setCurrentUser(user);
        setBabies(babiesData || []);
        
        // Set selected baby to the first active baby
        if (babiesData && babiesData.length > 0) {
          const activeBaby = babiesData.find(b => b.is_active) || babiesData[0];
          setSelectedBaby(activeBaby);
        }

        // Check if auto-setup was done for this user using localStorage
        const autoSetupKey = `vaccine_auto_setup_${user?.id}`;
        const autoSetupDone = localStorage.getItem(autoSetupKey);
        
        // Only auto-create reminders if not done before
        if (!autoSetupDone) {
          const babyDOB = babiesData && babiesData.length > 0 ? babiesData[0].date_of_birth : null;
          if (babyDOB && vaccinesData && vaccinesData.length > 0) {
            await autoCreateAllVaccineReminders(vaccinesData, remindersData || [], babyDOB);
            // Mark auto-setup as done for this user
            localStorage.setItem(autoSetupKey, 'true');
          } else {
            setUserReminders(remindersData || []);
          }
        } else {
          // If already done, just use the fetched reminders
          setUserReminders(remindersData || []);
        }
      } catch (error) {
        console.error('Error fetching vaccine data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to check if vaccine is due within 7 days
  const isDueWithinWeek = (dateString) => {
    const today = new Date();
    const dueDate = new Date(dateString);
    const daysRemaining = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
    return daysRemaining > 0 && daysRemaining <= 7;
  };

  // Auto-create reminders for vaccines that don't have them yet
  const autoCreateAllVaccineReminders = async (vaccines, existingReminders, babyBirthDate) => {
    try {
      if (!babyBirthDate) {
        console.log('No baby birth date available for auto-setup');
        setUserReminders(existingReminders);
        return;
      }

      // Find vaccines that don't have any reminders yet
      const vaccinesWithReminders = new Set(existingReminders.map(r => r.vaccine_name));
      const vaccinesNeedingReminders = vaccines.filter(v => !vaccinesWithReminders.has(v.name));

      if (vaccinesNeedingReminders.length === 0) {
        console.log('All vaccines already have reminders');
        setUserReminders(existingReminders);
        return;
      }

      console.log(`Auto-creating reminders for ${vaccinesNeedingReminders.length} vaccines...`);

      // Create reminders for each vaccine without reminders
      const createdReminders = [];
      for (const vaccine of vaccinesNeedingReminders) {
        try {
          // Generate reminder data for all doses
          const reminderDataList = generateAutomaticVaccineReminders(
            [vaccine],
            babyBirthDate,
            'baby'
          );

          // Create all doses for this vaccine
          for (const reminderData of reminderDataList) {
            const created = await createVaccineReminder(reminderData);
            createdReminders.push(created);
          }
        } catch (error) {
          console.error(`Error creating reminder for ${vaccine.name}:`, error);
        }
      }

      // Update state with all reminders (existing + newly created)
      const allReminders = [...existingReminders, ...createdReminders];
      setUserReminders(allReminders);

      // Show success notification
      if (createdReminders.length > 0 && Notification.permission === 'granted') {
        NotificationService.sendNotification(
          'Vaccine Reminders Created! 🎉',
          {
            body: `${createdReminders.length} vaccine reminders auto-created.`,
            tag: 'vaccine-auto-setup',
          }
        );
      }

      setAutoSetupDone(true);
    } catch (error) {
      console.error('Error in auto-create vaccine reminders:', error);
      setUserReminders(existingReminders);
    }
  };

  // Get display vaccines: scheduled reminders + available vaccines with no reminders
  const getDisplayVaccines = () => {
    // Deduplicate userReminders by vaccine_name + dose_number combination
    // Keep the most recent version if duplicates exist
    const reminderMap = new Map();
    userReminders.forEach(reminder => {
      const key = `${reminder.vaccine_name}|${reminder.dose_number || 1}`;
      
      // If key doesn't exist, or new reminder is more recent, update it
      if (!reminderMap.has(key)) {
        reminderMap.set(key, reminder);
      } else {
        const existing = reminderMap.get(key);
        // Compare by updatedAt or id to keep the most recent
        const existingTime = existing.updatedAt ? new Date(existing.updatedAt).getTime() : existing.id;
        const newTime = reminder.updatedAt ? new Date(reminder.updatedAt).getTime() : reminder.id;
        
        if (newTime > existingTime) {
          reminderMap.set(key, reminder);
        }
      }
    });

    const uniqueReminders = Array.from(reminderMap.values());

    // Track vaccines already scheduled
    const vaccinesWithReminders = new Set(uniqueReminders.map(r => r.vaccine_name));

    // Build display list starting with reminders
    const displayVaccines = [...uniqueReminders];

    // Add available vaccines that have no reminders yet
    allVaccines.forEach(vaccine => {
      if (!vaccinesWithReminders.has(vaccine.name)) {
        displayVaccines.push({
          id: `available-${vaccine.id || vaccine.name}`,
          vaccine_name: vaccine.name,
          vaccine_icon: vaccine.emoji,
          description: vaccine.description,
          reminder_date: '',
          status: 'available',
          recipient: vaccine.recipient_type === 'baby' ? 'baby' : 'mother',
          recipient_type: vaccine.recipient_type,
          total_doses: vaccine.total_doses,
          dose_number: 0,
          recommended: vaccine.recommended,
        });
      }
    });

    return displayVaccines;
  };

  // Filter vaccines based on active tab
  const getFilteredVaccines = () => {
    const displayVaccines = getDisplayVaccines();
    
    // Show only completed vaccines
    if (activeTab === 'completed') {
      return displayVaccines.filter(v => v.status === 'completed');
    }
    
    // Hide completed vaccines from other tabs
    const nonCompletedVaccines = displayVaccines.filter(v => v.status !== 'completed');
    
    if (activeTab === 'mother') {
      return nonCompletedVaccines.filter(v => 
        (v.recipient_type === 'mother' || v.recipient_type === 'both') ||
        (v.recipient === 'mother')
      );
    } else if (activeTab === 'baby') {
      return nonCompletedVaccines.filter(v => 
        (v.recipient_type === 'baby' || v.recipient_type === 'both') ||
        (v.recipient === 'baby')
      );
    }
    return nonCompletedVaccines;
  };

  const filteredVaccines = getFilteredVaccines();

  // Vaccine statistics for header cards (aligned with displayed data)
  const displayVaccines = getDisplayVaccines();
  const stats = {
    completed: displayVaccines.filter(v => v.status === 'completed').length,
    pending: displayVaccines.filter(v => v.status !== 'completed').length,
    overdue: displayVaccines.filter(v => v.status === 'overdue').length,
  };

  const handleMarkDone = async (id) => {
    try {
      const vaccineToMark = userReminders.find(v => v.id === id);
      if (!vaccineToMark) return;

      // Step 1: Mark current dose as completed on backend
      await updateVaccineReminderStatus(id, {
        status: 'completed',
        last_dose_date: new Date().toISOString(),
      });

      // Step 2: Update local state - mark current dose as completed
      const updatedReminders = userReminders.map(v => 
        v.id === id ? { ...v, status: 'completed' } : v
      );

      // Send notification when vaccine is completed
      if (Notification.permission === 'granted') {
        NotificationService.sendNotification(
          `✓ ${vaccineToMark.vaccine_name} Completed`,
          {
            body: `Great! You've completed the ${vaccineToMark.vaccine_name} vaccine.`,
            tag: `vaccine-completed-${id}`,
            icon: '✓'
          }
        );
      }

      // Step 3: Check if next dose needs to be created
      const currentDose = vaccineToMark.dose_number || 1;
      const totalDoses = vaccineToMark.total_doses || 1;

      if (currentDose < totalDoses) {
        // Check if next dose already exists
        const nextDoseExists = updatedReminders.some(
          r => r.vaccine_name === vaccineToMark.vaccine_name && 
               r.dose_number === currentDose + 1
        );

        if (!nextDoseExists) {
          // Calculate next dose date
          const nextDoseDate = getNextDoseDate(
            vaccineToMark.vaccine_name,
            currentDose,
            new Date().toISOString()
          );

          if (nextDoseDate) {
            // Create next dose reminder
            const nextDoseReminder = {
              vaccine_name: vaccineToMark.vaccine_name,
              reminder_date: nextDoseDate.toISOString(),
              dose_number: currentDose + 1,
              total_doses: totalDoses,
              recipient: vaccineToMark.recipient,
              age_due_months: 0,
              description: vaccineToMark.description,
              vaccine_icon: vaccineToMark.vaccine_icon,
            };

            const newReminder = await createVaccineReminder(nextDoseReminder);
            updatedReminders.push(newReminder);

            // Notify about next dose
            if (Notification.permission === 'granted') {
              NotificationService.sendNotification(
                `${vaccineToMark.vaccine_name} - Dose ${currentDose + 1} Scheduled`,
                {
                  body: `Next dose scheduled for ${nextDoseDate.toDateString()}`,
                  tag: `vaccine-next-dose-${vaccineToMark.vaccine_name}-${currentDose + 1}`,
                }
              );
            }
          }
        }
      }

      // Step 4: Update state ONCE with all changes
      setUserReminders(updatedReminders);
    } catch (error) {
      console.error('Error marking vaccine as done:', error);
    }
  };

  if (loading) {
    return (
      <div className="vaccines-container">
        <VaccinesHeader onBack={() => navigate('/home')} />
        <div className="vaccines-main" style={{ textAlign: 'center', padding: '20px' }}>
          <p>Loading vaccines...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="vaccines-container">
      {/* Khop Card Modal */}
      <KhopCard 
        isOpen={showKhopCard}
        onClose={() => setShowKhopCard(false)}
        babyName={selectedBaby?.name || 'Baby'}
        babyDOB={selectedBaby?.date_of_birth}
        completedVaccines={userReminders.filter(v => v.status === 'completed')}
      />

      {/* Vaccines Header */}
      <VaccinesHeader 
        onBack={() => navigate('/home')}
        onKhopCard={() => setShowKhopCard(true)}
      />

      {/* Main Content */}
      <div className="vaccines-main">
        
        {/* Vaccination Stats */}
        <div className="vaccine-stats">
          <div className="vaccine-stat-card">
            <p className="vaccine-stat-number">✓</p>
            <p className="vaccine-stat-label">{stats.completed} Completed</p>
          </div>
          <div className="vaccine-stat-card">
            <p className="vaccine-stat-number">⏱</p>
            <p className="vaccine-stat-label">{stats.pending} Pending</p>
          </div>
          <div className="vaccine-stat-card">
            <p className="vaccine-stat-number">{stats.overdue}</p>
            <p className="vaccine-stat-label">Overdue</p>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="vaccine-tabs">
          <button 
            className={`vaccine-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Vaccines
          </button>
          <button 
            className={`vaccine-tab-btn ${activeTab === 'mother' ? 'active' : ''}`}
            onClick={() => setActiveTab('mother')}
          >
            Mother
          </button>
<button 
            className={`vaccine-tab-btn ${activeTab === 'baby' ? 'active' : ''}`}
            onClick={() => setActiveTab('baby')}
          >
            Baby
          </button>
          <button 
            className={`vaccine-tab-btn ${activeTab === 'completed' ? 'active' : ''}`}
            onClick={() => setActiveTab('completed')}
          >
            ✓ Completed
          </button>
        </div>

        {/* Vaccines List */}
        <div className="vaccine-cards-list">
          {filteredVaccines.length > 0 ? (
            filteredVaccines.map((vaccine) => {
              // Find the original vaccine data to get 'recommended' status
              const originalVaccine = allVaccines.find(v => v.name === vaccine.vaccine_name);
              
              return (
                <VaccineCard
                  key={`reminder-${vaccine.id}`}
                  id={vaccine.id}
                  name={vaccine.vaccine_name}
                  emoji={vaccine.vaccine_icon || '💉'}
                  description={vaccine.description}
                  dueDate={vaccine.reminder_date}
                  status={vaccine.status}
                  forPerson={vaccine.recipient === 'baby' ? 'Baby' : 'Mother'}
                  details={vaccine.total_doses ? `${vaccine.dose_number || 1} of ${vaccine.total_doses}` : 'Single dose'}
                  isDueWithinWeek={isDueWithinWeek(vaccine.reminder_date)}
                  recommended={originalVaccine?.recommended || false}
                  onMarkDone={() => handleMarkDone(vaccine.id)}
                />
              );
            })
          ) : (
            <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
              <p>No vaccines found</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="Vaccines" />
    </div>
  );
}
