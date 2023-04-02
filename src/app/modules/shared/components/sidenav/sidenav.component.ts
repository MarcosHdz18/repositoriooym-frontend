import { MediaMatcher } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {

  mobileQuery: MediaQueryList;
  username: any;

  menuNav = [
    { name: "Inicio", route: "home", icon: "home" },
    { name: "Área", route: "area", icon: "account_balance" },
    { name: "Responsable", route: "responsable", icon: "accessibility" },
    { name: "Proyectos", route: "proyecto", icon: "important_devices" }
  ]

  constructor(media: MediaMatcher, private keycloakService: KeycloakService) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
   }

  ngOnInit(): void {
    this.username = this.keycloakService.getUsername();
  }

  cerrarSesion() {
    this.keycloakService.logout();
  }

}
