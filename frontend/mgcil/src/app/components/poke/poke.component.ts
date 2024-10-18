import { Component, OnInit } from '@angular/core';
import { debounceTime, Subject } from 'rxjs';
import { HttpService } from '../../shared/services/http.service';
import { environment } from '../../../environments/environment';
import { AlertService } from '../../shared/services/alert.service';

@Component({
  selector: 'app-poke',
  standalone: true,
  imports: [],
  templateUrl: './poke.component.html',
  styleUrl: './poke.component.scss',
})
export class PokeComponent implements OnInit {
  pokeSubject = new Subject<void>();

  delegations = [
    {
      id: 1,
      name: 'mgcil',
      logo: 'https://jeuxdegenie.qc.ca/wp-content/uploads/2024/07/mcgill.png',
      disabled: true,
    },
    {
      id: 2,
      name: 'Conco',
      logo: 'https://jeuxdegenie.qc.ca/wp-content/uploads/2024/07/concordia.png',
      disabled: true,
    },
    {
      id: 3,
      name: 'Laval',
      logo: 'https://jeuxdegenie.qc.ca/wp-content/uploads/2024/07/laval2025.png',
      disabled: true,
    },
    {
      id: 4,
      name: 'Drummond',
      logo: 'https://jeuxdegenie.qc.ca/wp-content/uploads/2024/07/drummondville.png',
      disabled: true,
    },
    {
      id: 5,
      name: 'ETS',
      logo: 'https://jeuxdegenie.qc.ca/wp-content/uploads/2024/07/ets.png',
      disabled: true,
    },
    {
      id: 6,
      name: 'LA Poly',
      logo: 'https://jeuxdegenie.qc.ca/wp-content/uploads/2024/07/epm.png',
      disabled: true,
    },
    {
      id: 7,
      name: 'Sherby',
      logo: 'https://jeuxdegenie.qc.ca/wp-content/uploads/2024/07/sherb2025.png',
      disabled: true,
    },
    {
      id: 8,
      name: 'UQAC',
      logo: 'https://jeuxdegenie.qc.ca/wp-content/uploads/2024/07/chicoutimi.png',
      disabled: true,
    },
    {
      id: 9,
      name: 'Rimoncton',
      logo: 'https://jeuxdegenie.qc.ca/wp-content/uploads/2024/07/rimo.jpeg.png',
      disabled: true,
    },
    {
      id: 10,
      name: 'ITR',
      logo: 'https://jeuxdegenie.qc.ca/wp-content/uploads/2024/07/troisrivieres.png',
      disabled: true,
    },
    {
      id: 11,
      name: 'UQAT',
      logo: 'https://jeuxdegenie.qc.ca/wp-content/uploads/2024/07/uqat.png',
      disabled: true,
    },
    {
      id: 12,
      name: 'UQOttawa',
      logo: 'https://jeuxdegenie.qc.ca/wp-content/uploads/2024/07/uo_uqo.png',
      disabled: true,
    },
    {
      id: 13,
      name: 'CO',
      logo: 'CO.png',
      disabled: true,
    }
  ]

  loading: boolean = false;
  userDelegation: number | null = null;
  userModalChoice: number = 0;
  pokedDelegations: any = [];

  constructor(
    private httpService: HttpService,
    private alertService: AlertService
  ) {
    this.pokeSubject.pipe(
      debounceTime(1000)
    ).subscribe(() => {
      this.loading = true;
      this.httpService.post(`${environment.apiUrl}/poke`,
        { 
          pokee_ids: this.pokedDelegations,
          poker_id: this.userDelegation
        }
      ).subscribe({
        next: (response) => {
          this.updateDelegations(response);
        },
        error: (error) => {
          for (const pokedDelegation of this.pokedDelegations) {
            this.delegations[pokedDelegation-1].disabled = false;
          }
          console.error(error);
          this.pokedDelegations = [];
          this.alertService.addAlert('danger', 'Error sending poke womp womp');
          this.loading = false;
        },
        complete: () => {
          this.pokedDelegations = [];
          this.loading = false;
        }
      });
    });
  }

  ngOnInit() {
    this.fetchDelegations();

    const storedDelegation = localStorage.getItem('userDelegation');
    if (storedDelegation) {
      this.userDelegation = parseInt(storedDelegation, 10);
    }
  }

  fetchDelegations() {
    this.httpService.get(`${environment.apiUrl}/poke`).subscribe({
      next: (response) => {
        this.updateDelegations(response);
      },
      error: (error) => {
        console.error(error);
        this.alertService.addAlert('danger', 'Error fetching delegations womp womp');
      }
    });
  }

  updateDelegations(response: any) {
    this.delegations = this.delegations.map(delegation => {
      const responseDelegation = response.find((responseDelegation: any) => responseDelegation.id === delegation.id);
      return { ...delegation, disabled: responseDelegation.disabled };
    });
  }

  selectDelegation(id: number) {
    this.userDelegation = id;
    localStorage.setItem('userDelegation', id.toString());
  }

  sendPoke(id: number) {
    this.delegations[id-1].disabled = true;
    this.pokedDelegations.push(id);
    this.pokeSubject.next();
  }
}
