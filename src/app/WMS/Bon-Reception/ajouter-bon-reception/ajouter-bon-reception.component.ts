import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BonReceptionServiceService } from '../bon-reception-service.service';
import Swal from 'sweetalert2'
import { MatStepper } from '@angular/material/stepper';
 
 
@Component({
  selector: 'app-ajouter-bon-reception',
  templateUrl: './ajouter-bon-reception.component.html',
  styleUrls: ['./ajouter-bon-reception.component.scss']
})
export class AjouterBonReceptionComponent implements OnInit {
  @ViewChild('stepper') private myStepper: any=MatStepper;
  selectFormGroup:any= FormGroup;
  SupportFormGroup:any= FormGroup;
  ArticleFormGroup:any = FormGroup;
  isLinear = false;
  selected = 'id';
  disableSelect = new FormControl(false);
  bonEntrees_Local:any=[]
  bonEntrees_impo:any=[]
  bonretour:any=[]
  bontransfert:any=[]
  type_bon:any ;
  id:any;
  nbSupport:any;
  listeArticleBonEntree:any;


  constructor(private _formBuilder: FormBuilder ,public service: BonReceptionServiceService ) {
    this.service.Famille_Logistique().subscribe((data: any) => {
      this.Famille_Logistique = data;       
    });
  }

  ngOnInit() {
    this.selectFormGroup = this._formBuilder.group({
      nbSupport: ['', Validators.required]
    });
    this.SupportFormGroup = this._formBuilder.group({
      typeSupport: new FormControl({ value: '', disabled: true }, Validators.required),
      poids: new FormControl({ value: '', disabled: true }, Validators.required),
      hauteur: new FormControl({ value: '', disabled: true }, Validators.required),
      largeur: new FormControl({ value: '', disabled: true }, Validators.required),
      longeur:new FormControl({ value: '', disabled: true }, Validators.required),
      qte: new FormControl({ value: '', disabled: true }, Validators.required),
    });
    this.ArticleFormGroup = this._formBuilder.group({
      famille_Logistique: new FormControl({ value: '', disabled: true }, Validators.required),
      sousFamille: new FormControl({ value: '', disabled: true }, Validators.required),
      qteth: new FormControl({ value: '', disabled: true }, Validators.required),
      support: new FormControl({ value: '', disabled: true }, Validators.required),
      totale: new FormControl({ value: '', disabled: true }, Validators.required),
    });
  }


/*
****************************************           fonctions relative a steep 1 ********************************************** 
*/ 



  //  function pour choisir type de marchandise a fin de realisier l'affichage du tableau avec le parametre de bon  
  bonEntree_selected :any;
  bonEntree_impo_selected :any;
  bonrtour_selected:any;
  bontransfert_selected:any;
  Select_bon(event: any) {
     
    this.bonEntree_selected = false;
    this.bonEntree_impo_selected = false;
    this.bonrtour_selected= false;
    this.bontransfert_selected= false;
    this.bonEntrees_Local = []
    if (this.selected == "local") {
      this.listeBELocal();
      this.type_bon = "local"
      this.bonEntree_selected = true ;

    }
    if (this.selected == "Importation") {
      this.listeBonEntreeImporation();
      this.type_bon = "Importation"
      this.bonEntree_impo_selected = true;

    }
    if (this.selected == "Retour") {

      this.listeRetour();
      this.type_bon = "Retour"
      this.bonrtour_selected=true;
     
    }
    if (this.selected == "Transfert") {
      this.listeBTransfert();
      this.type_bon = "transfert"
      this.bontransfert_selected=true;

    }


  }
 

/// get liste bon entree Local
  private listeBELocal() {
    this.service.Liste_Bon_Entree().subscribe((data: any) => {
      this.bonEntrees_Local = data;
    });
  }

  /// get liste bon entree transfert
  private listeBTransfert() {
    this.service.Liste_Bon_Transfert().subscribe((data: any) => {
      this.bontransfert = data;
    });

  }
/// get liste bon de retour 
  private listeRetour() {
    this.service.liste_Bon_Retour().subscribe((data: any) => {
      this.bonretour = data;
    });

  }
/// get liste bon entree importation 
  private listeBonEntreeImporation() {
    this.service.Liste_Bon_Entree_Importaion().subscribe((data: any) => {
     this.bonEntrees_impo = data;
    });
  }

/// get nombre de support pour une bon  sélectionner 
  async getNombre_Support(ev: any) {
    Swal.fire({
      title: "Indiquer le nombre de support pour ce bon "+this.type_bon,
      input: 'number',
      inputPlaceholder: "Nombre de support",
      confirmButtonText: 'Valider',
      showLoaderOnConfirm: true,
      preConfirm: (nbSupport) => {
        if (nbSupport <= 0) {
          Swal.showValidationMessage(`Nombre de support invalide`)
        }
        else {
          this.id = ev.id_Bon_Entree_Local;
          this.selectFormGroup.setValue({ 'nbSupport': nbSupport });
          this.nbSupport = nbSupport;
          this.genererTemplateSupport(nbSupport);
        }
      },
    });
  }



/*
****************************************           fonctions relative a steep 2    ********************************************** 
*/ 
  supports: any = [];
  arraySupport: any = [];
  newAttribute: any;
  listArticleBonEntree: any = [];
 


   //generer tableau de support
   genererTemplateSupport(nbSupport: any) {
    this.arraySupport = [];
    for (let i = 0; i < nbSupport; i++) {    
      this.arraySupport.push(this.ajouterligneSupport( ));
    }

    this.SupportFormGroup = this._formBuilder.group({
      ClassDetails: this._formBuilder.array(this.arraySupport)
    }); 
   
    this.myStepper.next();
  }
   // Ajouter une ligne dans le tableau du support  
  ajouterligneSupport( ): FormGroup {
    return this._formBuilder.group({
      typeSupport: new FormControl({ value: '', disabled: false }, Validators.required),
      poids: new FormControl({ value: '', disabled: false }, Validators.required),
      hauteur: new FormControl({ value: '', disabled: false }, Validators.required),
      largeur: new FormControl({ value: '', disabled: false }, Validators.required),
      longeur: new FormControl({ value: '', disabled: false }, Validators.required),
      qte: new FormControl({ value: '', disabled: false }, Validators.required)
    });
  }


/*
****************************************           fonctions relative a steep 3  ********************************************** 
*/ 

obj_articles : any = []; 
new_obj : any = {}  

Identifier_Articles(id: any) {
  this.service.Quantite_Fiche_Technique_Fiche_Bon_Entree_Local(id).subscribe((data: any) => {
    this.listeArticleBonEntree = data;
    for ( let i = 0 ; i < this.listeArticleBonEntree.length ;i++ )
    {
      this.new_obj={};      
      this.new_obj.id =this.listeArticleBonEntree[i].id;
      this.new_obj.nom =this.listeArticleBonEntree[i].nom_Article;
      this.new_obj.fiche_Technique =this.listeArticleBonEntree[i].fiche_Technique;
      this.new_obj.qte_th =0
      this.new_obj.qte =this.listeArticleBonEntree[i].qte;
      this.new_obj.famaille="";
      this.new_obj.sous_famaille="";
      this.new_obj.total=0;
     
      this.new_obj.sup1= 0 ;
      this.new_obj.sup2= 0 ;
      this.new_obj.sup3= 0 ;
      this.new_obj.sup4= 0 ;
      this.new_obj.sup5= 0 ;
      this.new_obj.sup6= 0 ;
      this.new_obj.sup7= 0 ;
      this.new_obj.sup8= 0 ;
      this.new_obj.sup9= 0 ;
      this.new_obj.sup10= 0 ;
      this.new_obj.sup11= 0 ;
      this.new_obj.sup12= 0 ;
      this.new_obj.sup13= 0 ;
      this.new_obj.sup14= 0 ;
      this.new_obj.sup15= 0 ;
      this.new_obj.sup16= 0 ;
      this.new_obj.sup17= 0 ;
      this.new_obj.sup18= 0 ;
      this.new_obj.sup19= 0 ;
      this.new_obj.sup20= 0 ;  
      this.obj_articles.push(this.new_obj)  
    }
    console.log(this.obj_articles)
  }); 

}

  Sous_Famille_Logistique: any = [];
  Famille_Logistique: any = [];
  Famille(event: any , id :any) {
    let ch  =event.value
    console.log(ch , id)
    for ( let i = 0 ; i < this.obj_articles.length ;i++ )
    {
      if (this.obj_articles[i].id == id)
      {
        this.obj_articles[i].famaille = ch
      }
    }
      

  }
  getSousFamille(   id :any ) {  
    
    for ( let i = 0 ; i < this.obj_articles.length ;i++ )
    {
      if (this.obj_articles[i].id == id)
      {
        this.service.sousFamille(this.obj_articles[i].famaille).subscribe((data: any) => {
          this.Sous_Famille_Logistique = data;
        });
      }
    }
  }
  SousFamille(   event: any , id :any) {
    let ch  =event.value      
    for ( let i = 0 ; i < this.obj_articles.length ;i++ )
    {
      if (this.obj_articles[i].id == id)
      {
         this.obj_articles[i].sous_famaille=event.value          
      }
    }
  }

   //calcule Totale Support
   getTotale(ev: any, i: any, a:any) {
    /*console.log("____________________________")
    console.log("i=",i)
    console.log("ev: ",ev.target.value);
    console.log("totale: ",this.listeArticleBonEntree[i].totale);
    console.log("somme: ",this.somme);
    
    if (ev.target.value > a ||this.listeArticleBonEntree[i].totale>a||this.somme>a){
      Swal.fire(
        'Verifé la quanitité',
        'Quantité Non Disponible ',
        'error'
      )
    }

    /* for (let j = 0; j < this.arraySupport.length; j++) {
      if (Number.isNaN(this.listeArticleBonEntree[i].totale)) {
        console.log("j=",j)
        this.listeArticleBonEntree[i].totale = 0;
        this.listeArticleBonEntree[i].totale+= parseInt(ev.target.value);
      }
      return this.listeArticleBonEntree[i].totale += parseInt(ev.target.value);
    } */
    /*
    if (this.j < this.arraySupport.length){
      this.listeArticleBonEntree[i].totale = 0;
      this.total[this.j]= parseInt(ev.target.value);
      console.log("j=",this.j);
      console.log("total[j]=",this.total[this.j]);
      this.somme+= this.total[this.j];

    }else{
      this.j=0
      this.total[this.j]= parseInt(ev.target.value);
      this.somme=this.total[this.j]
    }
  
    this.j++
    this.listeArticleBonEntree[i].totale =this.somme ;
    */
  }
  totalZero(i:any) {
    /*this.listeArticleBonEntree[i].totale = 0
    this.somme=0
    this.j=0*/
  }
  
}
