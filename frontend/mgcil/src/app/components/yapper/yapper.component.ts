import { Component, OnInit } from '@angular/core';
import { SoundButtonComponent } from "./sound-button/sound-button.component";
import { HttpService } from '../../shared/services/http.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-yapper',
  standalone: true,
  imports: [FormsModule, SoundButtonComponent],
  templateUrl: './yapper.component.html',
  styleUrl: './yapper.component.scss'
})
export class YapperComponent implements OnInit {
  buttons: any = null;
  // api: string = 'https://mgcil.onrender.com';
  api: string = 'http://localhost:5000';
  suggestion: string = '';
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

  onSubmit() {
    if (this.suggestion) {
      this.sendSuggestion(this.suggestion);
    }
    this.suggestion = '';
  }

  sendSuggestion(suggestion: string) {
    this.httpService.post(`${this.api}/suggestions`, { suggestion }).subscribe();
  }
}
