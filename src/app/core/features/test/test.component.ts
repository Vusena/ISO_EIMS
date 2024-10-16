import { Component } from '@angular/core';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [],
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss'
})
export class TestComponent {


  //   errorMessage:any;
//  startDate:any;
//   closingDate:any; 
//   searchControl = new FormControl('');
//   alertMessage:any;
//   nominees:any;
//   nomineestaff:any;
//   participants:any;
//   total_votes:any;
//   scheduleForm: FormGroup;
//   dataSource:any;
//   testt:any="Eunice";
//   region:any;
//   department:any;
//   votes:any;
  

// constructor(private httpService:HttpService, private datePipe: DatePipe, private fb: FormBuilder,
//   private dialog: MatDialog){}



ngOnInit(): void {
  // this.scheduleForm = this.fb.group({
  //   startDate: ['',  Validators.required], // You can set initial values here if needed
  //   closingDate: ['', Validators.required]
  // });

  // this. onDateExtend();
  // this.getReports();
  // this.getAllNominations();
}

onDateSubmit() {
//   if (this.scheduleForm.valid) {
//     console.log('Raw form values:', this.scheduleForm.value);
//     const startDate = this.datePipe.transform(this.scheduleForm.value.startDate, 'yyyy-MM-dd');
//     console.log('Transformed start date:', startDate);
//     const endDate = this.datePipe.transform(this.scheduleForm.value.closingDate, 'yyyy-MM-dd');
//     console.log('Transformed closing date:', endDate);
//      const scheduleFormm = {
//       startDate,
//       endDate,
//     };
// console.log('This is the form', scheduleFormm)
//     this.httpService.postData(`${ApiEndPoints.AWARD_SHEDULES_STORE}`, scheduleFormm,)
//     .subscribe({
//       next: (res) => {
//         console.log(res)
//         // Handle successful response here
//         console.log("Response", res)
//         // this.successAlert()
//         this.scheduleForm.reset();
//         this.alertMessage=res.body.description
//       },
//       error: (err) => {
//         this.errorMessage=err.error.description;
//         console.log(this.errorMessage)
//         // Handle error here
//       }
//     });
//   }
}

onDateExtend(): void {
//   this.httpService.get(ApiEndPoints.AWARD_SCHEDULES_SHOW).subscribe({
//     next: (res) => {
//       console.log(res)
//      this.dataSource=res.data
//      console.log(this.dataSource);
//      this.startDate = res.data.startDate;
//     this.closingDate = res.data.endDate;

//     this.startDate = this.datePipe.transform(res.data.startDate, 'dd-MM-yyyy');
//     this.closingDate = this.datePipe.transform(res.data.endDate, 'dd-MM-yyyy');

//    console.log('startDate:', this.startDate);
//     console.log('closingDate:', this.closingDate);

//  console.log(this.scheduleForm)

//     this.scheduleForm.patchValue({
//       startDate: this.startDate,
//       closingDate: this.closingDate,
      
//   });
//   console.log("SheduleForm after patching",this.scheduleForm)
//   console.log("SheduleForm after patching",this.scheduleForm.value)
//   console.log("SheduleForm after patching",this.scheduleForm.value.startDate)
//     },
//     error: (error) => {
    
//       console.error("There was an error!", error);
//     },
//   });
}


// GETTING ALL REPORTS
getReports(): void {
//   this.httpService.get(ApiEndPoints.AWARD_NOMINATION_REPORTS_nominees).subscribe({
//     next: (res) => {
// // console.log(res)
// this.nominees=res.count
// // console.log(this.nominees)
//     },
//     error: (error) => {
//       console.error("There was an error!", error);
//     },
//   });

//   this.httpService.get(ApiEndPoints.AWARD_NOMINATION_REPORTS_participants).subscribe({
//     next: (res) => {
//       // console.log(res)
//       this.participants=res.count
//       // console.log(this.participants)
//           },
//           error: (error) => {
//             console.error("There was an error!", error);
//           },
//   })

//   this.httpService.get(ApiEndPoints.AWARD_NOMINATION_REPORTS_participants).subscribe({
//     next: (res) => {
//       // console.log(res)
//       this.total_votes=res.count
//       // console.log(this.total_votes)
//           },
//           error: (error) => {
//             console.error("There was an error!", error);
//           },
//   })
}

getAllNominations(){
// this.httpService.get(ApiEndPoints.AWARD_NOMINATION_INDEX).subscribe({
//   next: (res) => {
//     this.dataSource = res.data.content; 
//     console.log(res)
//     console.log('dataSource', this.dataSource)

//     this.dataSource.forEach(item => {
//       // Extracting variables from each item
//       this.region = item.region;
//       this.department = item.department;
//       this.nomineestaff=item.staff
//       this.votes=item.count

//        });
//   },
//   error: (error) => {
  
//     console.error("There was an error!", error);
//   },
// });
}
}
