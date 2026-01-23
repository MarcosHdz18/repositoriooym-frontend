import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { trigger as animationTrigger, transition, style, animate } from '@angular/animations';

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

  // URL para el portal legacy
  public urlPortalLegacy!: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    const legacyUrl = 'http://10.119.79.95:8081/code/html_2025/index.html';
    // Sanitizar la URL para que Angular la considere segura
    this.urlPortalLegacy = this.sanitizer.bypassSecurityTrustResourceUrl(legacyUrl);
  }

}
