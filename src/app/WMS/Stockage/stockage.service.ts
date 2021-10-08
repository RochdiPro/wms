import { Injectable } from '@angular/core';
 
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http'
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
 


const ERP = '/ERP/';
 
@Injectable({
  providedIn: 'root'
})
export class StockageService {

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
      return this.http.get(ERP + 'Fiche_Produits', { observe: 'body' }).pipe(catchError(this.gererErreur)
      );
    }
    // article avec id
   Article_Id(id:string):Observable<any> {
    return this.http.get(ERP+'Fiche_Produit/',{
      params: {
        Id_Produit: id,
      },observe: 'body'
    });
  }
  //article avec code 
  Arrticle_CodeBare(code : string) : Observable<any>{
    return this.http.get(ERP + 'Filtre_Fiche_Produit_par_Code/', {
      params: {
        Code: code
      }, observe: 'body'
    });
  }


  //  get lise des locals 
  locals( ) : Observable<any>{
    return this.http.get(ERP + 'Locals', { observe: 'body' }).pipe(catchError(this.gererErreur)
    );
  }

//  get lise des Bon Sorties 
Bon_Sortie( ) : Observable<any>{
  return this.http.get(ERP + 'Bon_Sorties', { observe: 'body' }).pipe(catchError(this.gererErreur)
  );
}

Bon_transfert( ) : Observable<any>{
  return this.http.get(ERP + 'Bon_Transferts', { observe: 'body' }).pipe(catchError(this.gererErreur)
  );
}

  // creer bon de sortie
  creer_Bon_Sortie(form: any): Observable<Object> {
    return this.http.post(ERP + "/Creer_Bon_Sortie", form);
  }

 
   // get bon   sortie  by id  
   get_Bon_Sortie_By_Id(id: any): Observable<Object> {
    return this.http.get(ERP + "Bon_Sortie", {
      params: {
        Id: id
      }, observe: 'body'
    }).pipe(catchError(this.handleError));
  }

// get information from  bon sortie avec id 
  Detail_Bon_Sortie(Id: any): Observable<any> {

    return this.http.get(ERP + "Detail_Bon_Sortie"
      , {
        params: {
          Id: Id
        }, responseType: 'blob'
      }).pipe(catchError(this.handleError))
  }

  // Supprimer un bon sortie
  Supprimer_BBon_Sortie(id: any): Observable<Object> {
    return this.http.delete(ERP + "Supprimer_Bon_Sortie", {
      params: {
        Id: id
      }, observe: 'body'
    }).pipe(catchError(this.handleError));
  }


   // Supprimer un bon transfert
   Supprimer_Bon_transfert(id: any): Observable<Object> {
    return this.http.delete(ERP + "Supprimer_Bon_Transfert", {
      params: {
        Id: id
      }, observe: 'body'
    }).pipe(catchError(this.handleError));
  }

  

  // filtre bon reception
  filtre (champ1 : any, valeur1 : any, champ2 : any, valeur2 : any, champ3 : any, valeur3 : any )
  {
    return this.http.get(ERP + 'Filtre_Bon_Sortie', {
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

  // filtre bon transfert 
  filtre_transfert(champ1 : any, valeur1 : any, champ2 : any, valeur2 : any, champ3 : any, valeur3 : any )
  {
    return this.http.get(ERP + 'Filtre_Bon_Transfert', {
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

  // get all bon receptions 
  Bon_Receptions(): Observable<any> {
    return this.http.get(ERP + "Bon_Receptions");

  }

  // filtre bon reception
  filtrereception  (champ1 : any, valeur1 : any, champ2 : any, valeur2 : any, champ3 : any, valeur3 : any , champ4 : any, valeur4 : any)
  {
    return this.http.get(ERP + 'Filtre_Bon_Reception', {
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

  // get liste des numero serie produit avec id 
  numero_Serie_Produit(id:any)
  {
    return this.http.get(ERP + 'Detail_Produit_Nserie_En_Json', {
      params: {
        Id: id       
      }, observe: 'body'
    }).pipe(catchError(this.handleError));
  }

   // Detail Produit par Numero Serie 
   Detail_Produit_N_serie(n_serie: any, id : any):Observable<any>{
    return this.http.get(ERP+'Detail_Produit_par_Numero_Serie/',{
      params:{
        Id: id,
        N_Serie: n_serie,
      },observe: 'body'
    });
  }

  // Detail Produit par Numero Serie 
  Detail_Produit_4g( id : any):Observable<any>{
    return this.http.get(ERP + 'Detail_Produit_4G_En_Json', {
      params: {
        Id: id       
      }, observe: 'body'
    }).pipe(catchError(this.handleError));
  }


  // creer_Bon_Transfert
  creer_Bon_Transfert(form: any): Observable<Object> {
    return this.http.post(ERP + "/Creer_Bon_Transfert", form);
  }

   //  get lise des Clients 
   Clients( ) : Observable<any>{
    return this.http.get(ERP + 'Clients', { observe: 'body' }).pipe(catchError(this.gererErreur)
    );
  }

  
  get_facture_client( id : any):Observable<any>{
    return this.http.get(ERP + 'Filtre_Facture', {
      params: {
        Champ: "id_Clt",
        Valeur:id       
      }, observe: 'body'
    }).pipe(catchError(this.handleError));
  }
  
  get_bl_client( id : any):Observable<any>{
    return this.http.get(ERP + 'Filtre_Bon_Livraison', {
      params: {
        Champ: "id_Clt",
        Valeur:id       
      }, observe: 'body'
    }).pipe(catchError(this.handleError));
  }
}
