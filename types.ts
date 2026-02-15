
export enum AppState {
  INTRO = 'INTRO',
  INPUT = 'INPUT',
  RESULT = 'RESULT'
}

export interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}
