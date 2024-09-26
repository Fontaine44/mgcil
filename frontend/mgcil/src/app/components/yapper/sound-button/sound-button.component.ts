import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-sound-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sound-button.component.html',
  styleUrl: './sound-button.component.scss'
})
export class SoundButtonComponent {
  @Input() name: string = 'No name';
  @Input() sound: string = 'wompwomp';
  @Input() color: string = 'red';
  @Input() size: 'sm' | 'lg' = 'sm';

  @Output() buttonClicked: EventEmitter<void> = new EventEmitter<void>();
  
  @ViewChild('button', { static: true }) button: any;

  onClickStart() {
    this.buttonClicked.emit();

    const buttonElement = this.button.nativeElement as HTMLElement;
    if (this.size === 'sm') {
      buttonElement.style.backgroundPosition = '-109px -5px';
    } else {
      buttonElement.style.backgroundPosition = '-215px -5px';
    }
  }

  onClickEnd() {
    const buttonElement = this.button.nativeElement as HTMLElement;
    buttonElement.style.backgroundPosition = '-5px -5px';
  }
}
