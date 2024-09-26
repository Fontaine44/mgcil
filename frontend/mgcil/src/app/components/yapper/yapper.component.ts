import { Component, OnInit } from '@angular/core';
import { SoundButtonComponent } from "./sound-button/sound-button.component";
import { HttpService } from '../../shared/services/http.service';

@Component({
  selector: 'app-yapper',
  standalone: true,
  imports: [SoundButtonComponent],
  templateUrl: './yapper.component.html',
  styleUrl: './yapper.component.scss'
})
export class YapperComponent implements OnInit {
  buttons: any = null;
  api: string = 'http://localhost:5000/';
  currentSound?: HTMLAudioElement;

  constructor(
    private httpService: HttpService
  ) {}

  ngOnInit() {
    this.httpService.get(`${this.api}/sounds`)
      .subscribe((response) => {
        this.buttons = response;
      }
    );
  }

  playSound(index: number) {
    // Stop all the sounds
    this.currentSound?.pause();

    // Start new sound
    this.currentSound = new Audio(`${this.api}/sounds/${this.buttons[index].sound}`);
    this.currentSound.play();
  }
}
