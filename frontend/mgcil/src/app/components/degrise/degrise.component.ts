import { Component, OnInit } from '@angular/core';
import { SoundButtonComponent } from "../yapper/sound-button/sound-button.component";
import { HttpService } from '../../shared/services/http.service';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-degrise',
  standalone: true,
  imports: [FormsModule, SoundButtonComponent],
  templateUrl: './degrise.component.html',
  styleUrl: './degrise.component.scss'
})
export class DegriseComponent implements OnInit {
  allButtons: any = [];
  currentButtons: any = null;
  apiURL: string = environment.apiUrl;
  suggestion: string = '';
  searchTerm: string = '';
  searchSubject: Subject<string> = new Subject();
  currentSound?: HTMLAudioElement;

  constructor(
    private httpService: HttpService,
  ) {
    this.searchSubject
    .pipe(
      debounceTime(500),
      distinctUntilChanged(),
    )
    .subscribe(searchTerm => {
      this.performSearch(searchTerm);
    });
  }

  ngOnInit() {
    this.httpService.get(`${this.apiURL}/degrise`)
      .subscribe((response) => {
        this.allButtons = response;
        this.currentButtons = this.allButtons;
      }
    );
  }

  playSound(index: number) {
    // Stop all the sounds
    this.currentSound?.pause();

    // Start new sound
    if (environment.production) {
      const url = `https://audio.jukehost.co.uk/${this.currentButtons[index].endpoint}`;
      this.currentSound = new Audio(url);
    } else {
      const url = `https://audio.jukehost.co.uk/${this.currentButtons[index].endpoint}`;
      this.currentSound = new Audio(url);
    }

    this.currentSound.play();
  }

  stopSound() {
    this.currentSound?.pause();
  }

  onSearchChange(searchTerm: string) {
    this.searchSubject.next(searchTerm);
  }

  performSearch(searchTerm: string) {
    if (searchTerm.length == 0) {
      this.currentButtons = this.allButtons;
      return;
    }

    this.currentButtons = this.allButtons.filter((button: any) => {
      return button.name.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }
}
