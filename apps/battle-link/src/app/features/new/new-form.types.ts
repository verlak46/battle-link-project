export type { CreationType } from '@battle-link/shared-models';

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
  { id: 1, title: 'NEW.STEP_GAME', icon: 'game-controller-outline' },
  { id: 2, title: 'NEW.STEP_DATE', icon: 'calendar-outline' },
  { id: 3, title: 'NEW.STEP_LOCATION', icon: 'location-outline' },
  { id: 4, title: 'NEW.STEP_DETAILS', icon: 'list-outline' },
];
