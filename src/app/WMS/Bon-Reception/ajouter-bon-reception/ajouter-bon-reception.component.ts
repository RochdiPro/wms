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
  @ViewChild('stepper') private myStepper: any = MatStepper;
  selectFormGroup: any = FormGroup;
  SupportFormGroup: any = FormGroup;
  ArticleFormGroup: any = FormGroup;
  controleFormGroup: any = FormGroup;

  isLinear = false;
  selected = 'id';
  disableSelect = new FormControl(false);
  bonEntrees_Local: any = []
  bonEntrees_impo: any = []
  bonretour: any = []
  bontransfert: any = []
  type_bon: any;
  id: any;
  nbSupport: any;
  listeArticleBon: any;
  Source:any;
  Destiation:any;


  constructor(private _formBuilder: FormBuilder, public service: BonReceptionServiceService) {
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
      longeur: new FormControl({ value: '', disabled: true }, Validators.required),
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
  bonEntree_selected: any;
  bonEntree_impo_selected: any;
  bonrtour_selected: any;
  bontransfert_selected: any;
  Select_bon(event: any) {

    this.bonEntree_selected = false;
    this.bonEntree_impo_selected = false;
    this.bonrtour_selected = false;
    this.bontransfert_selected = false;
    this.bonEntrees_Local = []
    if (this.selected == "local") {
      this.listeBELocal();
      this.type_bon = "Bon Entrée local"
      this.bonEntree_selected = true;

    }
    if (this.selected == "Importation") {
      this.listeBonEntreeImporation();
      this.type_bon = "Bon Entrée Importation"
      this.bonEntree_impo_selected = true;

    }
    if (this.selected == "Retour") {

      this.listeRetour();
      this.type_bon = "Bon Retour"
      this.bonrtour_selected = true;

    }
    if (this.selected == "Transfert") {
      this.listeBTransfert();
      this.type_bon = "Bon Transfert"
      this.bontransfert_selected = true;

    }


  }

  // get les information generale de bon 
  get_detail_bon(id : any )
  { 
    if (this.bonEntree_selected){
    this.service.get_Information_Bon_entree_Local(id).subscribe((data: any) => {
      this.Source=data.id_Fr
      this.Destiation=data.local
      console.log(this.Source + "  " +this.Destiation)
    });}
    else if (this.bonEntree_impo_selected){
      this.service.get_Information_Bon_entree_Importation(id).subscribe((data: any) => {
       this.Source=data.id_Fr
      this.Destiation=data.local
      console.log(this.Source + "  " +this.Destiation)
    });}
    else if (this.bontransfert_selected){
      this.service.get_Information_Bon_transfert(id).subscribe((data: any) => {
       this.Source=data.local_Source
      this.Destiation=data.local_Destination
      console.log(this.Source + "  " +this.Destiation)
    });}
    else if (this.bonrtour_selected){
      this.service.get_Information_Bon_retour(id).subscribe((data: any) => {
       this.Source=data.id_Clt
      this.Destiation=data.local
      console.log(this.Source + "  " +this.Destiation)
    });}
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
  async getNombre_Support(id_b: any) {
    Swal.fire({
      title: "Indiquer le nombre de support pour ce bon " + this.type_bon,
      input: 'number',
      inputPlaceholder: "Nombre de support",
      confirmButtonText: 'Valider',
      showLoaderOnConfirm: true,
      preConfirm: (nbSupport) => {
        if (nbSupport <= 0) {
          Swal.showValidationMessage(`Nombre de support invalide`)
        }
        else {
          this.id = id_b;
          this.get_detail_bon(this.id)
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
      this.arraySupport.push(this.ajouterligneSupport());
    }

    this.SupportFormGroup = this._formBuilder.group({
      ClassDetails: this._formBuilder.array(this.arraySupport)
    });

    this.myStepper.next();
  }
  // Ajouter une ligne dans le tableau du support  
  ajouterligneSupport(): FormGroup {
    return this._formBuilder.group({
      typeSupport: new FormControl({ value: '', disabled: false }, Validators.required),
      poids: new FormControl({ value: '', disabled: false }, Validators.required),
      hauteur: new FormControl({ value: '', disabled: false }, Validators.required),
      largeur: new FormControl({ value: '', disabled: false }, Validators.required),
      longeur: new FormControl({ value: '', disabled: false }, Validators.required),
    });
  }


  /*
  ****************************************           fonctions relative a steep 3  ********************************************** 
  */

  obj_articles: any = [];
  new_obj: any = {}

  Identifier_Articles(id: any) {
    this.id = id;
    if (this.bonEntree_selected) {
      this.service.Quantite_Fiche_Technique_Fiche_Bon_Entree_Local(id).subscribe((data: any) => {
        this.listeArticleBon = data;
        for (let i = 0; i < this.listeArticleBon.length; i++) {
          this.new_obj = {};
          this.new_obj.id = this.listeArticleBon[i].id;
          this.new_obj.nom = this.listeArticleBon[i].nom_Article;
          this.new_obj.fiche_Technique = this.listeArticleBon[i].fiche_Technique;
          this.new_obj.qte_th = 0
          this.new_obj.qte = this.listeArticleBon[i].qte;
          this.new_obj.famaille = "";
          this.new_obj.sous_famaille = "";
          this.new_obj.total = 0;
          this.new_obj.sup1 = 0;
          this.new_obj.sup2 = 0;
          this.new_obj.sup3 = 0;
          this.new_obj.sup4 = 0;
          this.new_obj.sup5 = 0;
          this.new_obj.sup6 = 0;
          this.new_obj.sup7 = 0;
          this.new_obj.sup8 = 0;
          this.new_obj.sup9 = 0;
          this.new_obj.sup10 = 0;
          this.new_obj.sup11 = 0;
          this.new_obj.sup12 = 0;
          this.new_obj.sup13 = 0;
          this.new_obj.sup14 = 0;
          this.new_obj.sup15 = 0;
          this.new_obj.sup16 = 0;
          this.new_obj.sup17 = 0;
          this.new_obj.sup18 = 0;
          this.new_obj.sup19 = 0;
          this.new_obj.sup20 = 0;
          this.new_obj.controle_qt = false;
          this.new_obj.controle_tech = false;
          this.obj_articles.push(this.new_obj)
        }
        //console.log(this.obj_articles)
      });
    }
    else if (this.bonEntree_impo_selected) {
      this.service.Quantite_Fiche_Technique_Fiche_Bon_Entree_Importation(id).subscribe((data: any) => {
        this.listeArticleBon = data;
        for (let i = 0; i < this.listeArticleBon.length; i++) {
          this.new_obj = {};
          this.new_obj.id = this.listeArticleBon[i].id;
          this.new_obj.nom = this.listeArticleBon[i].nom_Article;
          this.new_obj.fiche_Technique = this.listeArticleBon[i].fiche_Technique;
          this.new_obj.qte_th = 0
          this.new_obj.qte = this.listeArticleBon[i].qte;
          this.new_obj.famaille = "";
          this.new_obj.sous_famaille = "";
          this.new_obj.total = 0;
          this.new_obj.sup1 = 0;
          this.new_obj.sup2 = 0;
          this.new_obj.sup3 = 0;
          this.new_obj.sup4 = 0;
          this.new_obj.sup5 = 0;
          this.new_obj.sup6 = 0;
          this.new_obj.sup7 = 0;
          this.new_obj.sup8 = 0;
          this.new_obj.sup9 = 0;
          this.new_obj.sup10 = 0;
          this.new_obj.sup11 = 0;
          this.new_obj.sup12 = 0;
          this.new_obj.sup13 = 0;
          this.new_obj.sup14 = 0;
          this.new_obj.sup15 = 0;
          this.new_obj.sup16 = 0;
          this.new_obj.sup17 = 0;
          this.new_obj.sup18 = 0;
          this.new_obj.sup19 = 0;
          this.new_obj.sup20 = 0;
          this.new_obj.controle_qt = false;
          this.new_obj.controle_tech = false;
          this.obj_articles.push(this.new_obj)
        }
        //console.log(this.obj_articles)
      });
    }
    else if (this.bonrtour_selected) {
      this.service.Quantite_Fiche_Technique_Fiche_Bon_Retour(id).subscribe((data: any) => {
        this.listeArticleBon = data;
        for (let i = 0; i < this.listeArticleBon.length; i++) {
          this.new_obj = {};
          this.new_obj.id = this.listeArticleBon[i].id;
          this.new_obj.nom = this.listeArticleBon[i].nom_Article;
          this.new_obj.fiche_Technique = this.listeArticleBon[i].fiche_Technique;
          this.new_obj.qte_th = 0
          this.new_obj.qte = this.listeArticleBon[i].qte;
          this.new_obj.famaille = "";
          this.new_obj.sous_famaille = "";
          this.new_obj.total = 0;
          this.new_obj.sup1 = 0;
          this.new_obj.sup2 = 0;
          this.new_obj.sup3 = 0;
          this.new_obj.sup4 = 0;
          this.new_obj.sup5 = 0;
          this.new_obj.sup6 = 0;
          this.new_obj.sup7 = 0;
          this.new_obj.sup8 = 0;
          this.new_obj.sup9 = 0;
          this.new_obj.sup10 = 0;
          this.new_obj.sup11 = 0;
          this.new_obj.sup12 = 0;
          this.new_obj.sup13 = 0;
          this.new_obj.sup14 = 0;
          this.new_obj.sup15 = 0;
          this.new_obj.sup16 = 0;
          this.new_obj.sup17 = 0;
          this.new_obj.sup18 = 0;
          this.new_obj.sup19 = 0;
          this.new_obj.sup20 = 0;
          this.new_obj.controle_qt = false;
          this.new_obj.controle_tech = false;
          this.obj_articles.push(this.new_obj)
        }
        //console.log(this.obj_articles)
      });
    }
    else if (this.bontransfert_selected) {
      this.service.Quantite_Fiche_Technique_Fiche_Bon_Transfert(id).subscribe((data: any) => {
        this.listeArticleBon = data;
        for (let i = 0; i < this.listeArticleBon.length; i++) {
          this.new_obj = {};
          this.new_obj.id = this.listeArticleBon[i].id;
          this.new_obj.nom = this.listeArticleBon[i].nom_Article;
          this.new_obj.fiche_Technique = this.listeArticleBon[i].fiche_Technique;
          this.new_obj.qte_th = 0
          this.new_obj.qte = this.listeArticleBon[i].qte;
          this.new_obj.famaille = "";
          this.new_obj.sous_famaille = "";
          this.new_obj.total = 0;
          this.new_obj.sup1 = 0;
          this.new_obj.sup2 = 0;
          this.new_obj.sup3 = 0;
          this.new_obj.sup4 = 0;
          this.new_obj.sup5 = 0;
          this.new_obj.sup6 = 0;
          this.new_obj.sup7 = 0;
          this.new_obj.sup8 = 0;
          this.new_obj.sup9 = 0;
          this.new_obj.sup10 = 0;
          this.new_obj.sup11 = 0;
          this.new_obj.sup12 = 0;
          this.new_obj.sup13 = 0;
          this.new_obj.sup14 = 0;
          this.new_obj.sup15 = 0;
          this.new_obj.sup16 = 0;
          this.new_obj.sup17 = 0;
          this.new_obj.sup18 = 0;
          this.new_obj.sup19 = 0;
          this.new_obj.sup20 = 0;
          this.new_obj.controle_qt = false;
          this.new_obj.controle_tech = false;
          this.obj_articles.push(this.new_obj)
        }
        //console.log(this.obj_articles)
      });
    }

  }

  Sous_Famille_Logistique: any = [];
  Famille_Logistique: any = [];
  // get liste des famailles 
  Famille(event: any, id: any) {
    let ch = event.value
    console.log(ch, id)
    for (let i = 0; i < this.obj_articles.length; i++) {
      if (this.obj_articles[i].id == id) {
        this.obj_articles[i].famaille = ch
      }
    }


  }
  // get sous famaille 
  getSousFamille(id: any) {

    for (let i = 0; i < this.obj_articles.length; i++) {
      if (this.obj_articles[i].id == id) {
        this.service.sousFamille(this.obj_articles[i].famaille).subscribe((data: any) => {
          this.Sous_Famille_Logistique = data;
        });
      }
    }
  }
  // get sous famaille d'une famille selectioner 
  SousFamille(event: any, id: any) {
    let ch = event.value
    for (let i = 0; i < this.obj_articles.length; i++) {
      if (this.obj_articles[i].id == id) {
        this.obj_articles[i].sous_famaille = event.value
      }
    }
  }

  //calcule Totale Support
  getTotale(ev: any, i: any, id: any) {

    for (let j = 0; j < this.obj_articles.length; j++) {
      if (id == this.obj_articles[j].id) {
        if (i == 1) { this.obj_articles[j].sup1 = ev.target.value }
        if (i == 2) { this.obj_articles[j].sup2 = ev.target.value }
        if (i == 3) { this.obj_articles[j].sup3 = ev.target.value }
        if (i == 4) { this.obj_articles[j].sup4 = ev.target.value }
        if (i == 5) { this.obj_articles[j].sup5 = ev.target.value }
        if (i == 6) { this.obj_articles[j].sup6 = ev.target.value }
        if (i == 7) { this.obj_articles[j].sup7 = ev.target.value }
        if (i == 8) { this.obj_articles[j].sup8 = ev.target.value }
        if (i == 9) { this.obj_articles[j].sup9 = ev.target.value }
        if (i == 10) { this.obj_articles[j].sup10 = ev.target.value }
        if (i == 11) { this.obj_articles[j].sup11 = ev.target.value }
        if (i == 12) { this.obj_articles[j].sup12 = ev.target.value }
        if (i == 13) { this.obj_articles[j].sup13 = ev.target.value }
        if (i == 14) { this.obj_articles[j].sup14 = ev.target.value }
        if (i == 15) { this.obj_articles[j].sup15 = ev.target.value }
        if (i == 16) { this.obj_articles[j].sup16 = ev.target.value }
        if (i == 17) { this.obj_articles[j].sup17 = ev.target.value }
        if (i == 18) { this.obj_articles[j].sup18 = ev.target.value }
        if (i == 19) { this.obj_articles[j].sup19 = ev.target.value }
        if (i == 20) { this.obj_articles[j].sup20 = ev.target.value }
        this.obj_articles[j].total = Number(this.obj_articles[j].sup1) + Number(this.obj_articles[j].sup2) + Number(this.obj_articles[j].sup3) + Number(this.obj_articles[j].sup4) + Number(this.obj_articles[j].sup5) + Number(this.obj_articles[j].sup6)
          + Number(this.obj_articles[j].sup7) + Number(this.obj_articles[j].sup8) + Number(this.obj_articles[j].sup9) + Number(this.obj_articles[j].sup10) + Number(this.obj_articles[j].sup11) + Number(this.obj_articles[j].sup12)
          + Number(this.obj_articles[j].sup13) + Number(this.obj_articles[j].sup14) + Number(this.obj_articles[j].sup15) + Number(this.obj_articles[j].sup16) + Number(this.obj_articles[j].sup17) + Number(this.obj_articles[j].sup18)
          + Number(this.obj_articles[j].sup19) + Number(this.obj_articles[j].sup20)
        if (this.obj_articles[j].total == this.obj_articles[j].qte) { this.obj_articles[j].controle_qt = true } else { this.obj_articles[j].controle_qt = false }
      }
    }
    console.log(this.obj_articles)

  }

  /*
  ****************************************           fonctions relative a steep 4  ********************************************** 
  */

  sysDate = new Date();
  onNativeChange(id: any) {
    /*  for (let i = 0; i < this.lis.length; i++) {
        if (this.lis[i].id == id)
  
          this.lis[i].test2 = this.controleFormGroup.get('checkQual').value;
  
      }*/


  }

  VerifControle() { }


  /*
   ****************************************           fonctions relative a steep 5  ********************************************** 
   */
  
  doc: any
  createBonReception() {


    this.doc = document.implementation.createDocument("Bon_Reception", "", null);
    var BR = this.doc.createElement("Bon_Reception");
    var Etat = this.doc.createElement("Etat"); Etat.innerHTML = "en cours"
    var source = this.doc.createElement("Source"); source.innerHTML = this.Source
    var distination = this.doc.createElement("Destination"); distination.innerHTML = this.Destiation
    var InformationsGenerales = this.doc.createElement("Informations-Generales");
    var Date = this.doc.createElement("Date"); Date.innerHTML = this.sysDate.toDateString()
    var Id_Bon = this.doc.createElement("Id_Bon"); Id_Bon.innerHTML = this.id
    var Type_Bon = this.doc.createElement("Type_Bon"); Type_Bon.innerHTML = this.type_bon
    var Responsable = this.doc.createElement("Responsable"); Responsable.innerHTML = "Responsable";
    InformationsGenerales.appendChild(source);
    InformationsGenerales.appendChild(distination);
    InformationsGenerales.appendChild(Date);
    InformationsGenerales.appendChild(Id_Bon);
    InformationsGenerales.appendChild(Type_Bon);
    InformationsGenerales.appendChild(Responsable);

    var Produits_Listes = this.doc.createElement('Produits')

    for (let i = 0; i < this.obj_articles.length; i++) {

      var Produit = this.doc.createElement('Produit') 
      var id = this.doc.createElement('Id'); id.innerHTML = this.obj_articles[i].id
      var Nom = this.doc.createElement('Nom'); Nom.innerHTML = this.obj_articles[i].nom
      var Qte = this.doc.createElement('Qte'); Qte.innerHTML = this.obj_articles[i].qte
      var FicheTechnique = this.doc.createElement('Fiche_Technique'); FicheTechnique.innerHTML = this.obj_articles[i].fiche_Technique
      var verif_qte = this.doc.createElement('Qte_Verifier'); verif_qte.innerHTML = this.obj_articles[i].controle_qt
      var verif_fiche = this.doc.createElement('Fiche_Technique_Verifier'); verif_fiche.innerHTML = this.obj_articles[i].controle_tech
      var total = this.doc.createElement('Total'); total.innerHTML = this.obj_articles[i].total

      var Supports = this.doc.createElement('Supports')    
      if (this.obj_articles[i].sup1 > 0) {
        var Support = this.doc.createElement('Support');
        var n_s = this.doc.createElement('Numero_Support'); n_s.innerHTML = "1";
        var qte_s = this.doc.createElement('Qte'); qte_s.innerHTML = this.obj_articles[i].sup1;
        Support.appendChild(n_s);Support.appendChild(qte_s);Supports.appendChild(Support);
      }
      if (this.obj_articles[i].sup2 > 0) {
        var Support = this.doc.createElement('Support');
        var n_s = this.doc.createElement('Numero_Support'); n_s.innerHTML = "2";
        var qte_s = this.doc.createElement('Qte'); qte_s.innerHTML = this.obj_articles[i].sup2;
        Support.appendChild(n_s);Support.appendChild(qte_s);Supports.appendChild(Support);
      }
      if (this.obj_articles[i].sup3 > 0) {
        var Support = this.doc.createElement('Support');
        var n_s = this.doc.createElement('Numero_Support'); n_s.innerHTML = "3";
        var qte_s = this.doc.createElement('Qte'); qte_s.innerHTML = this.obj_articles[i].sup3;
        Support.appendChild(n_s);Support.appendChild(qte_s);Supports.appendChild(Support);
      }
      if (this.obj_articles[i].sup4 > 0) {
        var Support = this.doc.createElement('Support');
        var n_s = this.doc.createElement('Numero_Support'); n_s.innerHTML = "4";
        var qte_s = this.doc.createElement('Qte'); qte_s.innerHTML = this.obj_articles[i].sup4;
        Support.appendChild(n_s);Support.appendChild(qte_s);Supports.appendChild(Support);
      }
      if (this.obj_articles[i].sup5 > 0) {
        var Support = this.doc.createElement('Support');
        var n_s = this.doc.createElement('Numero_Support'); n_s.innerHTML = "5";
        var qte_s = this.doc.createElement('Qte'); qte_s.innerHTML = this.obj_articles[i].sup5;
        Support.appendChild(n_s);Support.appendChild(qte_s);Supports.appendChild(Support);
      }
      if (this.obj_articles[i].sup6 > 0) {
        var Support = this.doc.createElement('Support');
        var n_s = this.doc.createElement('Numero_Support'); n_s.innerHTML = "6";
        var qte_s = this.doc.createElement('Qte'); qte_s.innerHTML = this.obj_articles[i].sup6;
        Support.appendChild(n_s);Support.appendChild(qte_s);Supports.appendChild(Support);
      }
      if (this.obj_articles[i].sup7 > 0) {
        var Support = this.doc.createElement('Support');
        var n_s = this.doc.createElement('Numero_Support'); n_s.innerHTML = "7";
        var qte_s = this.doc.createElement('Qte'); qte_s.innerHTML = this.obj_articles[i].sup7;
        Support.appendChild(n_s);Support.appendChild(qte_s);Supports.appendChild(Support);
      }
      if (this.obj_articles[i].sup8 > 0) {
        var Support = this.doc.createElement('Support');
        var n_s = this.doc.createElement('Numero_Support'); n_s.innerHTML = "8";
        var qte_s = this.doc.createElement('Qte'); qte_s.innerHTML = this.obj_articles[i].sup8;
        Support.appendChild(n_s);Support.appendChild(qte_s);Supports.appendChild(Support);
      }
      if (this.obj_articles[i].sup9 > 0) {
        var Support = this.doc.createElement('Support');
        var n_s = this.doc.createElement('Numero_Support'); n_s.innerHTML = "9";
        var qte_s = this.doc.createElement('Qte'); qte_s.innerHTML = this.obj_articles[i].sup9;
        Support.appendChild(n_s);Support.appendChild(qte_s);Supports.appendChild(Support);
      }
      if (this.obj_articles[i].sup10 > 0) {
        var Support = this.doc.createElement('Support');
        var n_s = this.doc.createElement('Numero_Support'); n_s.innerHTML = "10";
        var qte_s = this.doc.createElement('Qte'); qte_s.innerHTML = this.obj_articles[i].sup10;
        Support.appendChild(n_s);Support.appendChild(qte_s);Supports.appendChild(Support);
      }
      if (this.obj_articles[i].sup11 > 0) {
        var Support = this.doc.createElement('Support');
        var n_s = this.doc.createElement('Numero_Support'); n_s.innerHTML = "11";
        var qte_s = this.doc.createElement('Qte'); qte_s.innerHTML = this.obj_articles[i].sup11;
        Support.appendChild(n_s);Support.appendChild(qte_s);Supports.appendChild(Support);
      }
      if (this.obj_articles[i].sup12 > 0) {
        var Support = this.doc.createElement('Support');
        var n_s = this.doc.createElement('Numero_Support'); n_s.innerHTML = "12";
        var qte_s = this.doc.createElement('Qte'); qte_s.innerHTML = this.obj_articles[i].sup12;
        Support.appendChild(n_s);Support.appendChild(qte_s);Supports.appendChild(Support);
      }
      if (this.obj_articles[i].sup13 > 0) {
        var Support = this.doc.createElement('Support');
        var n_s = this.doc.createElement('Numero_Support'); n_s.innerHTML = "13";
        var qte_s = this.doc.createElement('Qte'); qte_s.innerHTML = this.obj_articles[i].sup12;
        Support.appendChild(n_s);Support.appendChild(qte_s);Supports.appendChild(Support);
      }
      if (this.obj_articles[i].sup14 > 0) {
        var Support = this.doc.createElement('Support');
        var n_s = this.doc.createElement('Numero_Support'); n_s.innerHTML = "14";
        var qte_s = this.doc.createElement('Qte'); qte_s.innerHTML = this.obj_articles[i].sup13;
        Support.appendChild(n_s);Support.appendChild(qte_s);Supports.appendChild(Support);
      }
      if (this.obj_articles[i].sup15 > 0) {
        var Support = this.doc.createElement('Support');
        var n_s = this.doc.createElement('Numero_Support'); n_s.innerHTML = "15";
        var qte_s = this.doc.createElement('Qte'); qte_s.innerHTML = this.obj_articles[i].sup14;
        Support.appendChild(n_s);Support.appendChild(qte_s);Supports.appendChild(Support);
      }
      if (this.obj_articles[i].sup16 > 0) {
        var Support = this.doc.createElement('Support');
        var n_s = this.doc.createElement('Numero_Support'); n_s.innerHTML = "16";
        var qte_s = this.doc.createElement('Qte'); qte_s.innerHTML = this.obj_articles[i].sup15;
        Support.appendChild(n_s);Support.appendChild(qte_s);Supports.appendChild(Support);
      }
      if (this.obj_articles[i].sup17 > 0) {
        var Support = this.doc.createElement('Support');
        var n_s = this.doc.createElement('Numero_Support'); n_s.innerHTML = "17";
        var qte_s = this.doc.createElement('Qte'); qte_s.innerHTML = this.obj_articles[i].sup16;
        Support.appendChild(n_s);Support.appendChild(qte_s);Supports.appendChild(Support);
      }
      if (this.obj_articles[i].sup18 > 0) {
        var Support = this.doc.createElement('Support');
        var n_s = this.doc.createElement('Numero_Support'); n_s.innerHTML = "18";
        var qte_s = this.doc.createElement('Qte'); qte_s.innerHTML = this.obj_articles[i].sup17;
        Support.appendChild(n_s);Support.appendChild(qte_s);Supports.appendChild(Support);
      }
      if (this.obj_articles[i].sup19 > 0) {
        var Support = this.doc.createElement('Support');
        var n_s = this.doc.createElement('Numero_Support'); n_s.innerHTML = "19";
        var qte_s = this.doc.createElement('Qte'); qte_s.innerHTML = this.obj_articles[i].sup18;
        Support.appendChild(n_s);Support.appendChild(qte_s);Supports.appendChild(Support);
      }
      if (this.obj_articles[i].sup20 > 0) {
        var Support = this.doc.createElement('Support');
        var n_s = this.doc.createElement('Numero_Support'); n_s.innerHTML = "20";
        var qte_s = this.doc.createElement('Qte'); qte_s.innerHTML = this.obj_articles[i].sup19;
        Support.appendChild(n_s);Support.appendChild(qte_s);Supports.appendChild(Support);
      }

      Produit.appendChild(id);
      Produit.appendChild(Nom);
      Produit.appendChild(Qte);
      Produit.appendChild(FicheTechnique);
      Produit.appendChild(verif_qte);
      Produit.appendChild(verif_fiche);
      Produit.appendChild(total);
      Produit.appendChild(Supports);
      Produits_Listes.appendChild(Produit)
    }
    var Supports_Listes = this.doc.createElement('Liste_Supports')
    for (let i = 0; i < this.arraySupport.length; i++) {
      var Support = this.doc.createElement('Support')
      var Numero = this.doc.createElement('Numero') ; Numero.innerHTML = i+1;
      var typeSupport = this.doc.createElement('typeSupport') ; typeSupport.innerHTML = this.arraySupport[i].value.typeSupport;
      var poids = this.doc.createElement('poids')  ; poids.innerHTML = this.arraySupport[i].value.poids;
      var hauteur = this.doc.createElement('hauteur') ; hauteur.innerHTML = this.arraySupport[i].value.hauteur;
      var largeur = this.doc.createElement('largeur') ; largeur.innerHTML = this.arraySupport[i].value.largeur;
      var longeur = this.doc.createElement('longeur')  ; longeur.innerHTML = this.arraySupport[i].value.longeur;
      Support.appendChild(Numero);
      Support.appendChild(typeSupport);
      Support.appendChild(poids);
      Support.appendChild(hauteur);
      Support.appendChild(largeur);
      Support.appendChild(longeur); 
      Supports_Listes.appendChild(Support);   
    }
      

    BR.appendChild(Etat);
    BR.appendChild(InformationsGenerales);
    BR.appendChild(Produits_Listes);
    BR.appendChild(Supports_Listes);

    this.doc.appendChild(BR)
    console.log(this.doc)

    var formData: any = new FormData();
    let url = "assets/BonRecpetion.xml";
     
     
    fetch(url)
      .then(response => response.text())
      .then(data => {
        let xml2string = new XMLSerializer().serializeToString(this.doc.documentElement);
        var myBlob = new Blob([xml2string], { type: 'application/xml' });
        var myFile = this.convertBlobFichier(myBlob, "assets/BonRecpetion.xml");
        console.log("id bon :", this.id)
        formData.append('Id', this.id);
        formData.append('Id_Be', this.id);
        formData.append('Etat', "En cours");
        formData.append('Responsable', "rochdi");
        formData.append('date', this.sysDate);
        formData.append('Local', "hhh");
        formData.append('Type_Be', this.type_bon);
        formData.append('Detail', myFile);
        formData.append('Nb_Support',this.nbSupport);
        this.service.createBonReception(formData).subscribe(data => {
          console.log("data: ",data);
          //this.bonReception = data

          Swal.fire(
            'Ajout Effecté',
            'Bon De Reception Ajouté Avec Sucées',
            'success'
          )
         
        },
          error => console.log(error));
      });
    console.log('bon reception cree',formData.values());

 
  }
    //convertir blob à un fichier  
    convertBlobFichier = (theBlob: Blob, fileName: string): File => {
      var b: any = theBlob;
      b.lastModifiedDate = new Date();
      b.name = fileName;
      return <File>theBlob;
    }
  imprimerFicheRecpetion() { }
}
