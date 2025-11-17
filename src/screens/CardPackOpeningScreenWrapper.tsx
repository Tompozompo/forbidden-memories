import { useSaveStore } from '../store/saveStore';
import CardPackOpeningScreen from './CardPackOpeningScreen';

function CardPackOpeningScreenWrapper() {
  const { ownedCards } = useSaveStore();
  
  return <CardPackOpeningScreen cardIds={ownedCards} />;
}

export default CardPackOpeningScreenWrapper;
