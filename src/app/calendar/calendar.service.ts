import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Appointment {
  title: string;
  from: Date;
  to: Date;
}

@Injectable({ providedIn: 'root' })
export class CalendarService {
  private appointmentsSubject = new BehaviorSubject<Appointment[]>([]);
  appointments$ = this.appointmentsSubject.asObservable();

  get appointments(): Appointment[] {
    return this.appointmentsSubject.value;
  }

  addAppointment(appt: Appointment) {
    this.appointmentsSubject.next([...this.appointments, appt]);
  }

  deleteAppointment(target: Appointment) {
    this.appointmentsSubject.next(
      this.appointments.filter((appt) => appt !== target)
    );
  }

  updateAppointment(original: Appointment, updated: Appointment) {
    this.appointmentsSubject.next(
      this.appointments.map((appt) => (appt === original ? updated : appt))
    );
  }

  getAppointmentsAt(day: Date, hour: number, min: number): Appointment[] {
    return this.appointments.filter(
      (appt) =>
        appt.from.getDay() === day.getDay() &&
        appt.from.getHours() === hour &&
        appt.from.getMinutes() >= min &&
        appt.from.getMinutes() < min + 15
    );
  }
}
