import { MediaMatcher } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { UtilsService } from '../../services/utils.service';

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

  inicioMenu = [
    { name: "Inicio", route: "home", icon: "home" }, 
  ]

  systemNav = [
    { name: "Departamentos", route: "area", icon: "account_balance" },
    { name: "Responsables", route: "responsable", icon: "accessibility" },
    { name: "Proyectos", route: "proyecto", icon: "important_devices" }
  ];

  infoNav = [
  
    { name: "Misión", route: "mision", icon: "flag" },
    { name: "Visión", route: "vision", icon: "visibility" },
    { name: "Objetivos", route: "objetivos", icon: "track_changes" },
  ];



  constructor(media: MediaMatcher, private keycloakService: KeycloakService, private utils: UtilsService) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
   }

  ngOnInit(): void {
    this.username = this.keycloakService.getUsername();
    this.isAdmin = this.utils.isAdmin();
    this.isPerfilApp = this.utils.isPerfilApp();
  }

  cerrarSesion() {
    this.keycloakService.logout();
  }

}
