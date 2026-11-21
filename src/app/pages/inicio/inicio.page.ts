
import { Component, OnInit, inject } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import {
  barbellOutline,
  calendarOutline,
  newspaperOutline,
  personOutline
} from 'ionicons/icons';

import { AgendaService } from '../../services/agenda.service';
import { Aula } from '../../models/agenda.model';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButton,
    IonIcon,
    DecimalPipe,
    DatePipe,
    RouterLink
  ],
  templateUrl: './inicio.page.html',
  styleUrl: './inicio.page.scss'
})
export class InicioPage implements OnInit {

  private agenda = inject(AgendaService);

  sessoesRestantes = 7;
  mediaSemanal = 3.456;

  nomeAula = 'Nenhuma aula disponível';
  proximaAula: Date | null = null;

  constructor() {
    addIcons({
      barbellOutline,
      calendarOutline,
      newspaperOutline,
      personOutline
    });
  }

  ngOnInit(): void {
    this.buscarProximaAula();
  }

  private buscarProximaAula(): void {
    const agora = new Date();

    let melhorData: Date | null = null;
    let melhorAula: Aula | null = null;

    for (let diaOffset = 0; diaOffset < 7; diaOffset++) {
      const data = new Date(agora);
      data.setDate(agora.getDate() + diaOffset);

      const aulasDoDia = this.agenda.listarAulasPorDia(
        data.getDay()
      );

      for (const aula of aulasDoDia) {
        const [hora, minuto] = aula.inicio.split(':').map(Number);

        const inicioAula = new Date(data);
        inicioAula.setHours(hora, minuto, 0, 0);

        if (
          inicioAula > agora &&
          (!melhorData || inicioAula < melhorData)
        ) {
          melhorData = inicioAula;
          melhorAula = aula;
        }
      }
    }

    if (melhorAula && melhorData) {
      this.nomeAula = melhorAula.nome;
      this.proximaAula = melhorData;
    }
  }
}
