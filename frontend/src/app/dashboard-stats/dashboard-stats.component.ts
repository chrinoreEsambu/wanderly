import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventInput, EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import frLocale from '@fullcalendar/core/locales/fr';
import { AllmyservicesService } from '../services/allmyservices.service';

interface Voyage {
  id: number;
  name: string;
  date: string;
  photo?: string;
}

@Component({
  selector: 'app-dashboard-stats',
  standalone: true,
  imports: [CommonModule, FullCalendarModule],
  templateUrl: './dashboard-stats.component.html',
  styleUrl: './dashboard-stats.component.css',
})
export class DashboardStatsComponent implements OnInit {
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
    initialView: 'dayGridMonth',
    locale: frLocale,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,listWeek',
    },
    buttonText: {
      today: "Aujourd'hui",
      month: 'Mois',
      week: 'Semaine',
      day: 'Jour',
      list: 'Liste',
    },
    editable: false,
    selectable: false,
    dayMaxEvents: true,
    weekends: true,
    events: [],
    height: 'auto',
    aspectRatio: 1.8,
    eventClick: this.handleEventClick.bind(this),
  };

  constructor(private voyageService: AllmyservicesService) {}

  ngOnInit(): void {
    this.loadVoyageDates();
  }

  loadVoyageDates(): void {
    this.voyageService.Allvoyages().subscribe({
      next: (data: any) => {
        const events: EventInput[] = data.map((voyage: Voyage) => ({
          id: voyage.id.toString(),
          title: voyage.name,
          start: voyage.date,
          allDay: true,
          backgroundColor: '#3B82F6',
          borderColor: '#2563EB',
          extendedProps: {
            voyageName: voyage.name,
            voyageDate: voyage.date,
          },
        }));
        this.calendarOptions.events = events;
      },
      error: (err) => {
        console.error('Erreur chargement voyages:', err);
      },
    });
  }

  handleEventClick(clickInfo: EventClickArg): void {
    const voyage = clickInfo.event;
    alert(`🚌 ${voyage.title}\n📅 Date: ${voyage.extendedProps['voyageDate']}`);
  }
}
