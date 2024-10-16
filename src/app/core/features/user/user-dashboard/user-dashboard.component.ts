import {HttpParams} from '@angular/common/http';
import {Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {AuthService } from 'app/core/services/auth.service';
import {Constants } from 'app/core/utils/constants';
import {PageEvent} from "@angular/material/paginator";
import {HttpsService} from "../../../services/https.service";

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.scss',
  encapsulation: ViewEncapsulation.None,

})
export class UserDashboardComponent implements OnInit {
  @ViewChild('nocontent') nocontent: TemplateRef<any>;
  @ViewChild('content') content: TemplateRef<any>;
  @ViewChild('colreview') colreview: TemplateRef<any>;
  @ViewChild('CoIISupReview') CoIISupReview: TemplateRef<any>;


  history: any;
  page = 0;
  size = 4;
  length = 0;
  progress: any;
  declaration: any;
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
  notifications: any[] = [];
  headers: any;
  title: any;
  description: any;
  selectedNotification: any;
  showLateDeclarationUI: boolean;
  declarationForm: FormGroup;
  conflictOfInterest: any;
  conflictOfInterestControl = new FormControl(null);
  assignmentId: number;
  date: any;
  remarksForm: FormGroup;
  isLoading: boolean = false;
  isSubmitting = false;
  individualRemarks:FormGroup;
  user: any;


  constructor(
    private service: HttpsService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.progress = [
      { title: 'Once you declare', description: 'This will be your progress bar to track which stage the declaration is at.' },
      { title: '', description: '' },
    ];

    this.getUser();
    this.getStatistics();
    this.getHistory();
  }


  getUser(): void {
    this.user = this.authService.getLoggedInUser();
  }

  getStatistics():void{
    this.service.get(`${Constants.BASE_URL}/dashboard/statistics`, new HttpParams()).subscribe({
      next: (response: any) => {
        this.statistics = response.data
      },
      error: () => {},
    })
  }

  getHistory() {
    const params = new HttpParams({
      fromObject: { page: this.page, size: this.size }
    });

    this.service.get(`${Constants.BASE_URL}/dashboard/declarations`, params).subscribe({
      next: (response: any) => {
        this.history = response.data.content;
        this.length = response.data.totalItems;
      },
      error: () => {},
    });
  }

  handlePageEvent(e: PageEvent) {
    this.length = e.length;
    this.size = e.pageSize;
    this.page = e.pageIndex;
    this.getHistory();
  }

  onHistoryItemClick(url: string): void {
    this.getProgress(url);
  }

  getProgress(url: string) {
    this.service.get(`${Constants.BASE_URL}/${url}`, new HttpParams()).subscribe({
      next: (response: any) => {
        this.progress = response.data.progress;
      },
      error: () => {},
    });
  }
}

