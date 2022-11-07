import {
  trigger,
  state,
  style,
  transition,
  animate,
  query,
} from '@angular/animations';

export const grow = trigger('grow', [
  state('close', style({ height: '0px', overflow: 'hidden' })),
  state('open', style({ height: '*', overflow: 'hidden' })),
  transition('open <=> close', animate('250ms ease-in-out')),
]);
