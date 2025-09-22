import { Component, inject, OnInit } from '@angular/core';
import { NgbCalendar, NgbDate, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CurrencyPipe, DatePipe, NgIf, NgFor, NgClass, AsyncPipe } from '@angular/common';
import { MovService } from '../../services/mov.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-ricerca-date',
  templateUrl: './ricerca-date.component.html',
  styleUrl: './ricerca-date.component.css',
  imports: [NgbModule, 
            CurrencyPipe,
            DatePipe,
            NgIf,
            NgFor,
            NgClass,
            AsyncPipe
          ],
})
export class RicercaDateComponent implements OnInit {
  protected movSrv = inject(MovService);
  calendar = inject(NgbCalendar);

	hoveredDate: NgbDate | null = null;
	fromDate: NgbDate = this.calendar.getToday();
	toDate: NgbDate | null = this.calendar.getNext(this.fromDate, 'd', 10);
	movimenti$: Observable<any> | undefined;

  formatDateStruct(date: { year: number; month: number; day: number } | null): string {
    if (!date) return '';
    const dd = String(date.day).padStart(2, '0');
    const mm = String(date.month).padStart(2, '0');
    const yyyy = date.year;
    return `${dd}-${mm}-${yyyy}`;
}

	onDateSelection(date: NgbDate) {
		if (!this.fromDate && !this.toDate) {
			this.fromDate = date;
		} else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
			this.toDate = date;
		} else {
			this.toDate = null;
			this.fromDate = date;
		}
	}

	isHovered(date: NgbDate) {
		return (
			this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate)
		);
	}

	isInside(date: NgbDate) {
		return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
	}

	isRange(date: NgbDate) {
		return (
			date.equals(this.fromDate) ||
			(this.toDate && date.equals(this.toDate)) ||
			this.isInside(date) ||
			this.isHovered(date)
		);
	}

	searchMovimenti() {
		if (this.fromDate && this.toDate) {
			const startDate = `${this.fromDate.year}-${this.fromDate.month}-${this.fromDate.day}`;
			const endDate = `${this.toDate.year}-${this.toDate.month}-${this.toDate.day}`;
			
			this.movimenti$ = this.movSrv.listDateFiltered(startDate, endDate);
		}
	}

	ngOnInit() {
		this.searchMovimenti();
	}
}