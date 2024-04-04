import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiEndPoints } from 'app/core/common/ApiEndPoints';
// import { Environment } from 'app/core/environments/environment';
import { environment } from 'environments/environment.prod';

import { HttpService } from 'app/core/services/http.service';
import { Observable } from 'rxjs';





@Component({
  selector: 'app-gifts-given-out',
  templateUrl: './gifts-given-out.component.html',
  styleUrls: ['./gifts-given-out.component.scss'],
  encapsulation: ViewEncapsulation.None 

  
})
export class GiftsGivenOutComponent implements OnInit {

  secondFormGroup: FormGroup;
  firstFormGroup: FormGroup;
  isLinear: boolean;

  dataSource:any;
  giftsHistoryData: any = [];
  // recipient: any;
 
  
  constructor(private formBuilder: FormBuilder, private httpService:HttpService) {

    this.secondFormGroup = this.formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getGiftsGivenOut();
  }
  
  getGiftsGivenOut(): void {
    this.httpService.get(ApiEndPoints.GIFTS_GIVEN_OUT).subscribe({
      next: (data) => {
        this.dataSource = data;

       this.giftsHistoryData=this.dataSource.data.content
      //  this.recipient = this.giftsHistoryData.map(item => item.recipient);
       
        console.log("Gifts given out history", this.dataSource);

        console.log("Content ",this.giftsHistoryData )

        // console.log("Recipient: ", this.recipient); 
      },
      error: (error) => {
      
        console.error("There was an error!", error);
      },
    });
  }

  }



