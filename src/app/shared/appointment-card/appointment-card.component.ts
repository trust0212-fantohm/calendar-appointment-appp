import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-appointment-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  template: './appointment-card.component.html',
})
export class AppointmentCardComponent {
  @Input() title = '';
  @Input() date: Date = new Date();
  @Output() delete = new EventEmitter<void>();
}
