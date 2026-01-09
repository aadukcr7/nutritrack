import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FeedingHeader from '../components/FeedingHeader';
import BottomNavigation from '../components/BottomNavigation';
import '../styles/Feeding.css';

export default function Feeding() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('schedule');

  // Simplified, realistic feeding data for a ~5 month old
  const feedingData = {
    babyAge: '5 months',
    ageInMonths: 5,
    schedules: [
      {
        id: 1,
        type: 'Breastfeeding (typical)',
        frequency: 'On demand, 8–12 times/day',
        amount: 'Feeds until satisfied; expect 10–20 min per breast',
        notes: [
          'Responsive feeding: watch hunger cues (rooting, sucking)',
          'Cluster feeding in evenings is normal',
          'No need for solids until ~6 months'
        ]
      },
      {
        id: 2,
        type: 'Formula feeding (typical)',
        frequency: 'Every 3–4 hours',
        amount: '4–6 oz per feeding (total ~24–32 oz/day)',
        notes: [
          'Increase amounts gradually based on hunger and weight gain',
          'Hold and pace bottle-feeding to avoid overfeeding',
          'Burp baby between feeds'
        ]
      },
      {
        id: 3,
        type: 'Night feeds',
        frequency: 'May be 0–3 times/night depending on age and weight',
        amount: 'Small feeds as needed (breast or 2–4 oz formula)',
        notes: [
          'Try soothing between feeds to encourage longer sleep periods',
          'If baby gains well, longer stretches at night are normal',
          'Consult provider if night waking comes with poor weight gain'
        ]
      },
      {
        id: 4,
        type: 'Starting Solids (approx 6 months)',
        frequency: 'Begin with once daily, increase to 2–3 times/day',
        amount: '1–2 tbsp to start, slowly increase',
        notes: [
          'Solids complement but do not replace breastmilk/formula initially',
          'Offer single-ingredient purees or soft mashed foods',
          'Introduce one new food every few days to watch for reactions'
        ]
      }
    ],
    guidelines: [
      {
        title: 'Exclusive Feeding Recommendation',
        icon: 'ℹ️',
        content:
          'Exclusive breastfeeding or iron-fortified formula recommended for the first 6 months.'
      },
      {
        title: 'Introducing Solids',
        icon: '🍽️',
        content:
          'Start solids around 6 months when baby can sit with support and shows interest. Begin with single-ingredient purees or soft mashed foods.'
      },
      {
        title: 'Vitamin D Supplement',
        icon: '💊',
        content:
          'Babies who are breastfed should receive 400 IU Vitamin D daily; formula-fed babies may need supplementation depending on formula intake.'
      },
      {
        title: 'Allergy Watch',
        icon: '⚠️',
        content:
          'Introduce common potential allergens (peanut, egg) around 6 months per pediatric guidance; watch for reactions and consult provider if unsure.'
      },
      {
        title: 'Bottle & Paced Feeding Safety',
        icon: '🍼',
        content:
          'Hold the baby upright and pace bottles to encourage self-regulation. Avoid propping bottles or feeding lying flat.'
      },
      {
        title: 'Burping & Reflux',
        icon: '🫧',
        content:
          'Burp mid-feed and after; if frequent spitting up or discomfort occurs, discuss with your pediatrician for reflux guidance.'
      },
      {
        title: 'Safe Milk Storage',
        icon: '🧊',
        content:
          'Store expressed milk in clean, labeled containers. Use within recommended times (room temp up to 4 hours, refrigerated up to 4 days—follow local guidance).'
      },
      {
        title: 'Clean Feeding Equipment',
        icon: '🧼',
        content:
          'Wash and sterilize bottles and nipples regularly. Inspect for wear and replace cracked parts.'
      },
      {
        title: 'Feeding When Unwell',
        icon: '🤒',
        content:
          'Offer small, frequent feeds if baby is sick and contact your pediatrician if feeding drops significantly or dehydration signs appear.'
      },
      {
        title: 'When to Contact Provider',
        icon: '📞',
        content:
          'Call your provider for poor weight gain, very few wet diapers, persistent vomiting, high fever, or bloody stools.'
      }
    ],
    extraTips: [
      {
        title: 'Watch Diapers',
        icon: '🚼',
        content: '6–8 wet diapers/day is a good hydration sign for infants.'
      },
      {
        title: 'Growth Check',
        icon: '📈',
        content: 'Regular weight and length checks help confirm adequate intake.'
      },
      {
        title: 'Hunger vs Sleep',
        icon: '😴',
        content:
          'Crying is a late hunger cue—try earlier cues like rooting, lip smacking or hand-to-mouth.'
      },
      {
        title: 'Keep a Feeding Log',
        icon: '📝',
        content:
          'Recording times and amounts can help spot patterns and is useful for pediatric visits.'
      },
      {
        title: 'Skin-to-Skin',
        icon: '🤱',
        content:
          'Skin-to-skin contact supports breastfeeding, helps regulate baby, and promotes bonding.'
      },
      {
        title: 'Avoid Honey',
        icon: '🚫🍯',
        content: 'Do not give honey to infants under 1 year due to botulism risk.'
      }
    ]
  };

  return (
    <div className="feeding-container">
      <FeedingHeader onBack={() => navigate('/home')} />

      <div className="feeding-main">
        <div className="baby-age-card">
          <div className="baby-age-emoji">👶</div>
          <div className="baby-age-content">
            <h3>Baby Age: {feedingData.babyAge}</h3>
            <p>Simple, practical feeding guidance for {feedingData.ageInMonths} months</p>
          </div>
        </div>

        <div className="feeding-tabs">
          <button
            className={`feeding-tab-btn ${activeTab === 'schedule' ? 'active' : ''}`}
            onClick={() => setActiveTab('schedule')}
          >
            Feeding Schedule
          </button>
          <button
            className={`feeding-tab-btn ${activeTab === 'guidelines' ? 'active' : ''}`}
            onClick={() => setActiveTab('guidelines')}
          >
            Guidelines & Tips
          </button>
        </div>

        {activeTab === 'schedule' && (
          <div>
            {feedingData.schedules.map((s) => (
              <div key={s.id} className="feeding-schedule-card">
                <div className="feeding-schedule-header">
                  <div className="feeding-schedule-icon">🍼</div>
                  <h3>{s.type}</h3>
                </div>

                <div className="feeding-frequency">{s.frequency}</div>
                <p className="feeding-amount"><strong>Typical amount:</strong> {s.amount}</p>

                <h4>Practical Notes</h4>
                {s.notes.map((note, i) => (
                  <div key={i} className="feeding-instruction">
                    • {note}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'guidelines' && (
          <div>
            <h3 className="feeding-section-title">Guidelines & Tips</h3>

            {feedingData.guidelines.map((g) => (
              <div key={g.title} className="feeding-guideline-card">
                <div className="feeding-guideline-icon">{g.icon}</div>
                <div className="feeding-guideline-content">
                  <h4>{g.title}</h4>
                  <p>{g.content}</p>
                </div>
              </div>
            ))}

            <h3 className="feeding-section-title">Extra Tips</h3>
            {feedingData.extraTips.map((t) => (
              <div key={t.title} className="feeding-guideline-card">
                <div className="feeding-guideline-icon">{t.icon}</div>
                <div className="feeding-guideline-content">
                  <h4>{t.title}</h4>
                  <p>{t.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNavigation activeTab="Feeding" />
    </div>
  );
}
