import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-die',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './die.component.html',
  styleUrl: './die.component.scss'
})
export class DieComponent {
  roll: number = 5;
  weightedNumbers: number[] = [];

  constructor() {
    this.createWeightedArray();
  }

  createWeightedArray() {
    const weights = [
      { number: 1, weight: 1 },
      { number: 2, weight: 1 },
      { number: 3, weight: 1 },
      { number: 4, weight: 1 },
      { number: 5, weight: 2 },
      { number: 6, weight: 1 },
    ];

    weights.forEach(({ number, weight }) => {
      for (let i = 0; i < weight; i++) {
        this.weightedNumbers.push(number);
      }
    });
  }

  onRoll() {
    const interval = setInterval(() => {
      this.roll = Math.floor(Math.random() * 6) + 1;
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      this.roll = this.weightedNumbers[
        Math.floor(Math.random() * this.weightedNumbers.length)
      ];
    }, 2000);
  }
}
