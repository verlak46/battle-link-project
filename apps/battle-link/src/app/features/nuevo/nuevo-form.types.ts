export type TipoCreacion = 'partida' | 'evento';

export interface PasoWizard {
  id: number;
  titulo: string;
  icono: string;
}

export interface NuevoFormData {
  juego: string;
  sistema: string;
  fecha: string;
  hora: string;
  ciudad: string;
  direccion: string;
  titulo: string;
  descripcion: string;
  maxJugadores: string;
  venueId?: string;
  imageUrl?: string;
}

export const PASOS_WIZARD: PasoWizard[] = [
  { id: 1, titulo: 'Juego', icono: 'game-controller-outline' },
  { id: 2, titulo: 'Fecha', icono: 'calendar-outline' },
  { id: 3, titulo: 'Ubicación', icono: 'location-outline' },
  { id: 4, titulo: 'Detalles', icono: 'list-outline' },
];
