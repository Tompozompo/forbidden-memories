import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import cards from '../data/cards.json';
import type { Card } from '../types';
import CardComponent from '../ui/Card';

const allCards = cards as Card[];

type SortOption = 'id' | 'name' | 'atk' | 'def' | 'level' | 'rarity';

function LibraryScreen() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'All' | 'Monster' | 'Spell' | 'Trap'>('All');
  const [sortBy, setSortBy] = useState<SortOption>('id');

  const handleBack = () => {
    navigate('/campaign-menu');
  };

  const filteredCards = allCards.filter(card => {
    const matchesSearch = card.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || card.type === filterType;
    return matchesSearch && matchesType;
  });

  const sortedCards = [...filteredCards].sort((a, b) => {
    switch (sortBy) {
      case 'id':
        return a.id - b.id;
      case 'name':
        return a.name.localeCompare(b.name);
      case 'atk':
        return (b.atk ?? -1) - (a.atk ?? -1);
      case 'def':
        return (b.def ?? -1) - (a.def ?? -1);
      case 'level':
        return (b.level ?? -1) - (a.level ?? -1);
      case 'rarity': {
        const rarityOrder = { 'Common': 1, 'Rare': 2, 'Super Rare': 3, 'Ultra Rare': 4 };
        const aRarity = a.rarity ? rarityOrder[a.rarity] : 0;
        const bRarity = b.rarity ? rarityOrder[b.rarity] : 0;
        return bRarity - aRarity;
      }
      default:
        return 0;
    }
  });

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
          onClick={handleBack}
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
          ← Back
        </button>

        <h1 style={{
          fontSize: 'clamp(20px, 6vw, 28px)',
          textAlign: 'center',
          margin: '0',
          textShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
          color: '#ffd700',
        }}>
          Card Library
        </h1>

        <div style={{ width: '80px' }} /> {/* Spacer for centering */}
      </div>

      {/* Search and Filter */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '24px',
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}>
        <input
          type="text"
          placeholder="Search cards..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flex: '1',
            minWidth: '200px',
            maxWidth: '400px',
            padding: '12px',
            fontSize: '16px',
            backgroundColor: '#333',
            color: '#fff',
            border: '2px solid #555',
            borderRadius: '8px',
          }}
        />
        
        <div style={{
          display: 'flex',
          gap: '8px',
        }}>
          {(['All', 'Monster', 'Spell', 'Trap'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              style={{
                padding: '12px 16px',
                fontSize: '14px',
                fontWeight: 'bold',
                backgroundColor: filterType === type ? '#2196f3' : '#444',
                color: '#fff',
                border: '2px solid',
                borderColor: filterType === type ? '#fff' : '#555',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Sort Options */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '16px',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <span style={{ color: '#aaa', fontSize: '14px' }}>Sort by:</span>
        {([
          { value: 'id', label: 'Card #' },
          { value: 'name', label: 'Name' },
          { value: 'atk', label: 'ATK' },
          { value: 'def', label: 'DEF' },
          { value: 'level', label: 'Level' },
          { value: 'rarity', label: 'Rarity' },
        ] as const).map((option) => (
          <button
            key={option.value}
            onClick={() => setSortBy(option.value)}
            style={{
              padding: '8px 12px',
              fontSize: '13px',
              fontWeight: sortBy === option.value ? 'bold' : 'normal',
              backgroundColor: sortBy === option.value ? '#4caf50' : '#555',
              color: '#fff',
              border: '1px solid',
              borderColor: sortBy === option.value ? '#fff' : '#666',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Card Count */}
      <div style={{
        textAlign: 'center',
        marginBottom: '16px',
        fontSize: '16px',
        color: '#aaa',
      }}>
        Showing {sortedCards.length} of {allCards.length} cards
      </div>

      {/* Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
        gap: '16px',
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        {sortedCards.map((card) => (
          <div
            key={card.id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '12px',
              backgroundColor: '#1e1e2e',
              border: '2px solid #444',
              borderRadius: '8px',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 0 15px rgba(33, 150, 243, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <CardComponent card={card} />
          </div>
        ))}
      </div>

      {/* No Results */}
      {sortedCards.length === 0 && (
        <div style={{
          textAlign: 'center',
          fontSize: '18px',
          color: '#888',
          marginTop: '48px',
        }}>
          No cards found matching your search.
        </div>
      )}
    </div>
  );
}

export default LibraryScreen;
