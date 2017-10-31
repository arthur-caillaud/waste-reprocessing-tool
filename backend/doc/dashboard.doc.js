/**
  * @api {GET} /dashboard/:level/:name Donne infos pour dashboard
  *
  * @apiDescription Recherche les informations nécessaires pour
  * construire la dashboard en fonction de l'endroit voulu.
  * @apiGroup Dashboard
  * @apiVersion 1.0.0
  * @apiParam (queryArgs) {number} level niveau voulu dans la hierarchie (allant
  * de 0 : central à 4 : site)
  * @apiParam (queryArgs) {string} name nom du lieu voulu dans sa hierarchie
  * (facultatif dans le cas d'une hierarchie 1 (niveau central))
  * @apiParam (queryParams) {number} beginDate première date
  * @apiParam (queryParams) {number} endDate dernière date
  *
  * @apiExample {curl} Exemple
  *   curl -i http://localhost:4000/api/dashboard/4/AGEN BARBUSSE?beginDate=2017-01-01&endDate=2017-03-01
  * @apiExample {curl} Exemple global
  *   curl -i http://localhost:4000/api/dashboard/0?beginDate=2017-01-01&endDate=2017-02-01
  *
  * @apiSuccess {JSONString} dashboard Informations nécessaires à la construction
  * de la dashboard sur le site voulu
  * @apiSuccessExample {json} Succès :

  [
    {
        "id": 118530,
        "ecarts_pesee": 0,
        "incoherences_filieres_norm": 0,
        "filieres_interdites_norm": 0,
        "retards_norm": 0,
        "volume_total": 3.114,
        "valorisation_totale": 3.114,
        "valorisation_l_verte": 3.114,
        "date": "2016-12-31T23:00:00.000Z",
        "incoherences_filieres_dd": 0,
        "filieres_interdites_dd": 0,
        "retards_dd": 0,
        "details": "",
        "id_site": 3,
        "volume_l_verte": 3.114,
        "bordereaux": 2,
        "non_dates": 0
    },
    {
        "id": 119020,
        "ecarts_pesee": 0,
        "incoherences_filieres_norm": 0,
        "filieres_interdites_norm": 0,
        "retards_norm": 0,
        "volume_total": 5.26,
        "valorisation_totale": 4.22,
        "valorisation_l_verte": 0,
        "date": "2017-01-31T23:00:00.000Z",
        "incoherences_filieres_dd": 0,
        "filieres_interdites_dd": 0,
        "retards_dd": 0,
        "details": "Aucun déchet en liste verte;",
        "id_site": 3,
        "volume_l_verte": 0,
        "bordereaux": 4,
        "non_dates": 0
    }
]
  * @apiError ResourceNotFound Impossible de trouver le lieu spécifié
  */


  /**
    * @api {GET} /dashboard/details/:level/:name Donne détails pour dashboard
    *
    * @apiDescription Recherche les informations nécessaires pour
    * construire la dashboard en fonction de l'endroit voulu. Ici les détails sont
    * données (on donne les bordereaux concernés par chaque problème)
    * @apiGroup Dashboard
    * @apiVersion 1.0.0
    * @apiParam (queryArgs) {number} level niveau voulu dans la hierarchie (allant
    * de 0 : central à 4 : site)
    * @apiParam (queryArgs) {string} name nom du lieu voulu dans sa hierarchie
    * (facultatif dans le cas d'une hierarchie 1 (niveau central))
    * @apiParam (queryParams) {number} beginDate première date
    * @apiParam (queryParams) {number} endDate dernière date
    *
    * @apiExample {curl} Exemple
    *   curl -i http://localhost:4000/api/dashboard/details/2/SEI REUNION?beginDate=2017-01-01&endDate=2017-12-31
    * @apiExample {curl} Exemple global
    *   curl -i http://localhost:4000/api/dashboard/details/0?beginDate=2017-01-01&endDate=2017-02-01
    *
    * @apiSuccess {JSONString} dashboard Informations nécessaires à la construction
    * de la dashboard sur le site voulu
    * @apiSuccessExample {json} Succès :
    {
        "ecarts_pesee": [],
        "incoherences_filieres_norm": [],
        "incoherences_filieres_dd": [],
        "filieres_interdites_norm": [],
        "filieres_interdites_dd": [],
        "retards_norm": [
            {
                "bordereau": {
                    "id": 11419,
                    "num_bordereau": "4815162342",
                    "cas": null,
                    "nom_emetteur": "ORNYTHORYNQUE",
                    "bordereau_finished": 0,
                    "mode_suivi": "BON",
                    "id_traitement_prevu": 1,
                    "id_dechet": 1,
                    "ref_dossier": null,
                    "id_site": 1,
                    "id_transport_1": 6221,
                    "quantitee_transportee": 1337,
                    "quantitee_finale": 42,
                    "quantitee_estimee": 1,
                    "id_traitement_inter": null,
                    "id_transport_2": null,
                    "id_traitement_final": 8051
                },
                "dechet": {
                    "codeinterne": "052B",
                    "is_listeverte": 1,
                    "is_dangereux": 0,
                    "libelle": "DND EN MÉLANGE, ASSIMILABLES AUX ORDURES MÉNAGÈRES (HORS PAPIER, CARTON, MÉTAL, PLASTIQUE, VERRE ET BOIS) - 052B",
                    "code_europeen": "20 03 01",
                    "categorie": "DIB",
                    "indicateur_national_valorisation": 1,
                    "famille": "LISTE VERTE,TOUS DÉCHETS,BILAN EUROP-34 DND OM ET ASSIM,BILAN EUROP-35 DIB MÉNAGERS,TOUT VENANT,EXPLOITATION",
                    "id": 1
                },
                "site": {
                    "nom": "AGENCE LE PORT",
                    "site_production": "AGENCE CLIENTÈLE DU PORT",
                    "unite_dependance": "SEI REUNION CLIENTÈLE",
                    "up_dependance": "SEI REUNION",
                    "metier_dependance": "SEI",
                    "id": 1
                },
                "transport1": {
                    "id": 6221,
                    "date": "2016-02-13T23:00:00.000Z",
                    "mode": null,
                    "id_transporteur": 1,
                    "recepisse": null,
                    "immatriculation": null
                }
            },
            {
                "bordereau": {
                    "id": 594,
                    "num_bordereau": "17B0001",
                    "cas": "1",
                    "nom_emetteur": "ADYKARINN MICHELLE",
                    "bordereau_finished": 0,
                    "mode_suivi": "BSDD",
                    "id_traitement_prevu": 2,
                    "id_dechet": 71,
                    "ref_dossier": null,
                    "id_site": 83,
                    "id_transport_1": 366,
                    "quantitee_transportee": 0.29,
                    "quantitee_finale": 0,
                    "quantitee_estimee": 1,
                    "id_traitement_inter": null,
                    "id_transport_2": null,
                    "id_traitement_final": 480
                },
                "dechet": {
                    "codeinterne": "400",
                    "is_listeverte": 1,
                    "is_dangereux": 0,
                    "libelle": "COMPTEURS ÉLECTRIQUES - 400",
                    "code_europeen": "16 02 14",
                    "categorie": "DIB",
                    "indicateur_national_valorisation": 1,
                    "famille": "LISTE VERTE,TOUS DÉCHETS,DEEE (IN ET OUT),BILAN EUROP-25 DND ÉQUIP HS,EXPLOITATION",
                    "id": 71
                },
                "site": {
                    "nom": "CLIENTÈLE MOUFIA",
                    "site_production": null,
                    "unite_dependance": "SEI REUNION CLIENTÈLE",
                    "up_dependance": "SEI REUNION",
                    "metier_dependance": "SEI",
                    "id": 83
                },
                "transport1": {
                    "id": 366,
                    "date": "2017-03-23T23:00:00.000Z",
                    "mode": "ROUTE",
                    "id_transporteur": 80,
                    "recepisse": "974-156",
                    "immatriculation": null
                }
            }
        ],
        "retards_dd": [],
        "bordereaux": 44,
        "non_dates": [
            {
                "bordereau": {
                    "id": 594,
                    "num_bordereau": "17B0001",
                    "cas": "1",
                    "nom_emetteur": "ADYKARINN MICHELLE",
                    "bordereau_finished": 0,
                    "mode_suivi": "BSDD",
                    "id_traitement_prevu": 2,
                    "id_dechet": 71,
                    "ref_dossier": null,
                    "id_site": 83,
                    "id_transport_1": 366,
                    "quantitee_transportee": 0.29,
                    "quantitee_finale": 0,
                    "quantitee_estimee": 1,
                    "id_traitement_inter": null,
                    "id_transport_2": null,
                    "id_traitement_final": 480
                }
            },
        ]
    }
    * @apiError ResourceNotFound Impossible de trouver le lieu spécifié
    */




  /**
    * @api {GET} /architecture/ Donne architecture
    * @apiDescription Récupère l'architecture globale de l'organisation
    * de tous les sites possibles
    * @apiGroup Dashboard
    * @apiVersion 1.0.0
    *
    * @apiExample {curl} Exemple
    *   curl -i http://localhost:4000/api/dashboard/dashboard
    *
    * @apiSuccess {JSONString} dashboard Architecture du site
    * @apiError ResourceNotFound Impossible de trouver le lieu spécifié
    * @apiSuccessExample {json} Succès:
    {
    "niveau": 0,
    "SEI": {
        "niveau": 1,
        "SEI REUNION": {
            "niveau": 2,
            "SEI REUNION CLIENTÈLE": {
                "niveau": 3,
                "AGENCE LE PORT": {
                    "niveau": 4
                },
                "CLIENTÈLE MOUFIA": {
                    "niveau": 4
                }
            },
            "SEI REUNION PRODUCTION": {
                "niveau": 3,
                "GROUPE HYDRAULIQUE BOURBIER": {
                    "niveau": 4
                },
                "GROUPEMENT THERMIQUE CENTRALE DU PORT": {
                    "niveau": 4
                },
                "GROUPEMENT THERMIQUE TAC": {
                    "niveau": 4
                }
            }
        }
    }
    */
