import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(private keycloakService: KeycloakService) { }

  /**
   * Metodo que sera utilizado para obtener los roles asignados a un usuario
   * @returns roles del usuario mediante el servicio de keycloak
   */
  getRoles() {
    return this.keycloakService.getUserRoles();
  }

  /**
   * Metodo que se utilizara para filtrar o extraer el role de admin
   * @returns true o false si en el arreglo encuentra rol admin
   */
  isAdmin() {
    let roles = this.keycloakService.getUserRoles().filter( role => role == 'admin');

    if (roles.length > 0) {
      return true;      
    } else {
      return false;
    }
  }

  isEdit() {
    let roles = this.keycloakService.getUserRoles().filter(role => role == 'edit-user');

    if (roles.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  isPerfilApp() {
    let roles = this.keycloakService.getUserRoles().filter(role => role == 'perfil-app');

    if (roles.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  isPerfilInfraestructura() {
    let roles = this.keycloakService.getUserRoles().filter(role => role == 'perfil-infraestructura');

    if (roles.length > 0) {
      return true;
    } else {
      return false;
    }
  }
}
