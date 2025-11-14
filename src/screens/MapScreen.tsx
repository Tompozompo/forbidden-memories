import { useNavigate } from 'react-router-dom';
import { useSaveStore } from '../store/saveStore';
import npcs from '../data/npcs.json';

interface NPC {
  id: number;
  name: string;
  deck: number[];
}

function MapScreen() {
  const navigate = useNavigate();
  const { beatenIds, starchips } = useSaveStore();
  const allNpcs = npcs as NPC[];
  
  // Determine which NPCs are unlocked
  // First 2 are unlocked at start, then unlock adjacent ones after beating
  const isUnlocked = (npcId: number): boolean => {
    if (npcId <= 2) return true; // First 2 always unlocked
    
    // Unlock next NPC if previous one is beaten
    return beatenIds.includes(npcId - 1);
  };
  
  const handleDuelistClick = (npcId: number) => {
    if (isUnlocked(npcId)) {
      navigate(`/duel/${npcId}`);
    }
  };
  
  const handleBackToMenu = () => {
    navigate('/');
  };
  
  const handleDeckEdit = () => {
    navigate('/deck');
  };

  const handleShop = () => {
    navigate('/shop');
  };

  const handleSettings = () => {
    navigate('/settings');
  };

  return (
    <div style={{
      minHeight: '100vh',
      padding: '16px',
      background: 'linear-gradient(to bottom, #2a2a3e, #1a1a2e)',
      color: '#fff',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '8px',
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
          ← Menu
        </button>
        
        <div style={{
          fontSize: '18px',
          fontWeight: 'bold',
          color: '#ffd700',
        }}>
          ★ {starchips} Starchips
        </div>
      </div>

      {/* Quick Access Buttons */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '24px',
        justifyContent: 'center',
        flexWrap: 'wrap',
      }}>
        <button
          onClick={handleDeckEdit}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
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
          📝 Deck Editor
        </button>
        
        <button
          onClick={handleShop}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            fontWeight: 'bold',
            backgroundColor: '#ff9800',
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
          🛒 Store
        </button>
        
        <button
          onClick={handleSettings}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
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
          ⚙️ Settings
        </button>
      </div>
      
      {/* Title */}
      <h1 style={{
        fontSize: 'clamp(20px, 6vw, 28px)',
        textAlign: 'center',
        marginBottom: '32px',
        textShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
      }}>
        Duelist Map
      </h1>
      
      {/* Duelist Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
        gap: '16px',
        maxWidth: '800px',
        margin: '0 auto',
      }}>
        {allNpcs.map((npc) => {
          const unlocked = isUnlocked(npc.id);
          const beaten = beatenIds.includes(npc.id);
          
          return (
            <div
              key={npc.id}
              onClick={() => handleDuelistClick(npc.id)}
              style={{
                padding: '16px',
                backgroundColor: unlocked ? (beaten ? '#2a5' : '#2196f3') : '#333',
                border: '2px solid',
                borderColor: unlocked ? '#fff' : '#555',
                borderRadius: '8px',
                cursor: unlocked ? 'pointer' : 'not-allowed',
                opacity: unlocked ? 1 : 0.5,
                transition: 'transform 0.2s, box-shadow 0.2s',
                position: 'relative',
              }}
              onMouseEnter={(e) => {
                if (unlocked) {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 255, 255, 0.3)';
                }
              }}
              onMouseLeave={(e) => {
                if (unlocked) {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              {/* Duelist Name */}
              <div style={{
                fontSize: 'clamp(12px, 3.5vw, 16px)',
                fontWeight: 'bold',
                textAlign: 'center',
                marginBottom: '8px',
              }}>
                {npc.name}
              </div>
              
              {/* Status */}
              <div style={{
                fontSize: '12px',
                textAlign: 'center',
                color: unlocked ? '#fff' : '#888',
              }}>
                {beaten ? '✓ Defeated' : (unlocked ? 'Ready' : '🔒 Locked')}
              </div>
              
              {/* Level indicator */}
              <div style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                fontSize: '10px',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                padding: '2px 6px',
                borderRadius: '4px',
              }}>
                Lv.{npc.id}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MapScreen;
