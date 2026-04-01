export type CreationType = 'partida' | 'evento';

export interface WizardStep {
  id: number;
  title: string;
  icon: string;
}

export interface NewFormData {
  game: string;
  system: string;
  startDate: string;
  endDate?: string;
  time: string;
  city: string;
  address: string;
  title: string;
  description: string;
  maxPlayers: string;
  contactUrl?: string;
  placeId?: string;
  placeName?: string;
  imageUrl?: string;
}

export const WIZARD_STEPS: WizardStep[] = [
  { id: 1, title: 'Juego', icon: 'game-controller-outline' },
  { id: 2, title: 'Fecha', icon: 'calendar-outline' },
  { id: 3, title: 'Ubicación', icon: 'location-outline' },
  { id: 4, title: 'Detalles', icon: 'list-outline' },
];
