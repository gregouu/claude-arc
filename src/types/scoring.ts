export type Discipline = 'salle' | 'tae' | 'campagne' | 'nature' | '3d' | 'beursault';

export type BlasonType =
  | 'tri-spot-40'   // Trispot 40cm (salle)
  | 'mono-80'       // 80cm (salle)
  | 'mono-122'      // 122cm (TAE 70m)
  | 'mono-80-tae'   // 80cm (TAE 50m/30m)
  | 'mono-60';      // 60cm

export interface Arrow {
  id: string;
  x: number; // -1 to 1 (center = 0)
  y: number; // -1 to 1 (center = 0)
  score: number;
  isX: boolean;
  volley: number;
}

export interface Session {
  id: string;
  date: string;
  discipline: Discipline;
  blason: BlasonType;
  distance: number;
  arrowsPerVolley: number;
  totalVolleys: number;
  arrows: Arrow[];
  weather?: string;
  wind?: string;
  notes?: string;
}

export interface SessionStats {
  totalScore: number;
  maxScore: number;
  average: number;
  xCount: number;
  tenCount: number;
  arrowCount: number;
}
