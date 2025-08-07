import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-proyectos-legacy',
  templateUrl: './proyectos-legacy.component.html',
  styleUrls: ['./proyectos-legacy.component.css']
})
export class ProyectosLegacyComponent implements OnInit {

  // URL para el portal legacy
  public urlPortalLegacy!: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    const legacyUrl = 'http://10.119.79.133:8081/code/html_2007/Web-imp_07.htm';
    // Sanitizar la URL para que Angular la considere segura
    this.urlPortalLegacy = this.sanitizer.bypassSecurityTrustResourceUrl(legacyUrl);
  }

}
