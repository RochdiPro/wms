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

    // Obtenir la liste des Articles du local source
    liste_articles(src:any): Observable<any> {
      return this.http.get(ERP + 'Liste_Produits_En_Local', { observe: 'body' }).pipe(catchError(this.gererErreur)
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

    // get bon   sortie  by id  
    get_Bon_retour_By_Id(id: any): Observable<Object> {
      return this.http.get(ERP + "Bon_Retour", {
        params: {
          Id: id
        }, observe: 'body'
      }).pipe(catchError(this.handleError));
    }

  
   // get bon   sortie  by id  
   get_Bon_transfert_By_Id(id: any): Observable<Object> {
    return this.http.get(ERP + "Bon_Transfert", {
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

  // get information bon retour avec id 
  Detail_Bon_Retour (Id: any): Observable<any> {

    return this.http.get(ERP + "Detail_Bon_Retour"
      , {
        params: {
          Id_Bon: Id
        }, responseType: 'blob'
      }).pipe(catchError(this.handleError))
  }

  // get information from  bon sortie avec id 
  Detail_Bon_Transfert(Id: any): Observable<any> {

    return this.http.get(ERP + "Detail_Bon_Transfert"
      , {
        params: {
          Id_Bon: Id
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
  /// Supprimer_Bon_retour
  Supprimer_Bon_retour(id: any): Observable<Object> {
    return this.http.delete(ERP + "Supprimer_Bon_Retour", {
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
   // filtre bon retour 
  filtre_retour(champ1 : any, valeur1 : any, champ2 : any, valeur2 : any, champ3 : any, valeur3 : any , champ4 : any, valeur4 : any )
  {
    return this.http.get(ERP + 'Filtre_Bon_Retour', {
      params: {
        Champ1: champ1,
        Valeur1: valeur1,
        Champ2: champ2,
        Valeur2: valeur2,
        Champ3: champ3,
        Valeur3: valeur3,
        Champ4: champ4,
        Valeur4: valeur4,
        
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
  creer_Bon_Retour
  (form: any): Observable<Object> {
    return this.http.post(ERP + "/Creer_Bon_Retour", form);
  }
   //  get lise des Clients 
   Clients( ) : Observable<any>{
    return this.http.get(ERP + 'Clients', { observe: 'body' }).pipe(catchError(this.gererErreur)
    );
  }

  // get liste des facture par un client x
  get_facture_client( id : any):Observable<any>{
    return this.http.get(ERP + 'Filtre_Facture', {
      params: {
        Champ: "id_Clt",
        Valeur:id       
      }, observe: 'body'
    }).pipe(catchError(this.handleError));
  }
  
  // get liste des bls pour un client  
  get_bl_client( id : any , date1:any , date2 :any ):Observable<any>{
    return this.http.get(ERP + 'Filtre_Bon_Livraison_Par_Client_Date1_Date2', {
      params: {
        Client: id,
        Date1:date1,
        Date2:date2,       
      }, observe: 'body'
    }).pipe(catchError(this.handleError));
  }

   
  // get information from  bon livraison avec id 
  Detail_detail_bl(Id: any): Observable<any> {
    return this.http.get(ERP + "Detail_Bon_Livraison"
      , {
        params: {
          Id_BL: Id
        }, responseType: 'blob'
      }).pipe(catchError(this.handleError))
  }

   // get all bon receptions 
   Bon_retours(): Observable<any> {
    return this.http.get(ERP + "Bon_Retours");

  }




  ////////


   //** Get All Articles EP */
   getArticls() : Observable<any>{
    return this.http.get(ERP+'Fiche_Produits');
  }
  //** Get Article by Id  */
  getArticleById(id:string):Observable<any> {
    return this.http.get(ERP+'Fiche_Produit/',{
      params: {
        Id_Produit: id,
      },observe: 'response'
    });
  }
  //** Get Article By Code à bare EP */
  getArrByCodeBare(code : string) : Observable<any>{
    return this.http.get(ERP + 'Filtre_Fiche_Produit_par_Code/', {
      params: {
        Code: code
      }, observe: 'response'
    });
  }

  //** Get Client By Code/id EP */
  getClientById(id : string): Observable<any>{
     return this.http.get(ERP +'Client/',{params :{
      Id_Clt: id,
    },observe: 'response'});
  }
  //** Get List All Client*/
  getAllClient(): Observable<any>{
    return this.http.get(ERP+'Clients')
  }
  //** List of Fourniseur */
  getAllFourniseur(): Observable<any>{
    return this.http.get(ERP+'Fournisseurs'); 
  }

  //** Get All Devis */
  getAllDevis(): Observable<any>{
    return this.http.get(ERP+'Deviss/'); 
  }

  //** Get Quate by ID */
  getQuoteByID(id: string ): Observable<any>{
    return this.http.get(ERP +'Devis/',{
      params: { Id: id}, observe: 'response'
    });
  }
  //** Get all Key word from the table "Devis" */
  getListKeyWord(): Observable<any>{
   return this.http.get(ERP+ 'Liste_Champs_Devis')
  }
  //** Get Info Product by Id */ 
  getInfoProductByIdFromStock(id: string): Observable<any>{
    return this.http.get(ERP+'Stock/',{
      params:{Id : id },observe: 'response'
    });
  }
  //** Create a Quote "Devis" */
  createQuate(formData : any ): Observable<any>{
    return this.http.post<any>(ERP+'Creer_Devis', formData); 
  }
  //** Filter By Champ */
  filterByChampValeur(champ: string , value : string) : Observable<any>{
    return this.http.get(ERP + 'Filtre_Devis/', {
      params : {
        Champ: champ, 
        Valeur: value
      }, observe: 'response'
    });
  }
  //** Delete Devis by ID */
  deleteDevis( id : string ): Observable<any>{
    return this.http.delete(ERP + 'Supprimer_Devis/', {
      params: {
        Id: id
      }, observe:'response'
    })
  }
  //** Get detail devis */
  detail(id: any):Observable<any>{
    return this.http.get(ERP+'Detail_Devis/',{
      params: {
        Id_Devis : id
      }, observe:'response', responseType : 'blob'
    });
  }
  /** Update Quote (Modifier_Devis) */
  updateQuote(formData : any): Observable<any>{
    return this.http.post<any>(ERP+'Modifier_Devis', formData); 
  }

  //** Liste_Champs_Fiche_Produit */
  getListChampsProduit(): Observable<any>{
    return this.http.get(ERP+'Liste_Champs_Fiche_Produit');
  }

  //** Filtre_Fiche_Produit_par_Code2  */
  getProduitByCodeBar(code: string){
    return this.http.get(ERP+'Filtre_Fiche_Produit_par_Code2/',{
      params: {
        Code: code,
      },observe:'response'
    });
  }

  //** Filter By Champ for Produit */
  filterByChampValeurForProd(champ: string , value : string) : Observable<any>{
    return this.http.get(ERP + 'Filtre_Fiche_Produit/', {
        params : {
          Champ: champ, 
          Valeur: value
        }, observe: 'response'
      });
  }
  //** Get Locals */
  getLocals(): Observable<any>{
    return this.http.get(ERP+'Locals/'); 
  }
  //** Quantite_Produit_Par_Stock_En_Local */
  quentiteProdLocal( id : any,local : any ){
    return this.http.get(ERP+'Quantite_Produit_Par_Stock_En_Local/',{params:{
      Id: id,
      Local: local
    },observe: 'response'
  });
  }
  //** Liste_Produits_En_Local */
  listProdEnLocal (local : any ): Observable<any>{
      return this.http.get(ERP+'Liste_Produits_En_Local/',{
        params: {
          Local: local,
        },observe:'response'
      });
    }
  //** Get Local by ID  */
  getLocalById(id: any ): Observable<any>{
    return this.http.get(ERP+"Local/",{
      params:{
        Id_Local: id,
      }, observe: 'response'
    });
  }

}
