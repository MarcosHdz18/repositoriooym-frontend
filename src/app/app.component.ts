import { Component } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { NavigationEnd, NavigationStart, Router, Event} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('fadeAnimation', [
      transition('* <=> *', [
        style({ opacity: 0 }),
        animate('500ms ease-in', style({ opacity: 2 }))
      ])
    ])
  ]

})
export class AppComponent {
  title = 'repositoriooym-frontend';
  
  isLoading = false;

  constructor(private router: Router) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        this.isLoading = true;
      }
      if (event instanceof NavigationEnd) {
        setTimeout(() => this.isLoading = false, 1200); // pequeño delay para suavidad
      }
    });
  }

}
