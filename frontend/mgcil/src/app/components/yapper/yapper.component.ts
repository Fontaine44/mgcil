import { Component, OnInit } from '@angular/core';
import { SoundButtonComponent } from "./sound-button/sound-button.component";
import { HttpService } from '../../shared/services/http.service';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-yapper',
  standalone: true,
  imports: [FormsModule, SoundButtonComponent],
  templateUrl: './yapper.component.html',
  styleUrl: './yapper.component.scss'
})
export class YapperComponent implements OnInit {
  allButtons: any = [];
  currentButtons: any = null;
  api: string = 'https://mgcil.onrender.com';
  // api: string = 'http://localhost:5000';
  suggestion: string = '';
  searchTerm: string = '';
  searchSubject: Subject<string> = new Subject();
  currentSound?: HTMLAudioElement;

  constructor(
    private httpService: HttpService
  ) {
    this.searchSubject
    .pipe(
      debounceTime(500),
      distinctUntilChanged()
    )
    .subscribe(searchTerm => {
      this.performSearch(searchTerm);
    });
  }

  ngOnInit() {
    this.httpService.get(`${this.api}/sounds`)
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
    this.currentSound = new Audio(`${this.api}/sounds/${this.currentButtons[index].sound}`);
    this.currentSound.play();
  }

  onSearchChange(searchTerm: string) {
    if (searchTerm.length == 0) {
      this.currentButtons = this.allButtons;
    } else {
      this.searchSubject.next(searchTerm);
    }
  }

  performSearch(searchTerm: string) {
    this.currentButtons = this.allButtons.filter((button: any) => {
      return button.name.toLowerCase().includes(searchTerm.toLowerCase());
    });
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
