/**
 * REMINDER CARD COMPONENT
 * =======================
 * Displays health reminders in a clean card layout
 * Shows reminders with icons and timestamps
 */

export default function ReminderCard({ reminders = [] }) {
  // Only show actual reminders, no defaults
  const displayReminders = reminders;

  return (
    <div className="reminders-section">
      <div className="section-header">
        <h2>Today's Reminders</h2>
        <span className="reminder-badge">{displayReminders.length}</span>
      </div>

      <div className="reminders-list">
        {displayReminders.length > 0 ? (
          displayReminders.map((reminder) => (
            <div key={reminder.id} className="reminder-item">
              <div className="reminder-icon">{reminder.icon}</div>
              <div className="reminder-content">
                <h3>{reminder.title}</h3>
                <p>{reminder.formattedDate || reminder.description}</p>
              </div>
              <div className="reminder-action">
                🔔
              </div>
            </div>
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
            <p>No reminders for today</p>
          </div>
        )}
      </div>
    </div>
  );
}
