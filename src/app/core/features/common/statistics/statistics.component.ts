import { Component } from '@angular/core';
import { HttpsService } from 'app/core/services/https.service';
import {Constants} from "../../../utils/constants";
import { HttpParams } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [
    CommonModule,
    NgbModule
  ],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.scss'
})
export class StatisticsComponent {

  statistics = {
    individualConflict: {
      statuses: [],
      total: 0
    },
    giftsGivenOut: {
      statuses: [],
      total: 0
    },
    groupConflict: {
      statuses: [],
      total: 0
    },
    giftsReceived: {
      statuses: [],
      total: 0
    }
  }

  constructor( private service: HttpsService,){}

  ngOnInit(){
    this.getStatistics()
  }

  getStatistics():void{
    this.service.get(`${Constants.BASE_URL}/dashboard/statistics`, new HttpParams()).subscribe({
      next: (response: any) => {
        this.statistics = response.data
      },
      error: () => {},
    })
  }

}
