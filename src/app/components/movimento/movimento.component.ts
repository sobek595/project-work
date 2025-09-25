import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Movimento } from '../../entities/Movimento';

@Component({
  selector: 'app-movimento',
  standalone: false,
  templateUrl: './movimento.component.html',
  styleUrl: './movimento.component.css'
})
export class MovimentoComponent {

   @Input()
  mov!: Movimento;

  @Output()
  details = new EventEmitter<string>();

  onDetails() {
    this.details.emit(this.mov._id!);
  }

}
