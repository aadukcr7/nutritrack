/**
 * STAGE SELECTION PAGE
 * --------------------
 * Entry screen shown before login/signup to capture the user's life stage.
 * Buttons write the selection to localStorage and send users to signup,
 * with a footer link for those who already have an account.
 */

import { useNavigate } from 'react-router-dom';
import '../styles/StageSelect.css';

const stageOptions = [
  {
    key: 'pregnant',
    title: "I'm Pregnant",
    description: 'Track milestones, reminders, and prenatal care.',
    icon: '🤰'
  },
  
  {
    key: 'newParent',
    title: "I'm a New Parent",
    description: 'Stay ahead on vaccines, growth, and daily care.',
    icon: '🍼'
  }
];

export default function StageSelect() {
  const navigate = useNavigate();

  const handleSelect = (stageKey) => {
    localStorage.setItem('selectedStage', stageKey);
    navigate('/signup', { state: { stage: stageKey } });
  };

  const goToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="stage-page">
      <div className="stage-hero" aria-hidden>
        <span className="bubble bubble-1" />
        <span className="bubble bubble-2" />
        <span className="bubble bubble-3" />
        <span className="heart heart-1">❤</span>
        <span className="heart heart-2">❤</span>
        <span className="heart heart-3">❤</span>
      </div>

      <div className="stage-content">
        <div className="brand-mark">💜</div>
        <h1 className="stage-title">Welcome!</h1>
        <p className="stage-subtitle">Choose your stage so we can personalize your app experience.</p>

        <div className="stage-cards">
          {stageOptions.map((option) => (
            <button
              key={option.key}
              className="stage-card"
              type="button"
              onClick={() => handleSelect(option.key)}
            >
              <span className="card-icon" aria-hidden>{option.icon}</span>
              <div className="card-text">
                <span className="card-title">{option.title}</span>
                <span className="card-desc">{option.description}</span>
              </div>
            </button>
          ))}
        </div>

        <button className="login-link" type="button" onClick={goToLogin}>
          LOG IN
        </button>
      </div>
    </div>
  );
}
