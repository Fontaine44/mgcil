import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
// @ts-ignore
import Speech from 'speak-tts';
// @ts-ignore
import { toWords } from 'number-to-words';
// @ts-ignore
import { NumberToLetter } from '@mandarvl/convertir-nombre-lettre';

@Component({
  selector: 'app-translator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './translator.component.html',
  styleUrl: './translator.component.scss'
})
export class TranslatorComponent implements OnInit {
  inputNumber?: number;
  translatedNumber?: string;
  selectedLanguage: string = "en-US";
  speech: Speech = null;
  voices: string[] = [];

  ngOnInit() {
    this.speech = new Speech();
    if(this.speech.hasBrowserSupport()) {
      this.speech.init({
        'volume': 1,
        'lang': 'en-US',
        'rate': 1,
        'pitch': 1,
        'splitSentences': true,
        'listeners': {
          'onvoiceschanged': (voices: any) => {
            this.setVoices(voices);
          }
        }
        }).then((data: any) => {
          this.setVoices(data.voices);
          this.speech.setVoice(this.selectedLanguage == "en-US" ? this.voices[0] : this.voices[1]);
        }).catch((e: any) => {
            console.error("An error occured while initializing : ", e)
        });
    } else {
      this.speech = null;
    }
  }

  onSubmit() {
    this.translatedNumber = "";
    this.speech.cancel();
    this.speech.setLanguage(this.selectedLanguage);
    this.speech.setVoice(this.selectedLanguage == "en-US" ? this.voices[0] : this.voices[1]);

    if (this.inputNumber) {
      this.translatedNumber = this.numberToWords(this.inputNumber);

      this.speech.speak({
        text: this.translatedNumber,
      }).catch((e: any) => {
          console.error("An error occurred :", e) 
      })
    }
  }
  
  setVoices(allVoices: any[]) {
    const enUSVoice = allVoices.find(voice => voice.lang === 'en-US');
    const frCAVoice = allVoices.find(voice => voice.lang === 'fr-FR');
    this.voices = [enUSVoice.name, frCAVoice.name];
  }

  numberToWords(number: number) {
    if (this.selectedLanguage == "en-US") {
      // English
      var words = toWords(number);
      words = words.replace(/fifty/g, "wahty");
      words = words.replace(/five/g, "wah");
      words = words.replace(/seven/g, "wahwah");
    } else {
      // French
      var words = NumberToLetter(number);
      words = words.replace(/cinquante/g, "wahquante");
      words = words.replace(/cinq/g, "wah");
      words = words.replace(/sept/g, "wahwah");
    }

    return words;
  }
}
