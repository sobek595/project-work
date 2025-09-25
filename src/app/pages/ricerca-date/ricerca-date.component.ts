import { Component, inject } from '@angular/core';
import { NgbCalendar, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { MovService } from '../../services/mov.service';
import { Observable } from 'rxjs';
import { FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ricerca-date',
  standalone: false,
  templateUrl: './ricerca-date.component.html',
  styleUrls: ['./ricerca-date.component.css'],
})
export class RicercaDateComponent {
  protected movSrv = inject(MovService);
  calendar = inject(NgbCalendar);
  protected fb = inject(FormBuilder);
  protected router = inject(Router);

  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate = this.calendar.getToday();
  toDate: NgbDate | null = this.calendar.getNext(this.fromDate, 'd', 10);

  movimenti$: Observable<any> | undefined;

  // 🔹 aggiunta: form filtri
  filtersForm = this.fb.group({
    n: new FormControl<number | null>(5),
    formato: ['csv']
  });

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
      
      // 🔹 qui puoi passare anche n e formato se il tuo service lo supporta
      const { n } = this.filtersForm.value;
      console.log(n, startDate, endDate);
      this.movimenti$ = this.movSrv.listDateFiltered(startDate, endDate, n!);
    }
  }

  // 🔹 aggiunta: export con n e formato
  onExport() {
    if (this.fromDate && this.toDate) {
      const startDate = `${this.fromDate.year}-${this.fromDate.month}-${this.fromDate.day}`;
      const endDate = `${this.toDate.year}-${this.toDate.month}-${this.toDate.day}`;
      const { n, formato } = this.filtersForm.value;

	  console.log(n, startDate, endDate, formato);

      this.movSrv.exportMovimentiDate(n!,startDate, endDate, formato!).subscribe(blob => {
        const a = document.createElement('a');
        const url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = `movimenti-date.${formato}`;
        a.click();
        window.URL.revokeObjectURL(url);
      });
    }
  }

  ngOnInit() {
    this.searchMovimenti();
  }
  

  goToDetails(id: string) {
    this.router.navigate(['/movimento', id]);
  }
}
