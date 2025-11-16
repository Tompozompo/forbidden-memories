import { useNavigate } from 'react-router-dom';

function CampaignScreen() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/campaign-menu');
  };

  const handleSettings = () => {
    navigate('/settings');
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
      {/* Back Button */}
      <button
        onClick={handleBack}
        style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          padding: '8px 16px',
          fontSize: '14px',
          backgroundColor: '#444',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        ← Back
      </button>

      {/* Settings Button */}
      <button
        onClick={handleSettings}
        style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          padding: '8px',
          fontSize: '20px',
          backgroundColor: '#444',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        title="Settings"
      >
        ⚙️
      </button>

      {/* Under Construction Message */}
      <div style={{
        textAlign: 'center',
        maxWidth: '600px',
      }}>
        <div style={{
          fontSize: 'clamp(32px, 10vw, 72px)',
          marginBottom: '32px',
        }}>
          🚧
        </div>
        
        <h1 style={{
          fontSize: 'clamp(24px, 6vw, 48px)',
          fontWeight: 'bold',
          marginBottom: '24px',
          textShadow: '0 0 20px rgba(255, 215, 0, 0.5)',
          color: '#ffd700',
        }}>
          UNDER CONSTRUCTION
        </h1>
        
        <p style={{
          fontSize: 'clamp(16px, 4vw, 20px)',
          lineHeight: '1.6',
          color: '#ccc',
          marginBottom: '32px',
        }}>
          The Campaign mode is currently being developed.
          <br />
          Check back soon for an epic story-driven adventure!
        </p>
        
        <p style={{
          fontSize: 'clamp(14px, 3vw, 16px)',
          color: '#888',
        }}>
          In the meantime, try Free Duel mode to test your skills against various opponents.
        </p>
      </div>
    </div>
  );
}

export default CampaignScreen;
