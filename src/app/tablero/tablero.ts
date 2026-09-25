import { Component, computed, signal } from '@angular/core';

// -----------------------------------------------------------------------------
// El modelo de datos.
// Esto es TypeScript, no JavaScript: describimos la FORMA que tiene un producto.
// A cambio de estas cinco líneas, el editor nos avisa si escribimos p.precoi.
// -----------------------------------------------------------------------------
interface Producto {
  nombre: string;
  precio: number;
  cantidad: number;
}

@Component({
  selector: 'app-tablero',
  templateUrl: './tablero.html',
})
export class Tablero {
  // ===========================================================================
  //  EL ESTADO — todo en signals
  // ===========================================================================
  // Una signal es una cajita que contiene el valor y que además lleva la cuenta
  // de quién la está mirando. Cuando cambia, avisa exactamente a esos.
  // ---------------------------------------------------------------------------
  vendedor = signal('Don Efraín');

  filtro = signal('');

  productos = signal<Producto[]>([
  { nombre: 'Mango', precio: 1800, cantidad: 12 },
  { nombre: 'Guayaba', precio: 1200, cantidad: 8 },
  { nombre: 'Patilla', precio: 6500, cantidad: 2 },
  { nombre: 'Maracuyá', precio: 3400, cantidad: 5 },
  { nombre: 'Níspero', precio: 2900, cantidad: 4 },
]);

  // ===========================================================================
  //  LOS VALORES DERIVADOS — computed()
  // ===========================================================================
  // No se guardan: se deducen de otros. Al leer productos() adentro, el computed
  // queda suscrito y se recalcula solo cuando la lista cambia.
  // ---------------------------------------------------------------------------
  total = computed(() =>
    this.productos().reduce((suma, p) => suma + p.precio * p.cantidad, 0),
  );

  // Ojo: aquí se suma la CANTIDAD, no el precio por la cantidad.
  unidades = computed(() =>
    this.productos().reduce((suma, p) => suma + p.cantidad, 0),
  );

  // Un computed puede depender de dos signals a la vez.
  visibles = computed(() => {
    const texto = this.filtro().toLowerCase().trim();
    if (texto === '') return this.productos();
    return this.productos().filter((p) => p.nombre.toLowerCase().includes(texto));
  });

  // ===========================================================================
  //  LOS MÉTODOS — cómo se cambia una signal
  // ===========================================================================

  // update() cuando el valor nuevo se calcula A PARTIR del viejo.
  //
  // Lo que NO funciona, y es el error más común:
  //     this.productos()[0].cantidad--;     <- modifica por dentro
  // El arreglo sí cambia, la consola lo confirma, y la pantalla no se entera.
  // Hay que construir un arreglo NUEVO: por eso map y el operador de propagación.
  vender(nombre: string) {
    this.productos.update((lista) =>
      lista.map((p) =>
        p.nombre === nombre && p.cantidad > 0
          ? { ...p, cantidad: p.cantidad - 1 } // objeto nuevo, con una menos
          : p, // los demás, tal cual estaban
      ),
    );
    // Y aquí NO hay que llamar a pintar(). No existe pintar().
    // El total y las unidades ya están al día: son computed.
  }

  reabastecer(nombre: string) {
    this.productos.update((lista) =>
      lista.map((p) => (p.nombre === nombre ? { ...p, cantidad: p.cantidad + 10 } : p)),
    );
  }

  // El objeto $event trae lo que escribió el usuario.
  // TypeScript sabe que todo evento tiene un target, pero no sabe si ese target
  // es una caja de texto: por eso hace falta el "as HTMLInputElement".
  onFiltrar(e: Event) {
    const caja = e.target as HTMLInputElement;
    this.filtro.set(caja.value);
  }

  // set() cuando el valor nuevo no depende del anterior.
  limpiarFiltro() {
    this.filtro.set('');
  }
}
