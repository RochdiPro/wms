import { Injectable } from '@angular/core';
 
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
 


const ERP = '/ERP/';
 
@Injectable({
  providedIn: 'root'
})
export class BonReceptionServiceService {

  constructor(private httpClient: HttpClient) {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');

  }


  /// get liste of bon entree local
  Liste_Bon_Entree(): Observable<any> {
    return this.httpClient.get(ERP + "Fiche_Bon_Entree_Locals").pipe(
      catchError(this.handleError)

    );
  }

  /// get liste of bon entree inportation
  Liste_Bon_Entree_Importaion(): Observable<any> {
    return this.httpClient.get(ERP + "Fiche_Bon_Entree_Importations").pipe(
      catchError(this.handleError)

    );
  }
  /// get liste of bon entree de retour
  liste_Bon_Retour(): Observable<any> {
    return this.httpClient.get(ERP + "Bon_Retours").pipe(
      catchError(this.handleError)

    );
  }

  /// get   bon entree Local avec id 
  BonEntreeLocal(id: any): Observable<any> {
    return this.httpClient.get(ERP + 'Fiche_Bon_Entree_Local/'
      , {
        params: {
          Id_Bon: id
        }, observe: 'body'
      }).pipe(catchError(this.handleError))
  }

  // lister le bon des transfert 
  Liste_Bon_Transfert(): Observable<any> {
    return this.httpClient.get(ERP + "Bon_Transferts").pipe(
      catchError(this.handleError)

    );
  }

  // get data from bon de entree 
  Quantite_Fiche_Technique_Fiche_Bon_Entree_Local(id: any): Observable<any> {
    return this.httpClient.get(ERP + 'Quantite_Fiche_Technique_Fiche_Bon_Entree_Local/'
      , {
        params: {
          Id_Bon: id
        }, observe: 'body'
      }).pipe(catchError(this.handleError))
  }
  // get data from bon de retour
  Quantite_Fiche_Technique_Fiche_Bon_Retour(id: any): Observable<any> {
    return this.httpClient.get(ERP + 'Quantite_Fiche_Technique_Fiche_Bon_Retour/'
      , {
        params: {
          Id_Bon: id
        }, observe: 'body'
      }).pipe(catchError(this.handleError))
  }
  // get data from bon de transfert 
  Quantite_Fiche_Technique_Fiche_Bon_Transfert(id: any): Observable<any> {
    return this.httpClient.get(ERP + 'Quantite_Fiche_Technique_Fiche_Bon_Transfert/'
      , {
        params: {
          Id_Bon: id
        }, observe: 'body'
      }).pipe(catchError(this.handleError))
  }
  // get data from bon de importation 
  Quantite_Fiche_Technique_Fiche_Bon_Entree_Importation(id: any): Observable<any> {
    return this.httpClient.get(ERP + 'Quantite_Fiche_Technique_Fiche_Bon_Entree_Importation/'
      , {
        params: {
          Id_Bon: id
        }, observe: 'body'
      }).pipe(catchError(this.handleError))
  }

 // get famaille 
  Famille_Logistique(): Observable<any> {
    return this.httpClient.get(ERP + 'Categorie_Famille_Logistique/').pipe(
      catchError(this.handleError)

    );
  }
   // get sous famaille apartire de famaille 
  sousFamille(id: any): Observable<any> {
    return this.httpClient.get(ERP + 'Categorie_Sous_Famille_Logistique/'
      , {
        params: {
          Famille_Logistique: id
        }, observe: 'body'
      }).pipe(catchError(this.handleError))
  }

  // create bon reception 
  createBonReception(form: any): Observable<Object> {
    return this.httpClient.post(ERP + "Creer_Bon_Reception", form);

  }
  // get bon entree local by id  
  get_Information_Bon_entree_Local (id: any): Observable<any> {
    return this.httpClient.get(ERP + "Fiche_Bon_Entree_Local" , {
      params: {
        Id_Bon: id
      }, observe: 'body'
    }).pipe(catchError(this.handleError))    
  }

   // get bon entree Importation by id  
   get_Information_Bon_entree_Importation(id: any): Observable<any> {
    return this.httpClient.get(ERP + "Fiche_Bon_Entree_Importation" , {
      params: {
        Id_Bon: id
      }, observe: 'body'
    }).pipe(catchError(this.handleError))    
  }

   // get bon   transfert by id  
   get_Information_Bon_transfert(id: any): Observable<any> {
    return this.httpClient.get(ERP + "Bon_Transfert" , {
      params: {
        Id : id
      }, observe: 'body'
    }).pipe(catchError(this.handleError))    
  }

   // get bon   retour by id   
   get_Information_Bon_retour(id: any): Observable<any> {
    return this.httpClient.get(ERP + "Bon_Retour" , {
      params: {
        Id : id
      }, observe: 'body'
    }).pipe(catchError(this.handleError))    
  }

  // get all bon receptions 
  Bon_Receptions(): Observable<any> {
    return this.httpClient.get(ERP + "Bon_Receptions");

  }
  // Supprimer un bon Reception 
  Supprimer_Bon_Reception(id: any): Observable<Object> {
    return this.httpClient.delete(ERP + "Supprimer_Bon_Reception", {
      params: {
        Id: id
      }, observe: 'body'
    }).pipe(catchError(this.handleError));
  }

  // Ajouter bon rejet
  creer_BonR_ejet(form: any): Observable<Object> {
    return this.httpClient.post(ERP + "/Creer_Bon_Rejet", form);

  }

  // get bon   reception  by id  
  get_Bon_Reception_By_Id(id: any): Observable<Object> {
    return this.httpClient.get(ERP + "Bon_Reception", {
      params: {
        Id: id
      }, observe: 'body'
    }).pipe(catchError(this.handleError));
  }
// get information from  bon reception avec id 
  Detail_Bon_Reception(Id: any): Observable<any> {

    return this.httpClient.get(ERP + "Detail_Bon_Reception"
      , {
        params: {
          Id: Id
        }, responseType: 'blob'
      }).pipe(catchError(this.handleError))
  }


  /// modifier un bon de reception  
  Modifier_BonReception( formData:any): Observable<Object> {
    return this.httpClient.post(ERP+ "/Modifier_Bon_Reception", formData);
  }  
  

  // get bons de rejet 
  Bon_rejet():  Observable<any> {
      return this.httpClient.get(ERP + "Bon_Rejets");  
  }
     
  // Supprimer un bon Rejet
  Supprimer_Bon_rejet(id: any): Observable<Object> {
    return this.httpClient.delete(ERP + "Supprimer_Bon_Rejet", {
      params: {
        Id: id
      }, observe: 'body'
    }).pipe(catchError(this.handleError));
  }
   
/*S

  createBonReception(form: any): Observable<Object> {
    return this.httpClient.post(infonet + "Creer_Bon_Reception", form);

  }
  getAllBonReceptions(): Observable<Object> {
    return this.httpClient.get(infonet + "Bon_Receptions");
  }

  getBonReception_ById(id: any): Observable<Object> {
    return this.httpClient.get(infonet + "Bon_Reception", {
      params: {
        Id: id
      }, observe: 'body'
    }).pipe(catchError(this.handleError));
  }

  deleteBonReceptions(id: any): Observable<Object> {
    return this.httpClient.delete(infonet + "Supprimer_Bon_Reception", {
      params: {
        Id: id
      }, observe: 'body'
    }).pipe(catchError(this.handleError));
  }

  updateBonReception(form: any): Observable<Object> {
    
    return this.httpClient.post(infonet + "Modifier_Bon_Reception", form);
  }

  

  createBonRejet(form: any): Observable<Object> {
    return this.httpClient.post(infonet + "/WMS/cree_BonRejet", form);

  }



  ListBonReception(): Observable<any> {
    return this.httpClient.get<Bon_Reception[]>(wms + "/WMS/Liste_bonsReceptions");

  }
  Liste_BonsRejets(): Observable<any> {
    return this.httpClient.get<Bon_Rejet[]>(wms + "/WMS/Liste_BonsRejets");

  }
  ListeBonCommandeClient(): Observable<any> {
    return this.httpClient.get(wms + "WMS/Liste_boncommande_Clt").pipe(
      catchError(this.handleError)

    );
  }
  createSupport(support: Support): Observable<Object> {
    return this.httpClient.post(wms + "/WMS/cree_support", support);
  }


  AddLigneProduitBonRecpion(id: number, bon: Bon_Reception): Observable<Object> {
    return this.httpClient.put(`${wms + "/WMS/AddLigneProduitBonRecpion"}/${id}`, bon);
  }

  AddLigneProduitBonRejet(id: number, bon: Bon_Rejet): Observable<Object> {
    return this.httpClient.put(`${wms + "/WMS/AddLigneProduitBonRejet"}/${id}`, bon);
  }

  lastIDBR(): Observable<any> {
    return this.httpClient.get(wms + "WMS/LastIDBR").pipe(
      catchError(this.handleError)

    );
  }
  GetLocalByNom(libelle: string): Observable<any> {
    return this.httpClient.get(wms + "WMS/Local", { params: { libelle: libelle } }).pipe(
      catchError(this.handleError)

    );
  }
 /*  updateBonReception(id: number, bon: Bon_Reception): Observable<Object> {
    return this.httpClient.put(`${wms + "/WMS/modifier_bonReception"}/${id}`, bon);
  }  
  getBonReceptionById(id: number): Observable<Bon_Reception> {
    return this.httpClient.get<Bon_Reception>(`${wms + "/WMS/bonReception"}/${id}`);
  }
  getBonRejetById(id: number): Observable<Bon_Rejet> {
    return this.httpClient.get<Bon_Rejet>(`${wms + "/WMS/BonRejet"}/${id}`);
  }

  getArticleByID(id: number): Observable<Fiche_Article> {
    return this.httpClient.get<Fiche_Article>(`${wms + "/WMS/GetArticle"}/${id}`);
  }
  supprimerBon(id: number): Observable<Object> {
    return this.httpClient.delete(`${wms + "/WMS/bonReception"}/${id}`);
  }
  //Récupérer détails produit
  Detail_Bon(Id: any): Observable<any> {

    return this.httpClient.get(wms + "WMS/Detail_Bon_Reception"
      , {
        params: {
          Id_Bon: Id
        }, responseType: 'blob'
      }).pipe(catchError(this.handleError))
  }
*/
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