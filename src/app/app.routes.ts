import { Routes } from '@angular/router';
import { Tablero } from './tablero/tablero';
import { Acerca } from './acerca/acerca';
import { Inventario } from './inventario';

export const routes: Routes = [
  { path: '', redirectTo: 'tablero', pathMatch: 'full' },
  { path: 'tablero', component: Tablero },
  { path: 'acerca', component: Acerca },
  { path: 'inventario', component: Inventario },
  { path: '**', redirectTo: 'tablero' },
];