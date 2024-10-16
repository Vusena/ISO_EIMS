import {Component, Input, Output, EventEmitter} from '@angular/core';
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {MatPaginatorModule} from "@angular/material/paginator";
import {TruncatePipe} from "../../../common/truncate.pipe";

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [
    DatePipe,
    MatPaginatorModule,
    NgForOf,
    NgIf,
    TruncatePipe
  ],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss'
})
export class HistoryComponent {
  @Input() items: any;
  @Output() itemClickedEmitter = new EventEmitter<string>();

  onItemClick(itemId: string) {
    //this.itemClickedEmitter.emit(Number(itemId));
    this.itemClickedEmitter.emit(itemId);
  }
}
