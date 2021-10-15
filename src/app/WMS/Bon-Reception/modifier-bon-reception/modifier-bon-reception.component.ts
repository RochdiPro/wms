import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BonReceptionServiceService } from '../bon-reception-service.service';
import Swal from 'sweetalert2'
import { MatStepper } from '@angular/material/stepper';
import * as moment from 'moment';
import { HttpClient } from '@angular/common/http';
import * as xml2js from 'xml2js';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Ajouter_Bon_Rejet } from '../ajouter-bon-reception/ajouter-bon-reception.component';
import { Console } from 'console';
import { BrowserModule } from '@angular/platform-browser'
import { DatePipe } from '@angular/common';

declare var require: any

const pdfMake = require("pdfmake/build/pdfmake");
const pdfFonts = require("pdfmake/build/vfs_fonts");

pdfMake.vfs = pdfFonts.pdfMake.vfs;
@Component({
  selector: 'app-modifier-bon-reception',
  templateUrl: './modifier-bon-reception.component.html',
  styleUrls: ['./modifier-bon-reception.component.scss']
})
export class ModifierBonReceptionComponent implements OnInit {
  @ViewChild('stepper') private myStepper: any = MatStepper;

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
  Source: any;
  Destination: any;
  modele: any;
  bonReception: any;
  source_bon:any;
  id_bon_source :any ;
  nom_bon_Source:any;
  tel_bon_source:any;
  src:any;
  tel_bon_Source:any
  constructor(private datePipe: DatePipe ,private router: Router, private route: ActivatedRoute, public dialog: MatDialog, private _formBuilder: FormBuilder, private http: HttpClient, public service: BonReceptionServiceService) {
    this.service.Famille_Logistique().subscribe((data: any) => {
      this.Famille_Logistique = data;
    });
    this.chargementModel();
    this.modelePdfBase64();
    this.id = this.route.snapshot.params['id'];
    this.service.get_Bon_Reception_By_Id(this.id).subscribe(data => {
      this.bonReception = data;
      this.type_bon = this.bonReception.type_Be;
      this.Destination = this.bonReception.local
      this.nbSupport = this.bonReception.nb_Support
     
      if (this.type_bon=="Bon Entrée local") {
        this.service.get_Information_Bon_entree_Local( this.bonReception.id_Be).subscribe((data: any) => {
          this.Source = data.id_Fr
          this.Destination = data.local
          this.source_bon= "Fournisseur"
          this.id_bon_source = data.local_Source
          this.service.fournisseur(data.id_Fr).subscribe((data2) =>
          {
            this.src=data2;
            this.nom_bon_Source=this.src.nom_Fournisseur;
            this.tel_bon_Source=this.src.tel1;
             
          })
  
  
        });
      }
      else if (this.type_bon =="Importation") {
        this.service.get_Information_Bon_entree_Importation( this.bonReception.id_Be).subscribe((data: any) => {
          this.Source = data.id_Fr
          this.Destination = data.local
          this.source_bon= "Fournisseur"
          this.id_bon_source = data.local_Source
          this.service.fournisseur(data.id_Fr).subscribe((data2) =>
          {
            this.src=data2;
            this.nom_bon_Source=this.src.nom_Fournisseur;
            this.tel_bon_Source=this.src.tel1;
          })
  
        });
      }
      else if (this.type_bon == "Bon Retour") {
        this.service.get_Information_Bon_transfert( this.bonReception.id_Be).subscribe((data: any) => {
          
          this.Destination = data.local_Destination
          this.source_bon= "Entrepôt"
          this.nom_bon_Source= data.local_Source
          this.service.Filtre_Fiche_Local(data.local_Source).subscribe((data2) =>
          {
            this.src=data2;
            
            this.nom_bon_Source=this.src[0].nom_Local;
            this.tel_bon_Source=this.src[0].tel;
            this.id_bon_source=this.src[0].id_Local
            this.Source = this.src[0].id_Local
          })
        });
        
      }
      else if (this.type_bon == "Bon Transfert") {
        this.service.get_Information_Bon_retour( this.bonReception.id_Be).subscribe((data: any) => {
          this.Source = data.id_Clt
          this.Destination = data.local
          this.source_bon= "Client"
          this.id_bon_source = data.local_Source
          this.service.Client(data.id_Clt).subscribe((data2) =>
          {
            this.src=data2;
            this.nom_bon_Source=this.src.nom_Client;
            this.tel_bon_Source=this.src.tel1;
          })
        });
      }

    }, error => console.log(error));
    this.getDetail();


  }
  ngOnInit() {



    this.SupportFormGroup = this._formBuilder.group({
      typeSupport: new FormControl({ value: 'Pallette', disabled: true }, Validators.required),
      poids: new FormControl({ value: '1', disabled: true }, Validators.required),
      hauteur: new FormControl({ value: '1', disabled: true }, Validators.required),
      largeur: new FormControl({ value: '1', disabled: true }, Validators.required),
      longeur: new FormControl({ value: '1', disabled: true }, Validators.required),
      qte: new FormControl({ value: '1', disabled: true }, Validators.required),
    });
    this.ArticleFormGroup = this._formBuilder.group({
      famille_Logistique: new FormControl({ value: '', disabled: true }, Validators.required),
      sousFamille: new FormControl({ value: '', disabled: true }, Validators.required),
      qteth: new FormControl({ value: '', disabled: true }, Validators.required),
      support: new FormControl({ value: '', disabled: true }, Validators.required),
      totale: new FormControl({ value: '', disabled: true }, Validators.required),
    });
  }


  xmldata: any;
  obj_articles: any = [];
  supports: any = [];
  new_obj: any = {}
  sup: any = {}
  // Get Detail bon reception 
  getDetail() {
    this.service.Detail_Bon_Reception(this.id).subscribe((detail: any) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        this.bonReception = reader.result;
        var parseString = require('xml2js').parseString;
        let data1;
        parseString(atob(this.bonReception.substr(28)), function (err: any, result: any) {
          data1 = result.Bon_Reception;

        })
        this.xmldata= data1
        console.log( this.xmldata)
        for (let k = 0; k < this.xmldata.Liste_Supports[0].Support.length; k++) {
          this.arraySupport.push(this.ajouterligneSupport());
          this.arraySupport[k].Numero = this.xmldata.Liste_Supports[0].Support[k].Numero;
          this.arraySupport[k].typeSupport = this.xmldata.Liste_Supports[0].Support[k].typeSupport;
          this.arraySupport[k].poids = this.xmldata.Liste_Supports[0].Support[k].poids;
          this.arraySupport[k].hauteur = this.xmldata.Liste_Supports[0].Support[k].hauteur;
          this.arraySupport[k].largeur = this.xmldata.Liste_Supports[0].Support[k].largeur;
          this.arraySupport[k].longeur = this.xmldata.Liste_Supports[0].Support[k].longeur;
        }


        for (let i = 0; i < this.xmldata.Produits[0].Produit.length; i++) {

          this.new_obj = {}
          this.new_obj.id = this.xmldata.Produits[0].Produit[i].Id;
          this.new_obj.nom = this.xmldata.Produits[0].Produit[i].Nom;
          this.new_obj.fiche_Technique = this.xmldata.Produits[0].Produit[i].Fiche_Technique;

          this.new_obj.qte = this.xmldata.Produits[0].Produit[i].Qte;
          this.new_obj.famaille = this.xmldata.Produits[0].Produit[i].famaille;
          this.new_obj.sous_famaille = this.xmldata.Produits[0].Produit[i].sous_famaille;
          this.new_obj.total = this.xmldata.Produits[0].Produit[i].Total;

          this.supports = []
          for (let k = 0; k < this.arraySupport.length; k++) {
            this.support = {}
            this.support.id = k;
            this.support.qte = 0;
            this.supports.push(this.support);
          }

          if (this.xmldata.Produits[0].Produit[i].Supports[0].Support) {
            for (let h = 0; h < this.xmldata.Produits[0].Produit[i].Supports[0].Support.length; h++) {
              for (let z = 0; z < this.arraySupport.length; z++) {
                if (this.supports[z].id == this.xmldata.Produits[0].Produit[i].Supports[0].Support[h].Numero_Support) {
                  this.supports[z].qte = this.xmldata.Produits[0].Produit[i].Supports[0].Support[h].Qte
                }
              }

            }
          }
          this.new_obj.supports = this.supports;
          
          
          this.new_obj.controle_qt = true;
          this.new_obj.controle_tech =true ;
        
          if(this.xmldata.Produits[0].Produit[i].Qte_Verifier== 'false'){
          this.new_obj.controle_qt = false;
          }          
          if(this.xmldata.Produits[0].Produit[i].Fiche_Technique_Verifier == 'false')
          {
            this.new_obj.controle_tech =false;
          }
          this.obj_articles.push(this.new_obj)
        }
      }
      reader.readAsDataURL(detail);
    })
  }




  /*
  ****************************************           fonctions relative a steep 1   ********************************************** 
  */
  //supports: any = [];
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
      typeSupport: new FormControl({ value: 'Pallette', disabled: false }, Validators.required),
      poids: new FormControl({ value: '1', disabled: false }, Validators.required),
      hauteur: new FormControl({ value: '1', disabled: false }, Validators.required),
      largeur: new FormControl({ value: '1', disabled: false }, Validators.required),
      longeur: new FormControl({ value: '1', disabled: false }, Validators.required),
    });
  }


  /*
  ****************************************           fonctions relative a steep 3  ********************************************** 
  */



  Supports: any = [];
  support: any = {};


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
  //
  Modifier_Support(id: any) {
    const dialogRef = this.dialog.open(Modifier_Support, {
      width: 'auto',
      data: { objects: this.obj_articles, id: id }

    });
    dialogRef.afterClosed().subscribe(result => {
      this.calculeTotale(id);
    });

  }
  //calcule Totale Support
  calculeTotale(id: any) {

    for (let j = 0; j < this.obj_articles.length; j++) {
      if (id == this.obj_articles[j].id) {
        let sm = 0;

        for (let k = 0; k < this.obj_articles[j].supports.length; k++) {

          sm = Number(sm) + Number(this.obj_articles[j].supports[k].qte)
        }
        this.obj_articles[j].total = sm;
        if (this.obj_articles[j].total == this.obj_articles[j].qte) { this.obj_articles[j].controle_qt = true } else { this.obj_articles[j].controle_qt = false }
      }
    }
    console.log(this.obj_articles)

  }


  /*
  ****************************************           fonctions relative a steep 4  ********************************************** 
  */

  sysDate = new Date();
  // verifier le qualite d'article
  checkQualite(id: any) {
    for (let i = 0; i < this.obj_articles.length; i++) {
      if (this.obj_articles[i].id == id) {

        if (this.obj_articles[i].controle_tech == false) {
          this.obj_articles[i].controle_tech = true
        }
        else { this.obj_articles[i].controle_tech = false }

      }
    }
  }
  // function verife les controle Quaite QTe si verifier alors on peur imrimer enregistrer sinon le conserver  
  VerifierEetatbon: any = false;
  Verifier_etat_bon() {
 
    this.VerifierEetatbon = true;
    for (let i = 0; i < this.obj_articles.length; i++) {

      if (this.obj_articles[i].controle_tech == false) { this.VerifierEetatbon = false; }
      if (this.obj_articles[i].controle_qt == false) { this.VerifierEetatbon = false; }
    }
    console.log(this.VerifierEetatbon)
  }

  /*
   ****************************************           fonctions relative a steep 5  ********************************************** 
   */


  Valider: any = true;
  doc: any
  bon_reception: any

  //convertir blob à un fichier  
  convertBlobFichier = (theBlob: Blob, fileName: string): File => {
    var b: any = theBlob;
    b.lastModifiedDate = new Date();
    b.name = fileName;
    return <File>theBlob;
  }


  // creer le bon reception si etat verifier 
  Modifier_Bon_Reception() {
    this.doc = document.implementation.createDocument("Bon_Reception", "", null);
    var BR = this.doc.createElement("Bon_Reception");
    var Etat = this.doc.createElement("Etat"); Etat.innerHTML = "Validé"
    var source = this.doc.createElement("Source"); source.innerHTML = this.Source
    var distination = this.doc.createElement("Destination"); distination.innerHTML = this.Destination
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
      var famaille = this.doc.createElement('famaille'); famaille.innerHTML = this.obj_articles[i].famaille
      var s_famaille = this.doc.createElement('sous_famaille'); s_famaille.innerHTML = this.obj_articles[i].s_famaille

      var Supports = this.doc.createElement('Supports')

      for (let j = 0; j < this.obj_articles[i].supports.length; j++) {
        if (this.obj_articles[i].supports[j].qte > 0) {
          var Support = this.doc.createElement('Support');
          var n_s = this.doc.createElement('Numero_Support'); n_s.innerHTML = j;
          var qte_s = this.doc.createElement('Qte'); qte_s.innerHTML = this.obj_articles[i].supports[j].qte
          Support.appendChild(n_s); Support.appendChild(qte_s); Supports.appendChild(Support);
        }
      }


      Produit.appendChild(id);
      Produit.appendChild(Nom);
      Produit.appendChild(Qte);
      Produit.appendChild(FicheTechnique);
      Produit.appendChild(verif_qte);
      Produit.appendChild(verif_fiche);
      Produit.appendChild(total);
      Produit.appendChild(Supports);
      Produit.appendChild(famaille);
      Produit.appendChild(s_famaille);
      Produits_Listes.appendChild(Produit)
    }
    var Supports_Listes = this.doc.createElement('Liste_Supports')
    for (let i = 0; i < this.arraySupport.length; i++) {
      var Support = this.doc.createElement('Support')
      var Numero = this.doc.createElement('Numero'); Numero.innerHTML = i + 1;
      var typeSupport = this.doc.createElement('typeSupport'); typeSupport.innerHTML = this.arraySupport[i].value.typeSupport;
      var poids = this.doc.createElement('poids'); poids.innerHTML = this.arraySupport[i].value.poids;
      var hauteur = this.doc.createElement('hauteur'); hauteur.innerHTML = this.arraySupport[i].value.hauteur;
      var largeur = this.doc.createElement('largeur'); largeur.innerHTML = this.arraySupport[i].value.largeur;
      var longeur = this.doc.createElement('longeur'); longeur.innerHTML = this.arraySupport[i].value.longeur;
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
        formData.append('Etat', "Validé");
        formData.append('Responsable', "rochdi");
        formData.append('date', this.sysDate);
        formData.append('Local', this.Destination);
        formData.append('Type_Be', this.type_bon);
        formData.append('Detail', myFile);
        formData.append('Nb_Support', this.nbSupport);

        this.service.Modifier_BonReception(formData).subscribe((data) => {
          this.bon_reception = data
          Swal.fire(
            'Modification Effecté',
            'Bon De Reception Modifier Avec Sucées',
            'success'
          ).then((result) => {
            if (result.isConfirmed) {
              Swal.fire({
                title: 'Voulez vous imprimer ce Bon de Réception',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Oui',
                cancelButtonText: 'Non',
              }).then((result) => {
                if (result.isConfirmed) {

                  this.generatePDF(this.bon_reception.id, this.bon_reception.date_Creation);
              //    this.router.navigate(['Menu/WMS-Reception/Lister']);
                } else if (result.isDismissed) {
                  console.log('erreur  ');
                }
              });
            }
            this.router.navigate(['Menu/WMS-Reception/Lister']);
          });
        }, (err) => {



        });
      });




  }


  // conserver le bon si le etat non verifier 
  Conserver() {
    this.doc = document.implementation.createDocument("Bon_Reception", "", null);
    var BR = this.doc.createElement("Bon_Reception");
    var Etat = this.doc.createElement("Etat"); Etat.innerHTML = "En Attente"
    var source = this.doc.createElement("Source"); source.innerHTML = this.Source
    var distination = this.doc.createElement("Destination"); distination.innerHTML = this.Destination
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
      var famaille = this.doc.createElement('famaille'); famaille.innerHTML = this.obj_articles[i].famaille
      var s_famaille = this.doc.createElement('sous_famaille'); s_famaille.innerHTML = this.obj_articles[i].s_famaille

      var Supports = this.doc.createElement('Supports')

      for (let j = 0; j < this.obj_articles[i].supports.length; j++) {
        if (this.obj_articles[i].supports[j].qte > 0) {
          var Support = this.doc.createElement('Support');
          var n_s = this.doc.createElement('Numero_Support'); n_s.innerHTML = j;
          var qte_s = this.doc.createElement('Qte'); qte_s.innerHTML = this.obj_articles[i].supports[j].qte
          Support.appendChild(n_s); Support.appendChild(qte_s); Supports.appendChild(Support);
        }
      }


      Produit.appendChild(id);
      Produit.appendChild(Nom);
      Produit.appendChild(Qte);
      Produit.appendChild(FicheTechnique);
      Produit.appendChild(verif_qte);
      Produit.appendChild(verif_fiche);
      Produit.appendChild(total);
      Produit.appendChild(Supports);
      Produit.appendChild(famaille);
      Produit.appendChild(s_famaille);
      Produits_Listes.appendChild(Produit)
    }
    var Supports_Listes = this.doc.createElement('Liste_Supports')
    for (let i = 0; i < this.arraySupport.length; i++) {
      var Support = this.doc.createElement('Support')
      var Numero = this.doc.createElement('Numero'); Numero.innerHTML = i + 1;
      var typeSupport = this.doc.createElement('typeSupport'); typeSupport.innerHTML = this.arraySupport[i].value.typeSupport;
      var poids = this.doc.createElement('poids'); poids.innerHTML = this.arraySupport[i].value.poids;
      var hauteur = this.doc.createElement('hauteur'); hauteur.innerHTML = this.arraySupport[i].value.hauteur;
      var largeur = this.doc.createElement('largeur'); largeur.innerHTML = this.arraySupport[i].value.largeur;
      var longeur = this.doc.createElement('longeur'); longeur.innerHTML = this.arraySupport[i].value.longeur;
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
        formData.append('Etat', "En Attente");
        formData.append('Responsable', "rochdi");
        formData.append('date', this.sysDate);
        formData.append('Local', this.Destination);
        formData.append('Type_Be', this.type_bon);
        formData.append('Detail', myFile);
        formData.append('Nb_Support', this.nbSupport);
        this.service.Modifier_BonReception(formData).subscribe(data => {
          console.log("data: ", data);
          //this.bonReception = data

          Swal.fire(
            'Conserver',
            'Bon De Reception Modifier Avec Sucées',
            'success'
          )
          this.router.navigate(['Menu/WMS-Reception/Lister']);
        },
          error => console.log(error));
      });


  }


  modeleSrc: any;
  //impression de la fiche recption
  generatePDF(id: any, date_Creation: any) {

    var body = [];    
    var obj = new Array();
    obj.push(" ");
    obj.push(" ");
    obj.push(" ");
     
    body.push(obj);
    for (let i = 0; i < this.obj_articles.length; i++) {
      var obj = new Array();
      obj.push(""+this.obj_articles[i].id);
      obj.push(this.obj_articles[i].nom);
      obj.push(this.obj_articles[i].qte);
     
      body.push(obj);
    }
    let date_edit = this.datePipe.transform(new Date(), 'dd/MM/yyyy  | HH:MM');

    let def = {
      pageMargins: [40, 250, 40, 180],
      info: {
        title: 'Fiche Bon Réception',
      },
      
      footer: function (currentPage:any, pageCount:any) {
        return {
          margin: 35,
          columns: [
            {
              fontSize: 9,
              text: [
  
                {
                  text: currentPage.toString() + '/' + pageCount+"                                           éditer le  "+date_edit,
                }
              ],
              relativePosition: {x:250, y: 130}	
            } 
          ]
        };
      },
      header:[ 
      {
        text: ' ' + this.type_bon  ,
        fontSize: 10, 
        color: 'black',
        bold: true,
        relativePosition: {x:80, y:107}	  , 
         
      },
      {
        text: ' ' + this.id  ,
        fontSize: 10, 
        color: 'black',
        bold: true,
        relativePosition: {x:220, y:107}	  , 
         
      },
      {
        text:   sessionStorage.getItem('Utilisateur')  ,
        fontSize: 10, 
        color: 'black',
        bold: true,
        relativePosition: {x:390, y:96}	  , 
         
      },
      {
        text: ''+ this.datePipe.transform(date_Creation, 'dd/MM/yyyy')  ,
        fontSize: 10, 
        color: 'black',
        bold: true,
        relativePosition: {x:520, y:96}	  , 
         
      },
      
      {
        text: '' + this.Destination + '\n\n',
        fontSize: 10, 
        color: 'black',
        bold: true,
        relativePosition: {x:65, y:131}	       
      },
      {
        text: '' + this.source_bon + '\n\n',
        fontSize: 10, 
        color: 'black',
        bold: true,
        relativePosition: {x:69, y:154	 }      
      },
      {
        text: '' + this.nom_bon_Source + '\n\n',
        fontSize: 10, 
        color: 'black',
        bold: true,
        relativePosition: {x:180, y:154	 }      
      }
      ,
      {
        text: '' + this.Source + '\n\n',
        fontSize: 10, 
        color: 'black',
        bold: true,
        relativePosition: {x:200, y:179	 }      
      },
      
      {
        text: '' + this.tel_bon_Source + '\n\n',
        fontSize: 10, 
        color: 'black',
        bold: true,
        relativePosition: {x:64, y:179}	       
      },
      {
        text: '' + id + '\n\n',
        fontSize: 15, 
        color: 'black',
        bold: true,
        relativePosition: {x:370, y:182}	       
      },
     ] ,
     
     
      background: [
       
        {
          image: 'data:image/jpeg;base64,' + this.modeleSrc, width: 600          
        } 
      ],
      
   
      content: [
        
        {
          layout: 'lightHorizontalLines',
          table: {          
            widths: [ 80, 410, 38 ],         
            body: body, 
          },      
          fontSize: 10, 
          margin: [-16, -19 , 10,300]     
        }
        
         
      ],
      
    };

    pdfMake.createPdf(def).open({ defaultFileName: 'Bon_Reception.pdf' });

  }

  // temps d'attente pour le traitement de fonction 
  delai(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  // conversion de modele de pdf  en base 64 
  async modelePdfBase64() {
    await this.delai(1000);
    const lecteur = new FileReader();
    lecteur.onloadend = () => {
      this.modeleSrc = lecteur.result;
      this.modeleSrc = btoa(this.modeleSrc);
      this.modeleSrc = atob(this.modeleSrc);
      this.modeleSrc = this.modeleSrc.replace(/^data:image\/[a-z]+;base64,/, "");
    }
    lecteur.readAsDataURL(this.modele);
  }
  // récupération de modele pour créer le pdf
  async chargementModel() {
    this.http.get('./../../../assets/images/Bon_Reception.jpg', { responseType: 'blob' }).subscribe((reponse: any) => {
      this.modele = reponse;
      return this.modele;
    }, err => console.error(err))
  }

  /***
   *    etape genertation bon rejet
   * 
   */
   async Bon_rejet() {
    Swal.fire({
      title: 'Bon Rejet',
      text: "Marchandise Non Verifé",
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Rejeter Marchandise',
      cancelButtonText: 'Ressayé'

    }).then((result) => {
      if (result.isConfirmed) {

        const dialogRef = this.dialog.open(Ajouter_Bon_Rejet, {        
           
          width: 'auto',
          data: { objects: this.obj_articles,tel_bon_Source:this.tel_bon_Source,nom_bon_Source:this.nom_bon_Source,
             id_bon_source:this.Source,source_bon: this.source_bon, id_Bon: this.id, Destination: this.Destination,
              type: this.type_bon ,source :this.Source}
        });
        dialogRef.afterClosed().subscribe(result => {
        });

      }

    })
    
  }




}





//dialog detail
@Component({
  selector: 'Support',
  templateUrl: 'Supports.html',
})
export class Modifier_Support {


  obj_articles: any;
  Supports: any = [];
  id_article_ajour: any;
  h: any = {};
  constructor(public dialogRef: MatDialogRef<Ajouter_Bon_Rejet>, @Inject(MAT_DIALOG_DATA) public data: any, private _formBuilder: FormBuilder, private service: BonReceptionServiceService, private router: Router, private http: HttpClient) {


    this.obj_articles = data.objects

    this.id_article_ajour = data.id;


    for (let k = 0; k < this.obj_articles.length; k++) {
      if (this.obj_articles[k].id == data.id) {
        this.Supports = this.obj_articles[k].supports

      }
    }
 


  }
  set_qte(event: any, s: any, id_article: any) {
    console.log(event.target.value + "   " + s + "  " + id_article)
    for (let i = 0; i < this.obj_articles.length; i++) {

      if (this.obj_articles[i].id == this.id_article_ajour) {
        console.log(this.obj_articles[i].id)
        for (let k = 0; k < this.obj_articles[i].supports.length; k++) {
          if (this.obj_articles[i].supports[k].id == s) {

            this.obj_articles[i].supports[k].qte = event.target.value
          }
        }
      }

    }

  }


  onSubmit(rec: any) {

  }



  //fermer dialogue
  close() {
    this.dialogRef.close();
  }





}