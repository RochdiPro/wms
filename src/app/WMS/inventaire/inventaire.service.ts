import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
const infonet = '/ERP/';

@Injectable({
  providedIn: 'root'
})
export class InventaireService {

  constructor(private http: HttpClient) { }
  private gererErreur(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('Une erreur s' + "'" + 'est produite:', error.error.message);
    } else {
      console.error(
        `Code renvoyé par le backend ${error.status}, ` +
        `le contenu était: ${error.error}`);
    }
    return throwError(
      'Veuillez réessayer plus tard.');
  }

    // Obtenir la liste des Articles 
    liste_articles(): Observable<any> {
      return this.http.get(infonet + 'Fiche_Produits', { observe: 'body' }).pipe(catchError(this.gererErreur)
      );
    }
    // article avec id
   Article_Id(id:string):Observable<any> {
    return this.http.get(infonet+'Fiche_Produit/',{
      params: {
        Id_Produit: id,
      },observe: 'body'
    });
  }
  //article avec code 
  Arrticle_CodeBare(code : string) : Observable<any>{
    return this.http.get(infonet + 'Filtre_Fiche_Produit_par_Code/', {
      params: {
        Code: code
      }, observe: 'body'
    });
  }


  //  get lise des locals 
  locals( ) : Observable<any>{
    return this.http.get(infonet + 'Locals', { observe: 'body' }).pipe(catchError(this.gererErreur)
    );
  }

//  get lise des Bon Sorties 
Bon_Sortie( ) : Observable<any>{
  return this.http.get(infonet + 'Bon_Sorties', { observe: 'body' }).pipe(catchError(this.gererErreur)
  );
}
  // creer bon de sortie
  creer_Bon_Sortie(form: any): Observable<Object> {
    return this.http.post(infonet + "/Creer_Bon_Sortie", form);
  }

 
   // get bon   sortie  by id  
   get_Bon_Sortie_By_Id(id: any): Observable<Object> {
    return this.http.get(infonet + "Bon_Sortie", {
      params: {
        Id: id
      }, observe: 'body'
    }).pipe(catchError(this.handleError));
  }

// get information from  bon sortie avec id 
  Detail_Bon_Sortie(Id: any): Observable<any> {

    return this.http.get(infonet + "Detail_Bon_Sortie"
      , {
        params: {
          Id: Id
        }, responseType: 'blob'
      }).pipe(catchError(this.handleError))
  }

  // Supprimer un bon Rejet
  Supprimer_BBon_Sortie(id: any): Observable<Object> {
    return this.http.delete(infonet + "Supprimer_Bon_Sortie", {
      params: {
        Id: id
      }, observe: 'body'
    }).pipe(catchError(this.handleError));
  }
  // filtre bon reception
  filtre (champ1 : any, valeur1 : any, champ2 : any, valeur2 : any, champ3 : any, valeur3 : any )
  {
    return this.http.get(infonet + 'Filtre_Bon_Sortie', {
      params: {
        Champ1: champ1,
        Valeur1: valeur1,
        Champ2: champ2,
        Valeur2: valeur2,
        Champ3: champ3,
        Valeur3: valeur3,
        
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
