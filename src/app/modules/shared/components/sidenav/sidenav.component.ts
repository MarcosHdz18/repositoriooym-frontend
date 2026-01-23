import { MediaMatcher } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { UtilsService } from '../../services/utils.service';
import { HelpDialogComponent } from '../help-dialog/help-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {

  mobileQuery: MediaQueryList;
  username: any;
  isAdmin: any;
  isPerfilApp: any;
  isPerfilInfraestructura: any;
  userURLImage= '../../../../../assets/img/user-image.jpg';

  inicioMenu: MenuItem[] = [
    { name: "Inicio", route: "home", icon: "home" },
  ]

  systemNav: MenuItem[] = [
    { name: "Departamentos", route: "area", icon: "account_balance", allowedProfiles: ['admin', 'perfilApp', 'perfilInfraestructura'] },
    { name: "Responsables", route: "responsable", icon: "accessibility", allowedProfiles: ['admin', 'perfilApp', 'perfilInfraestructura'] },
    { name: "Clientes", route: "cliente", icon: "supervised_user_circle", allowedProfiles: ['admin', 'perfilApp', 'perfilInfraestructura'] },
    { name: "Regiones", route: "region", icon: "business", allowedProfiles: ['admin', 'perfilApp', 'perfilInfraestructura'] },
    { name: "Sitios", route: "sitio", icon: "home", allowedProfiles: ['admin', 'perfilApp', 'perfilInfraestructura'] },
    { name: "Tipos de Proyecto", route: "tipoProyecto", icon: "list_alt", allowedProfiles: ['admin', 'perfilApp', 'perfilInfraestructura'] },
    { name: "Proyectos", route: "proyecto", icon: "important_devices" }
  ];

  historyNav: MenuItem[] = [
    { name: "Proyectos 2007-2025", route: "proyectosLegacy", icon: "history" }
  ];

  infoNav: MenuItem[] = [
    //{ name: "Misión", route: "mision", icon: "flag" },
    //{ name: "Visión", route: "vision", icon: "visibility" },
    { name: "Objetivos", route: "objetivos", icon: "track_changes" },
    { name: "Organigrama", route: "organigrama", icon: "account_tree" }
  ];

  sections: MenuSection[] = [
    { title: 'Inicio', items: this.inicioMenu, expanded: true },
    { title: 'Información', items: this.infoNav, expanded: false },
    { title: 'Operaciones', items: this.systemNav, expanded: false },
    { title: 'Histórico', items: this.historyNav, expanded: false }
  ];

  toggle(sec: MenuSection) {
    sec.expanded = !sec.expanded;
  }

  constructor(media: MediaMatcher, private keycloakService: KeycloakService, private utils: UtilsService, private dialog: MatDialog) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
  }

  ngOnInit(): void {

    if (!this.username) {
      this.keycloakService.loadUserProfile().then(profile => {
        this.username = profile.firstName + ' ' + profile.lastName;
      });
    }

    // Arreglo para filtrar perfiles de usuario
    const userProfiles: string[] = [];

    if (this.utils.isAdmin()) {
      userProfiles.push('admin');
    }

    if (this.utils.isPerfilApp()) {
      userProfiles.push('perfilApp');
    }

    if (this.utils.isPerfilInfraestructura()) {
      userProfiles.push('perfilInfraestructura');
    }

    // Filtrar los items del menú según los perfiles del usuario
    this.sections.forEach(sec => {
      sec.items = sec.items.filter(item => {
        // si no tiene restricciones, entra
        if (!item.allowedProfiles || !item.allowedProfiles.length) return true;
        // si algún perfil del usuario coincide, entra
        return item.allowedProfiles.some(p => userProfiles.includes(p));
      });
    });
  }

  openHelp() {
    this.dialog.open(HelpDialogComponent, {
      width: '400px',
      autoFocus: false,
    });
  }

  cerrarSesion() {
    this.keycloakService.logout();
  }
}

export interface MenuItem {
  name: string;
  route: string;
  icon: string;
  allowedProfiles?: string[];
}

export interface MenuSection {
  title: string;
  items: MenuItem[];
  expanded?: boolean;
}
