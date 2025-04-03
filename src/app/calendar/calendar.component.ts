import { Component, OnInit, OnDestroy, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';

import { Subject, takeUntil } from 'rxjs';

import { CalendarService, Appointment } from './calendar.service';
import { getLocalDateTimeString, generateWeek } from './calendar.utils';

@Component({
  selector: 'app-calendar',
  standalone: true,
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatSelectModule,
    DragDropModule,
  ],
})
export class CalendarComponent implements OnInit, OnDestroy {
  form: FormGroup;
  appointments$;

  weekDays: Date[] = [];
  hours = Array.from({ length: 24 }, (_, i) => i);
  durationOptions = [15, 30, 45, 60, 90, 120];

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private calendarService: CalendarService
  ) {
    this.form = this.fb.group({
      title: ['Hello world', Validators.required],
      start: [getLocalDateTimeString(), Validators.required],
      duration: [30, Validators.required],
    });
    this.appointments$ = this.calendarService.appointments$;
  }

  ngOnInit(): void {
    this.weekDays = generateWeek();

    // Example of reactive form value change if needed later
    this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((val) => {
      // Optional: live validation or dynamic logic
      // console.log('Form changed:', val);
    });
  }

  addAppointment(): void {
    if (this.form.invalid) return;

    const { title, start, duration } = this.form.value;
    const from = new Date(start);
    const to = new Date(from.getTime() + duration * 60 * 1000);

    const appt: Appointment = { title, from, to };
    this.calendarService.addAppointment(appt);

    this.form.reset({
      title: 'Hello world!',
      start: getLocalDateTimeString(),
      duration: 30,
    });
  }

  deleteAppointment(appt: Appointment): void {
    this.calendarService.deleteAppointment(appt);
  }

  getAppointmentsAt(day: Date, hour: number, min: number): Appointment[] {
    return this.calendarService.getAppointmentsAt(day, hour, min);
  }

  drop(event: CdkDragDrop<any>): void {
    const appointment: Appointment = event.item.data;
    const durationMs = appointment.to.getTime() - appointment.from.getTime();

    const newStart = new Date(event.container.data.day);
    newStart.setHours(
      event.container.data.hour,
      event.container.data.min,
      0,
      0
    );
    const newEnd = new Date(newStart.getTime() + durationMs);

    this.calendarService.updateAppointment(appointment, {
      ...appointment,
      from: newStart,
      to: newEnd,
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
