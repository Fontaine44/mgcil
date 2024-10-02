import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
// @ts-ignore
import { toWords } from 'number-to-words';
// @ts-ignore
import { NumberToLetter } from '@mandarvl/convertir-nombre-lettre';
import { HttpService } from '../../shared/services/http.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-translator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './translator.component.html',
  styleUrl: './translator.component.scss'
})
export class TranslatorComponent {
  inputNumber?: number;
  translatedNumber?: string;
  selectedLanguage: string = "en-GB";
  voices: any[] = [
    { languageCode: "en-GB", name: "en-GB-Standard-D" },
    { languageCode: "fr-CA", name: "fr-CA-Standard-A" }
  ];
  isSpeechDisabled = false;

  constructor(private httpService: HttpService) {}

  onSubmit() {
    this.translatedNumber = "";

    if (this.inputNumber) {
      this.translatedNumber = this.numberToWords(this.inputNumber);
    }
  }

  numberToWords(number: number) {
    if (this.selectedLanguage == "en-GB") {
      // English
      var words = toWords(number);
      words = words.replace(/fifty/g, "wahty");
      words = words.replace(/fifteen/g, "wahteen");
      words = words.replace(/five/g, "wah");
      words = words.replace(/seven/g, "wahwah");
    } else {
      // French
      var words = NumberToLetter(number);
      words = words.replace(/cinquante/g, "wahquante");
      words = words.replace(/cinq/g, "wah");
      words = words.replace(/quinze/g, "winze");
      words = words.replace(/sept/g, "wahwah");
    }

    return words;
  }

  onSpeech() {
    this.httpService.post(`https://texttospeech.googleapis.com/v1beta1/text:synthesize?key=${environment.googleApiKey}`,
      {
        "input": {
          "text": this.translatedNumber
          
        },
        "voice": this.voices.find(voice => voice.languageCode == this.selectedLanguage),
        "audioConfig": {
          "audioEncoding": "MP3"
          
        }
      }
    ).subscribe((response) => {
      const audioBlob = this.base64ToBlob(response.audioContent, 'audio/mp3');
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
    });

    this.isSpeechDisabled = true;

    setTimeout(() => {
      this.isSpeechDisabled = false;
    }, 10000);
  }

  base64ToBlob(base64: string, contentType: string): Blob {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: contentType });
  }
}
