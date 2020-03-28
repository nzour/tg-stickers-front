import { Component } from '@angular/core';
import { Guid } from '../../shared/types';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {

  constructor() { }

  log(values: Guid[]) {
    console.log(values);
  }

}
