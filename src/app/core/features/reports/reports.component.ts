import { Component, OnInit, ViewChild, } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import * as XLSX from 'xlsx';
import { WorkBook, WorkSheet } from 'xlsx';
import { HttpService } from 'app/core/services/http.service';
import { ApiEndPoints } from 'app/core/common/ApiEndPoints';
// import { MatDialog } from '@angular/material/dialog';
import { SuccessComponent } from '../common/success/success.component';
import { DatePipe } from '@angular/common';
import { MatPaginator, PageEvent } from '@angular/material/paginator';


@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
  providers: [DatePipe]
})
export class ReportsComponent implements OnInit {

  errorMessage: any;
  startDate: any;
  closingDate: any;
  searchControl = new FormControl('');
  alertMessage: any;
  nominees: any;
  nomineestaff: any;
  staffNo:any;
  participants: any;
  total_votes: any;
  scheduleForm: FormGroup;
  dataSource: any;
  region: any;
  department: any;
  votes: any;
  totalNominees: number;
  
  length: number;
  pageSize: number = 10;
  pageNumber: number = 0;
  pageSizeOptions=[1,10, 20, 50, 100]
  currentSchedule:any;
  initialStartDate:any;
  summaryReports:any;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private httpService: HttpService, public datePipe: DatePipe, private fb: FormBuilder,
  ) { }
  ngAfterViewInit() {
    // Ensure paginator is initialized before accessing it
    if (this.paginator) {
    }
  }

  ngOnInit(): void {
    this.scheduleForm = this.fb.group({
      startDate: ['', Validators.required], 
      closingDate: ['', Validators.required]
    });

    this.onDateExtend();
    this.getReports();
    this.getAllNominations();
  
  }

  onDateSubmit() {
    if (this.scheduleForm.valid) {
      const startDate = this.datePipe.transform(this.scheduleForm.value.startDate, 'yyyy-MM-dd');
      const endDate = this.datePipe.transform(this.scheduleForm.value.closingDate, 'yyyy-MM-dd');
      const scheduleFormm = {
        startDate,
        endDate,
      };
      this.httpService.postData(`${ApiEndPoints.AWARD_SHEDULES_STORE}`, scheduleFormm,)
        .subscribe({
          next: (res) => {
           
            this.scheduleForm.reset();
            this.alertMessage = res.body.description
            setTimeout(() => {
              this.alertMessage = ''; 
            }, 3000);
            this.onDateExtend()
          },
          error: (err) => {
            this.errorMessage = err.error.description;
            
          }
        });
    }
  }

  onDateExtend(): void {
    this.httpService.get(ApiEndPoints.AWARD_SCHEDULES_SHOW).subscribe({
      next: (res) => {
        this.currentSchedule=res.data;
        
        this.startDate = res.data.startDate;
        this.closingDate = res.data.endDate;
     

        this.startDate = new Date(res.data.startDate);
        this.closingDate = new Date(res.data.endDate);
        this.initialStartDate = this.startDate;
     

        this.scheduleForm.patchValue({
          startDate: this.startDate,
          closingDate: this.closingDate,
        });
      this.scheduleForm.get('startDate').disable();
      },
      error: (error) => {
      },
    });

   }

   // Method to handle form submission for extending schedule
onExtendSubmit(): void {
  if (this.scheduleForm.valid) {
    const updatedStartDate = this.initialStartDate;
    const updatedEndDate = this.scheduleForm.value.closingDate;
    const id = this.currentSchedule.id;
    
    const updatedSchedule = {
      startDate: this.datePipe.transform(updatedStartDate, 'yyyy-MM-dd'),
      endDate: this.datePipe.transform(updatedEndDate, 'yyyy-MM-dd'),
    };
    this.httpService.update(`${ApiEndPoints.AWARD_SCHEDULES_UPDATE}/${id}`, updatedSchedule).subscribe({
      next: (res) => {
        this.alertMessage = res.body.description
        setTimeout(() => {
          this.alertMessage = ''; 
        }, 3000);
        this.onDateExtend()
      },
      error: (error) => {
        // Handle error
        this.errorMessage=error.error.description
      },
    });
  }

  
}



  // GETTING ALL REPORTS
  getReports(): void {
    this.httpService.get(ApiEndPoints.AWARD_NOMINATION_REPORTS_nominees).subscribe({
      next: (res) => {
        this.nominees = res.count
      },
      error: (error) => {
        
      },
    });

    this.httpService.get(ApiEndPoints.AWARD_NOMINATION_REPORTS_participants).subscribe({
      next: (res) => {
        this.participants = res.count
      },
      error: (error) => {
       
      },
    })

    this.httpService.get(ApiEndPoints.AWARD_NOMINATION_REPORTS_participants).subscribe({
      next: (res) => {
        this.total_votes = res.count
      },
      error: (error) => {
      },
    })
  }

  getAllNominations(): void {
    this.httpService.getAllnominees(ApiEndPoints.AWARD_NOMINATION_INDEX, null, this.pageNumber, this.pageSize).subscribe({
      next: (res) => {
        this.dataSource = res.data.content;
       
        this.length = res.data.totalElements;

        this.dataSource.forEach(item => {
          this.region = item.region;
          this.department = item.department;
          this.nomineestaff = item.name;
          this.votes = item.count;
          this.staffNo=item.staffNo;

        });
      },
      error: (error) => {
      },
    });
  
  }
  handlePage(event: PageEvent) {
    this.pageNumber = event.pageIndex; // Update current page number
    this.pageSize = event.pageSize; // Update items per page
    this.getAllNominations(); // Fetch data for the new page
  }


  exportExcell(){
    this.httpService.get(ApiEndPoints.AWARD_NOMINATION_SUMMARY_REPORT).subscribe({
      next: (res) => {
       this.summaryReports=res.data;
       const data = this.summaryReports.map(item => {
        return {
          Nominee: item.name,
          "Staff No.":item.staffNo,
          Votes: item.count,
          Region: item.region,
          Department: item.department,
          "Service Length":item.serviceLength,
          Integrity:item.integrity,
          Responsibility: item.responsibility,
          Communication: item.communication,
          "Core Values":item.coreValues,
          Weight:item.weight,
         
        };
      });
         const ws: WorkSheet = XLSX.utils.json_to_sheet(data);
        const wb: WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        /* save to file */
        XLSX.writeFile(wb, 'report.xlsx');
        return;
      },
      error: (error) => {
      },
    });
  }
}
