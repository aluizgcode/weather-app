import { Component, OnDestroy, OnInit } from '@angular/core';
import { WeatherService } from '../../services/weather.service';
import { WeatherDatas } from 'src/app/models/interfaces/WeatherDatas';
import { Subject, takeUntil } from 'rxjs';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-weather-home',
  templateUrl: './weather-home.component.html',
  styleUrls: []
})
export class WeatherHomeComponent implements OnInit, OnDestroy{
  private readonly destroy$: Subject<void> = new Subject();
  public weatherDatas!: WeatherDatas;
  public searchIcon = faMagnifyingGlass;
  public initialCityName = 'Rio de Janeiro';

  constructor(private service: WeatherService) {}

  // inicializa o componente
  ngOnInit(): void {
    this.getWeatherData(this.initialCityName);
  }

  getWeatherData(cityname: string): void {
    this.service.getWeatherData(cityname)
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (response) => {
          // && > valida retorno do objeto (response) é valido e diferente de nulo. Funciona igual if
          response && (this.weatherDatas = response);
          console.log(this.weatherDatas)
        },
        error: (error) => {
          console.log(error)
        },
      });
  }

  onSubmit(): void {
    console.log('Iniciando o metodo onSubmit()')
    this.getWeatherData(this.initialCityName);
    this.initialCityName = '';
  }

  // finaliza / desmonta o componente ao sair para outra rota. funciona tipo um finaly. Evitar vazamento de memoria
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
