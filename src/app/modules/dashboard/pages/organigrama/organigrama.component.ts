import { Component, OnInit } from '@angular/core';
import { trigger as animationTrigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-organigrama',
  templateUrl: './organigrama.component.html',
  styleUrls: ['./organigrama.component.css'],
  animations: [
    animationTrigger('fadeAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class OrganigramaComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
