import { Component } from '@angular/core';
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
import { BehaviorSubject } from 'rxjs';

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
export class CalendarComponent {
  form: FormGroup;
  appointments$ = new BehaviorSubject<
    { title: string; from: Date; to: Date }[]
  >([]);

  weekDays: Date[] = [];
  hours = Array.from({ length: 24 }, (_, i) => i);

  durationOptions = [15, 30, 45, 60, 90, 120];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      title: ['Hello world', Validators.required],
      start: [this.getLocalDateTimeString(), Validators.required],
      duration: [30, Validators.required],
    });
    this.generateWeek();
  }

  private getLocalDateTimeString(date = new Date()) {
    const localDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    );
    return localDate.toISOString().slice(0, 16); // e.g. "2025-03-31T10:30"
  }

  generateWeek() {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    this.weekDays = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      return date;
    });
  }

  addAppointment() {
    if (this.form.invalid) return;
    const { title, start, duration } = this.form.value;
    const from = new Date(start);
    const to = new Date(from.getTime() + duration * 60 * 1000);
    this.appointments$.next([...this.appointments$.value, { title, from, to }]);
    this.form.reset({
      title: 'Hello world!',
      start: this.getLocalDateTimeString(),
      duration: 30,
    });
  }

  deleteAppointment(apptToDelete: { title: string; from: Date; to: Date }) {
    this.appointments$.next(
      this.appointments$.value.filter((appt) => appt !== apptToDelete)
    );
  }

  getAppointmentsAt(day: Date, hour: number, min: number) {
    return this.appointments$.value.filter((appt) => {
      return (
        appt.from.getDay() === day.getDay() &&
        appt.from.getHours() === hour &&
        appt.from.getMinutes() >= min &&
        appt.from.getMinutes() < min + 15
      );
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  drop(event: CdkDragDrop<any>) {
    console.log({ event });

    const appointment = event.item.data;
    const durationMs =
      new Date(appointment.to).getTime() - new Date(appointment.from).getTime();
    const newStart = new Date(event.container.data.day);
    newStart.setHours(
      event.container.data.hour,
      event.container.data.min,
      0,
      0
    );
    const newEnd = new Date(newStart.getTime() + durationMs);

    const updated = this.appointments$.value.map((appt) =>
      appt === appointment ? { ...appt, from: newStart, to: newEnd } : appt
    );
    this.appointments$.next(updated);
  }
}
