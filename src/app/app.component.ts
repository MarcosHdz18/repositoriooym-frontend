import { Component } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('fadeAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms ease-in', style({ opacity: 2 }))
      ])
    ])
  ]

})
export class AppComponent {
  title = 'repositoriooym-frontend';
  
  isLoading = true;

  ngOnInit() {
    setTimeout(() => this.isLoading = false, 1500); // spinner solo al inicio
  }

}
