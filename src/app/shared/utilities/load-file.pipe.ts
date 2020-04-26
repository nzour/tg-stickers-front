import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../../environments/environment';

@Pipe({
  name: 'loadFile'
})
export class LoadFilePipe implements PipeTransform {

  transform(filename: string): string {
    return `${environment.apiUrl}/files/${filename}`;
  }

}
