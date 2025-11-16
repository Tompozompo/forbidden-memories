import { useNavigate } from 'react-router-dom';
import { useSaveStore } from '../store/saveStore';

function CampaignMenuScreen() {
  const navigate = useNavigate();
  const { saveGame, starchips } = useSaveStore();

  const handleCampaign = () => {
    navigate('/campaign');
  };

  const handleFreeDuel = () => {
    navigate('/map');
  };

  const handleBuildDeck = () => {
    navigate('/deck');
  };

  const handleLibrary = () => {
    navigate('/library');
  };

  const handleStore = () => {
    navigate('/shop');
  };

  const handleSave = () => {
    // Force save current state
    saveGame({});
    alert('Game saved successfully!');
  };

  const handleSettings = () => {
    navigate('/settings');
  };

  const handleBackToMenu = () => {
    navigate('/');
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
      {/* Header */}
      <div style={{
        position: 'absolute',
        top: '16px',
        left: '16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: 'calc(100% - 32px)',
      }}>
        <button
          onClick={handleBackToMenu}
          style={{
            padding: '8px 16px',
            fontSize: '14px',
            backgroundColor: '#444',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          ← Main Menu
        </button>
        
        <div style={{
          fontSize: '18px',
          fontWeight: 'bold',
          color: '#ffd700',
        }}>
          ★ {starchips} Starchips
        </div>
      </div>

      {/* Title */}
      <div style={{
        fontSize: 'clamp(24px, 8vw, 48px)',
        fontWeight: 'bold',
        marginBottom: '48px',
        textAlign: 'center',
        textShadow: '0 0 20px rgba(255, 215, 0, 0.5)',
        color: '#ffd700',
      }}>
        CAMPAIGN MENU
      </div>

      {/* Menu Buttons */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        width: '100%',
        maxWidth: '300px',
      }}>
        <MenuButton onClick={handleCampaign} label="Campaign" />
        <MenuButton onClick={handleFreeDuel} label="Free Duel" />
        <MenuButton onClick={handleBuildDeck} label="Build Deck" />
        <MenuButton onClick={handleLibrary} label="Library" />
        <MenuButton onClick={handleStore} label="Store" />
        <MenuButton onClick={handleSettings} label="Settings" />
        <MenuButton onClick={handleSave} label="Save" />
      </div>
    </div>
  );
}

interface MenuButtonProps {
  onClick: () => void;
  label: string;
}

function MenuButton({ onClick, label }: MenuButtonProps) {
  return (
    <button
      onClick={onClick}
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
      {label}
    </button>
  );
}

export default CampaignMenuScreen;
