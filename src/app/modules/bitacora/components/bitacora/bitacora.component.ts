import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { BitacoraService } from 'src/app/modules/shared/services/bitacora.service';
import { trigger as animationTrigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-bitacora',
  templateUrl: './bitacora.component.html',
  styleUrls: ['./bitacora.component.css'],
  animations: [
    animationTrigger('fadeAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class BitacoraComponent implements OnInit {
  displayedColumns: string[] = ['idBitacora', 'fecha', 'usuario', 'accion', 'detalle'];
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private bitacoraService: BitacoraService) { }

  ngOnInit(): void {
    this.bitacoraService.getBitacora().subscribe(data => {
      // Opcional: Invertir el arreglo para ver lo más nuevo primero
      this.dataSource.data = data.reverse();
      this.dataSource.paginator = this.paginator;
    });
  }

  /**
   * Filtro para buscar movimientos
   * @param event 
   */
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  /**
   * Comprueba la accion y la colorea de un color dependiendo el movimiento
   * @param accion
   * @param tipo 
   * @returns 
   */
  obtenerClaseAccion(accion: string): string {
    if (!accion) return '';
    const s = accion;

    if (s.includes('DELETE')) {
      return 'tag-delete';
    }
    if (s.includes('UPDATE')) {
      return 'tag-update';
    }
    if (s.includes('CREATE')) {
      return 'tag-create';
    }
    return '';
  }
}
