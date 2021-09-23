import { Injectable } from '@angular/core';
 
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
 


const ERP = '/ERP/';
 
@Injectable({
  providedIn: 'root'
})
export class StockageService {
  constructor(private httpClient: HttpClient) {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');

  }

  // get all bon receptions 
  Bon_Receptions(): Observable<any> {
    return this.httpClient.get(ERP + "Bon_Receptions");

  }

  // filtre bon reception
  filtre (champ1 : any, valeur1 : any, champ2 : any, valeur2 : any, champ3 : any, valeur3 : any , champ4 : any, valeur4 : any)
  {
    return this.httpClient.get(ERP + 'Filtre_Bon_Reception', {
      params: {
        Champ1: champ1,
        Valeur1: valeur1,
        Champ2: champ2,
        Valeur2: valeur2,
        Champ3: champ3,
        Valeur3: valeur3,
        Champ4: champ4,
        Valeur4: valeur4
      }, observe: 'body'
    }).pipe(catchError(this.handleError));
  }


  private handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }
}
