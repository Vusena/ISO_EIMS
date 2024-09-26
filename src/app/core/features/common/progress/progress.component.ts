import {Component, Input} from '@angular/core';
import {MatIconModule} from "@angular/material/icon";
import {MatStepperModule} from "@angular/material/stepper";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-progress',
  standalone: true,
  imports: [
    MatIconModule,
    MatStepperModule,
    NgForOf
  ],
  templateUrl: './progress.component.html',
  styleUrl: './progress.component.scss'
})
export class ProgressComponent {
  @Input() items: any;
}
