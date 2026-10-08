import { Component, computed, signal, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe, DatePipe, registerLocaleData } from '@angular/common';
import localeEsCo from '@angular/common/locales/es-CO';

registerLocaleData(localeEsCo);

interface Producto {
  nombre: string;
  categoria: string;
  precio: number;
  cantidad: number;
}

type Estado = 'agotado' | 'bajo' | 'disponible';

// R5: pipe propio
@Pipe({ name: 'unidades' })
export class UnidadesPipe implements PipeTransform {
  transform(n: number): string {
    if (n === 0) return 'sin existencias';
    if (n === 1) return '1 unidad';
    return `${n} unidades`;
  }
}

@Component({
  selector: 'app-inventario',
  imports: [CurrencyPipe, DatePipe, UnidadesPipe],
  providers: [{ provide: LOCALE_ID, useValue: 'es-CO' }],
  template: `
    <h1>Inventario · {{ hoy | date:'fullDate' }}</h1>

    <div class="filtros">
      @for (c of categorias; track c) {
        <button (click)="filtro.set(c)" [class.activo]="filtro() === c">{{ c }}</button>
      }
    </div>

    <table>
      <thead>
        <tr>
          <th>Producto</th>
          <th>Precio</th>
          <th>Existencias</th>
          <th>Estado</th>
        </tr>
      </thead>
      <tbody>
        @for (f of filas(); track f.nombre) {
          <tr [class.agotado]="f.estado === 'agotado'">
            <td>{{ f.nombre }}</td>
            <td>{{ f.precio | currency:'COP':'symbol':'1.0-0' }}</td>
            <td>{{ f.cantidad | unidades }}</td>
            <td>
              @switch (f.estado) {
                @case ('agotado') { <span>Agotado</span> }
                @case ('bajo') { <span>Bajo</span> }
                @default { <span>Disponible</span> }
              }
            </td>
          </tr>
        } @empty {
          <tr>
            <td colspan="4">No hay productos en esta categoría</td>
          </tr>
        }
      </tbody>
    </table>
  `,
  styles: [`
    table { border-collapse: collapse; margin-top: 12px; }
    th, td { border: 1px solid #ccc; padding: 6px 12px; text-align: left; }
    .filtros button { margin-right: 6px; padding: 6px 12px; cursor: pointer; }
    .filtros button.activo { font-weight: bold; background: #cfe3ff; }
    .agotado { background: #ffd6d6; color: #8a1c1c; }
  `],
})
export class Inventario {
  hoy = new Date();
  categorias = ['Todas', 'Frutas', 'Verduras', 'Granos'];
  filtro = signal('Todas');

  productos = signal<Producto[]>([
    { nombre: 'Mango',   categoria: 'Frutas',   precio: 1800, cantidad: 12 },
    { nombre: 'Guayaba', categoria: 'Frutas',   precio: 1200, cantidad: 0 },
    { nombre: 'Patilla', categoria: 'Frutas',   precio: 6500, cantidad: 2 },
    { nombre: 'Tomate',  categoria: 'Verduras', precio: 3200, cantidad: 9 },
    { nombre: 'Cebolla', categoria: 'Verduras', precio: 2800, cantidad: 1 },
    { nombre: 'Ahuyama', categoria: 'Verduras', precio: 4500, cantidad: 0 },
  ]);

  visibles = computed(() => {
    const f = this.filtro();
    const lista = this.productos();
    return f === 'Todas' ? lista : lista.filter(p => p.categoria === f);
  });

  filas = computed(() =>
    this.visibles().map(p => ({
      ...p,
      estado: (p.cantidad === 0 ? 'agotado' : p.cantidad <= 2 ? 'bajo' : 'disponible') as Estado,
    }))
  );
}