import { useNavigate } from 'react-router-dom';
import { useSettingsStore } from '../store/settingsStore';

export default function SettingsScreen() {
  const navigate = useNavigate();
  const { checkerColor1, checkerColor2, setCheckerColor1, setCheckerColor2, resetToDefaults } = useSettingsStore();

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => navigate('/campaign-menu')}
          style={{
            fontSize: 'clamp(9px, 2.5vw, 12px)',
            padding: '8px 16px',
            cursor: 'pointer',
          }}
        >
          ← Back
        </button>
      </div>

      <h1 style={{ fontSize: 'clamp(16px, 4vw, 24px)', marginBottom: '20px' }}>Settings</h1>

      <div style={{ 
        backgroundColor: '#1a1a1a', 
        padding: '20px', 
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h2 style={{ fontSize: 'clamp(12px, 3vw, 18px)', marginBottom: '16px' }}>
          Board Appearance
        </h2>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px',
            fontSize: 'clamp(9px, 2.5vw, 12px)'
          }}>
            Checkered Pattern Color 1:
          </label>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <input
              type="color"
              value={checkerColor1}
              onChange={(e) => setCheckerColor1(e.target.value)}
              style={{
                width: '60px',
                height: '40px',
                cursor: 'pointer',
                border: '2px solid #444',
                borderRadius: '4px',
              }}
            />
            <input
              type="text"
              value={checkerColor1}
              onChange={(e) => setCheckerColor1(e.target.value)}
              style={{
                flex: 1,
                padding: '8px',
                fontSize: 'clamp(9px, 2.5vw, 12px)',
                backgroundColor: '#0a0a0a',
                border: '2px solid #444',
                borderRadius: '4px',
                color: '#fff',
                fontFamily: 'monospace',
              }}
            />
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px',
            fontSize: 'clamp(9px, 2.5vw, 12px)'
          }}>
            Checkered Pattern Color 2:
          </label>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <input
              type="color"
              value={checkerColor2}
              onChange={(e) => setCheckerColor2(e.target.value)}
              style={{
                width: '60px',
                height: '40px',
                cursor: 'pointer',
                border: '2px solid #444',
                borderRadius: '4px',
              }}
            />
            <input
              type="text"
              value={checkerColor2}
              onChange={(e) => setCheckerColor2(e.target.value)}
              style={{
                flex: 1,
                padding: '8px',
                fontSize: 'clamp(9px, 2.5vw, 12px)',
                backgroundColor: '#0a0a0a',
                border: '2px solid #444',
                borderRadius: '4px',
                color: '#fff',
                fontFamily: 'monospace',
              }}
            />
          </div>
        </div>

        <div style={{ 
          marginTop: '24px',
          padding: '16px',
          backgroundColor: '#0a0a0a',
          borderRadius: '8px',
          border: '2px solid #333'
        }}>
          <div style={{ fontSize: 'clamp(9px, 2.5vw, 11px)', marginBottom: '12px', color: '#888' }}>
            Preview:
          </div>
          <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  maxWidth: '60px',
                  aspectRatio: '5/7',
                  backgroundColor: i % 2 === 0 ? checkerColor1 : checkerColor2,
                  border: '2px solid #444',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#666',
                  fontSize: 'clamp(8px, 2vw, 10px)',
                }}
              >
                —
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: '20px' }}>
          <button
            onClick={resetToDefaults}
            style={{
              fontSize: 'clamp(9px, 2.5vw, 12px)',
              padding: '10px 20px',
              cursor: 'pointer',
              backgroundColor: '#cc6600',
            }}
          >
            Reset to Defaults
          </button>
        </div>
      </div>

      <div style={{ 
        backgroundColor: '#1a1a1a', 
        padding: '20px', 
        borderRadius: '8px',
        fontSize: 'clamp(9px, 2.5vw, 11px)',
        color: '#888'
      }}>
        <h3 style={{ fontSize: 'clamp(10px, 2.5vw, 14px)', marginBottom: '12px', color: '#fff' }}>
          Preset Themes
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button
            onClick={() => {
              setCheckerColor1('#2a4a2a');
              setCheckerColor2('#1a3a1a');
            }}
            style={{
              padding: '8px 16px',
              fontSize: 'clamp(9px, 2.5vw, 11px)',
              cursor: 'pointer',
              backgroundColor: '#2a4a2a',
            }}
          >
            Classic Green (Default)
          </button>
          <button
            onClick={() => {
              setCheckerColor1('#4a2a2a');
              setCheckerColor2('#3a1a1a');
            }}
            style={{
              padding: '8px 16px',
              fontSize: 'clamp(9px, 2.5vw, 11px)',
              cursor: 'pointer',
              backgroundColor: '#4a2a2a',
            }}
          >
            Dark Red
          </button>
          <button
            onClick={() => {
              setCheckerColor1('#2a2a4a');
              setCheckerColor2('#1a1a3a');
            }}
            style={{
              padding: '8px 16px',
              fontSize: 'clamp(9px, 2.5vw, 11px)',
              cursor: 'pointer',
              backgroundColor: '#2a2a4a',
            }}
          >
            Dark Blue
          </button>
          <button
            onClick={() => {
              setCheckerColor1('#4a4a2a');
              setCheckerColor2('#3a3a1a');
            }}
            style={{
              padding: '8px 16px',
              fontSize: 'clamp(9px, 2.5vw, 11px)',
              cursor: 'pointer',
              backgroundColor: '#4a4a2a',
            }}
          >
            Dark Gold
          </button>
          <button
            onClick={() => {
              setCheckerColor1('#2a2a2a');
              setCheckerColor2('#1a1a1a');
            }}
            style={{
              padding: '8px 16px',
              fontSize: 'clamp(9px, 2.5vw, 11px)',
              cursor: 'pointer',
              backgroundColor: '#2a2a2a',
            }}
          >
            Grayscale
          </button>
        </div>
      </div>
    </div>
  );
}
