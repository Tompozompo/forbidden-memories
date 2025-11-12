import { useNavigate } from 'react-router-dom';
import { hasSave } from '../utils/saveSystem';
import { useSaveStore } from '../store/saveStore';

function MainMenu() {
  const navigate = useNavigate();
  const { loadGame, resetGame } = useSaveStore();
  const saveExists = hasSave();
  
  const handleNewJourney = () => {
    resetGame();
    navigate('/map');
  };
  
  const handleContinue = () => {
    loadGame();
    navigate('/map');
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
      <div style={{
        fontSize: 'clamp(24px, 8vw, 48px)',
        fontWeight: 'bold',
        marginBottom: '48px',
        textAlign: 'center',
        textShadow: '0 0 20px rgba(255, 215, 0, 0.5)',
        color: '#ffd700',
      }}>
        <div>FORBIDDEN</div>
        <div>MEMORIES</div>
      </div>
      
      {/* Menu Buttons */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        width: '100%',
        maxWidth: '300px',
      }}>
        <button
          onClick={handleNewJourney}
          style={{
            padding: '16px 32px',
            fontSize: 'clamp(14px, 4vw, 20px)',
            fontWeight: 'bold',
            backgroundColor: '#2196f3',
            color: '#fff',
            border: '2px solid #fff',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'transform 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          New Journey
        </button>
        
        {saveExists && (
          <button
            onClick={handleContinue}
            style={{
              padding: '16px 32px',
              fontSize: 'clamp(14px, 4vw, 20px)',
              fontWeight: 'bold',
              backgroundColor: '#4caf50',
              color: '#fff',
              border: '2px solid #fff',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            Continue
          </button>
        )}
      </div>
      
      {/* Version */}
      <div style={{
        position: 'absolute',
        bottom: '16px',
        fontSize: '12px',
        color: '#888',
      }}>
        v0.1.0-MVP
      </div>
    </div>
  );
}

export default MainMenu;
