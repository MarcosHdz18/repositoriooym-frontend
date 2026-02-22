import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { trigger as animationTrigger, transition, style, animate } from '@angular/animations';
import { KeycloakService } from 'keycloak-angular';
import { UtilsService } from 'src/app/modules/shared/services/utils.service';

@Component({
  selector: 'app-proyectos-legacy',
  templateUrl: './proyectos-legacy.component.html',
  styleUrls: ['./proyectos-legacy.component.css'],
  animations: [
    animationTrigger('fadeAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class ProyectosLegacyComponent implements OnInit {

  public puedeVerAyuda: boolean = false;

  isAdmin: any;
  isUser: any;
  isPefilApp: any;
  isPerfilInfraestructura: any;

  @ViewChild('iframeLegacy') iframeElement!: ElementRef;

  // URL del portal legacy
  private readonly rawUrl = 'http://10.119.79.95:8081/code/html_2025/index.html';

  // URL para el portal legacy
  public urlPortalLegacy!: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer, private util: UtilsService) { }

  ngOnInit(): void {
    this.urlPortalLegacy = this.sanitizer.bypassSecurityTrustResourceUrl(this.rawUrl);
    
    this.puedeVerAyuda = this.util.isAdmin() || this.util.isPerfilApp() || this.util.isPerfilInfraestructura();
  }

  // Método para recargar el iframe
  reloadIframe() {
    try {
      const iframe = this.iframeElement.nativeElement;
      // 1. Intentamos obtener la URL actual donde está el usuario navegando
      let currentUrl = iframe.contentWindow.location.href;

      const urlActual = iframe.src;
      iframe.src = ''; // Lo vaciamos un milisegundo

      setTimeout(() => {
        // Al restaurarlo, el navegador busca la página en la que se quedó
        iframe.src = urlActual;
      }, 10);

    } catch (e) {
    }
  }
}
