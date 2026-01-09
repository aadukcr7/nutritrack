/**
 * VACCINES HEADER COMPONENT
 * =========================
 * Reusable header for vaccines page
 * Displays title, subtitle with back button and khop card button
 */

export default function VaccinesHeader({ onBack = () => {}, onKhopCard = () => {} }) {
  return (
    <div className="vaccines-header">
      <button className="vaccines-header-back" onClick={onBack}>
        ←
      </button>
      <div className="vaccines-header-content">
        <h1>Vaccine Tracker</h1>
        <p>Track vaccination schedule</p>
      </div>
      <button className="vaccines-header-khop" onClick={onKhopCard}>
        खोप कार्ड
      </button>
    </div>
  );
}
