import {Component, Input, Output, EventEmitter} from '@angular/core';
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {MatPaginatorModule} from "@angular/material/paginator";

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [
    DatePipe,
    MatPaginatorModule,
    NgForOf,
    NgIf
  ],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss'
})
export class HistoryComponent {
  @Input() items: any;
  @Output() itemClickedEmitter = new EventEmitter<number>();

  onItemClick(itemId: number) {
    this.itemClickedEmitter.emit(Number(itemId));
  }
}
