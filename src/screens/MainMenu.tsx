import { useNavigate } from 'react-router-dom';
import { useSpring, animated, config } from '@react-spring/web';
import { hasSave } from '../utils/saveSystem';
import { useSaveStore } from '../store/saveStore';

function MainMenu() {
  const navigate = useNavigate();
  const { loadGame, resetGame } = useSaveStore();
  const saveExists = hasSave();
  
  // Animated title
  const titleAnimation = useSpring({
    from: { opacity: 0, transform: 'translateY(-50px) scale(0.8)' },
    to: { opacity: 1, transform: 'translateY(0px) scale(1)' },
    config: config.slow,
  });

  // Animated buttons with stagger
  const buttonAnimation = useSpring({
    from: { opacity: 0, transform: 'translateY(30px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    delay: 300,
    config: config.gentle,
  });

  // Version fade in
  const versionAnimation = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    delay: 600,
    config: config.slow,
  });
  
  const handleNewJourney = () => {
    resetGame();
    navigate('/card-opening');
  };
  
  const handleContinue = () => {
    loadGame();
    navigate('/campaign-menu');
  };
  
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '16px',
      background: 'linear-gradient(to bottom, #1a1a2e, #0f0f1e)',
      color: '#fff',
    }}>
      {/* Logo Placeholder */}
      <animated.div style={{
        ...titleAnimation,
        fontSize: 'clamp(24px, 8vw, 48px)',
        fontWeight: 'bold',
        marginBottom: '48px',
        textAlign: 'center',
        textShadow: '0 0 20px rgba(255, 215, 0, 0.5)',
        color: '#ffd700',
      }}>
        <div className="glow">FORBIDDEN</div>
        <div className="glow">MEMORIES</div>
      </animated.div>
      
      {/* Menu Buttons */}
      <animated.div style={{
        ...buttonAnimation,
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        width: '100%',
        maxWidth: '300px',
      }}>
        <button
          onClick={handleNewJourney}
          className="slideInFromBottom"
          style={{
            padding: '16px 32px',
            fontSize: 'clamp(14px, 4vw, 20px)',
            fontWeight: 'bold',
            backgroundColor: '#2196f3',
            color: '#fff',
            border: '2px solid #fff',
            borderRadius: '8px',
            cursor: 'pointer',
          }}
        >
          New Journey
        </button>
        
        {saveExists && (
          <button
            onClick={handleContinue}
            className="slideInFromBottom"
            style={{
              padding: '16px 32px',
              fontSize: 'clamp(14px, 4vw, 20px)',
              fontWeight: 'bold',
              backgroundColor: '#4caf50',
              color: '#fff',
              border: '2px solid #fff',
              borderRadius: '8px',
              cursor: 'pointer',
              animationDelay: '0.1s',
            }}
          >
            Continue
          </button>
        )}
      </animated.div>
      
      {/* Version */}
      <animated.div style={{
        ...versionAnimation,
        position: 'absolute',
        bottom: '16px',
        fontSize: '12px',
        color: '#888',
      }}>
        v0.1.0-MVP
      </animated.div>
    </div>
  );
}

export default MainMenu;
