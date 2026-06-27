export interface BowSetup {
  id: string;
  name: string;
  type: 'classique' | 'compound' | 'barebow' | 'longbow';
  riser: string;
  limbs: string;
  limbsPoundage: string;
  string: string;
  sight: string;
  stabilization: string;
  clicker: boolean;
  arrowRest: string;
  berger: string;
  notes: string;
  createdAt: string;
}

export interface ArrowSet {
  id: string;
  name: string;
  brand: string;
  model: string;
  spine: string;
  length: string;
  points: string;
  fletching: string;
  nocks: string;
  quantity: number;
  estimatedShots: number;
  notes: string;
  createdAt: string;
}

export interface EquipmentSettings {
  id: string;
  name: string;
  date: string;
  bowId: string;
  arrowSetId: string;
  tiller: string;
  bandHeight: string;
  sightSettings: string;
  bergerDistance: string;
  notes: string;
}
