import { Pipe, PipeTransform } from '@angular/core';
import { Timestamp } from '../types';
import * as moment from 'moment';

@Pipe({
  name: 'formatDate'
})
export class FormatDatePipe implements PipeTransform {

  transform(unixTimestamp: Timestamp): string {
    return moment.unix(unixTimestamp).format('DD.MM.YYYY HH:mm:ss');
  }

}
