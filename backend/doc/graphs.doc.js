/**
  * @api {GET} /graphs/prestataire/:level/:name Obtient prestataires pour vision prestataires
  * @apiDescription Recherche les informations nécessaires pour
  * construire les graphes en fonction des déchets et prestataires
  * @apiGroup Graphs
  * @apiVersion 1.1.0
  * @apiParam (queryArgs) {number} level niveau voulu dans la hierarchie (allant
  * de 0 : central à 4 : site)
  * @apiParam (queryArgs) {string} name nom du lieu voulu dans sa hierarchie
  * (facultatif dans le cas d'une hierarchie 1 (niveau central))
  *
  * @apiExample {curl} Exemple
  *   curl -i http://localhost:4000/api/new/graphs/prestataires/4/GROUPEMENT%20THERMIQUE%20TAC
  *
  * @apiSuccess {JSONString} data Informations nécessaires à la construction
  * du graphe voulu
  * @apiError ResourceNotFound Impossible de trouver le lieu spécifié
  * @apiSuccessExample {json} Succès:
  {
    "globalData": {
        "volume_total": 95121.75550000033,
        "valorisation_totale": 88635.06649999996,
        "volume_l_verte": 87914.7784999999,
        "valorisation_l_verte": 84639.44099999985,
        "volume_region": 31.74400000000002,
        "valorisation_region": 23.28400000000001,
        "volume_l_verte_region": 26.484000000000023,
        "valorisation_l_verte_region": 19.064000000000004
    },
    "prestataires": [
        {
            "nom": "SCORIFRONTIGNAN",
            "localisation": "SUEZ",
            "siret": "31524980500138",
            "id": 755
        }
    ]
}
  */

  /**
    * @api {GET} /graphs/dechets/:level/:name Obtient déchets pour vision déchets
    * @apiDescription Recherche les informations nécessaires pour
    * construire les graphes en fonction des déchets et prestataires
    * @apiGroup Graphs
    * @apiVersion 1.1.0
    * @apiParam (queryArgs) {number} level niveau voulu dans la hierarchie (allant
    * de 0 : central à 4 : site)
    * @apiParam (queryArgs) {string} name nom du lieu voulu dans sa hierarchie
    * (facultatif dans le cas d'une hierarchie 1 (niveau central))
    *
    * @apiExample {curl} Exemple
    *   curl -i http://localhost:4000/api/new/graphs/dechets/4/GROUPEMENT%20THERMIQUE%20TAC
    *
    * @apiSuccess {JSONString} data Informations nécessaires à la construction
    * du graphe voulu
    * @apiError ResourceNotFound Impossible de trouver le lieu spécifié
    * @apiSuccessExample {json} Succès:
    {
        "globalData": {
            "volume_total": 95121.75550000033,
            "valorisation_totale": 88635.06649999996,
            "volume_l_verte": 87914.7784999999,
            "valorisation_l_verte": 84639.44099999985,
            "volume_region": 31.74400000000002,
            "valorisation_region": 23.28400000000001,
            "volume_l_verte_region": 26.484000000000023,
            "valorisation_l_verte_region": 19.064000000000004
        },
        "dechets": [
            {
                "codeinterne": "227",
                "is_listeverte": 0,
                "is_dangereux": 1,
                "libelle": "MÉLANGES DE DÉCHETS PROVENANT DE DESSABLEURS ET DE SÉPARATEURS EAU/HYDROCARBURES - 227",
                "code_europeen": "13 05 08*",
                "categorie": "DIS",
                "indicateur_national_valorisation": 0,
                "famille": "HYDROCARBURES,TOUS DÉCHETS,BOUES ET SEDIMENTS,EXPLOITATION",
                "id": 169
            },
            {
                "codeinterne": "118",
                "is_listeverte": 1,
                "is_dangereux": 1,
                "libelle": "ABSORBANTS, MATÉRIAUX FILTRANTS, CHIFFONS D'ESSUYAGE ET VÊTEMENTS DE PROTECTION CONTAMINÉS PAR DES SUSBTANCES DANGEREUSES - 118",
                "code_europeen": "15 02 02*",
                "categorie": "DIS",
                "indicateur_national_valorisation": 1,
                "famille": "LISTE VERTE,TOUS DÉCHETS,BILAN EUROP-06 DD DÉC CHIMIQU,EXPLOITATION",
                "id": 27
            }
        ]
    }
    */


    /**
      * @api {GET} /graphs/prestataire/:level/:name/dechets/:idPrestataire Obtient déchets pour un prestataire
      * @apiDescription Recherche les informations nécessaires pour
      * construire les graphes en fonction des déchets et prestataires
      * @apiGroup Graphs
      * @apiVersion 1.1.0
      * @apiParam (queryArgs) {number} level niveau voulu dans la hierarchie (allant
      * de 0 : central à 4 : site)
      * @apiParam (queryArgs) {string} name nom du lieu voulu dans sa hierarchie
      * (facultatif dans le cas d'une hierarchie 1 (niveau central))
      * @apiParam (queryArgs) {number} idPrestataire id du prestataire recherché
      *
      * @apiExample {curl} Exemple
      *   curl -i http://localhost:4000/api/new/graphs/prestataires/4/GROUPEMENT%20THERMIQUE%20TAC/dechets/755
      *
      * @apiSuccess {JSONString} data Informations nécessaires à la construction
      * du graphe voulu
      * @apiError ResourceNotFound Impossible de trouver le lieu spécifié
      * @apiSuccessExample {json} Succès:
      {
        "sites": {
            "quantity": [
                {
                    "dechet": {
                        "id": 169,
                        "codeinterne": "227",
                        "famille": "HYDROCARBURES,TOUS DÉCHETS,BOUES ET SEDIMENTS,EXPLOITATION",
                        "libelle": "MÉLANGES DE DÉCHETS PROVENANT DE DESSABLEURS ET DE SÉPARATEURS EAU/HYDROCARBURES - 227",
                        "is_listeverte": 0
                    },
                    "quantitee_traitee": 2.278
                },
                {
                    "dechet": {
                        "id": 27,
                        "codeinterne": "118",
                        "famille": "LISTE VERTE,TOUS DÉCHETS,BILAN EUROP-06 DD DÉC CHIMIQU,EXPLOITATION",
                        "libelle": "ABSORBANTS, MATÉRIAUX FILTRANTS, CHIFFONS D'ESSUYAGE ET VÊTEMENTS DE PROTECTION CONTAMINÉS PAR DES SUSBTANCES DANGEREUSES - 118",
                        "is_listeverte": 1
                    },
                    "quantitee_traitee": 0.333
                }
            ],
            "recycled": [
                {
                    "dechet": {
                        "id": 169,
                        "codeinterne": "227",
                        "famille": "HYDROCARBURES,TOUS DÉCHETS,BOUES ET SEDIMENTS,EXPLOITATION",
                        "libelle": "MÉLANGES DE DÉCHETS PROVENANT DE DESSABLEURS ET DE SÉPARATEURS EAU/HYDROCARBURES - 227",
                        "is_listeverte": 0
                    },
                    "quantitee_traitee": 2.278
                },
                {
                    "dechet": {
                        "id": 27,
                        "codeinterne": "118",
                        "famille": "LISTE VERTE,TOUS DÉCHETS,BILAN EUROP-06 DD DÉC CHIMIQU,EXPLOITATION",
                        "libelle": "ABSORBANTS, MATÉRIAUX FILTRANTS, CHIFFONS D'ESSUYAGE ET VÊTEMENTS DE PROTECTION CONTAMINÉS PAR DES SUSBTANCES DANGEREUSES - 118",
                        "is_listeverte": 1
                    },
                    "quantitee_traitee": 0.333
                }
            ]
        },
        "global": {...},
        "region": {...}
    }
      */

      /**
        * @api {GET} /graphs/dechets/:level/:name/prestataires/:idDechet Obtient prestataires pour un déchet
        * @apiDescription Recherche les informations nécessaires pour
        * construire les graphes en fonction des déchets et prestataires
        * @apiGroup Graphs
        * @apiVersion 1.1.0
        * @apiParam (queryArgs) {number} level niveau voulu dans la hierarchie (allant
        * de 0 : central à 4 : site)
        * @apiParam (queryArgs) {string} name nom du lieu voulu dans sa hierarchie
        * (facultatif dans le cas d'une hierarchie 1 (niveau central))
        * @apiParam (queryArgs) {number} idDechet id du déchet recherché
        *
        * @apiExample {curl} Exemple
        *   curl -i http://localhost:4000/api/new/graphs/dechets/4/GROUPEMENT%20THERMIQUE%20TAC/prestataires/27
        *
        * @apiSuccess {JSONString} data Informations nécessaires à la construction
        * du graphe voulu
        * @apiError ResourceNotFound Impossible de trouver le lieu spécifié
        * @apiSuccessExample {json} Succès:
        {
            "sites": {
                "quantity": [
                    {
                        "prestataire": {
                            "nom": "SCORIFRONTIGNAN",
                            "siret": "31524980500138",
                            "id": 755,
                            "localisation": "SUEZ"
                        },
                        "quantitee_traitee": 0.333
                    }
                ],
                "recycled": [
                    {
                        "prestataire": {
                            "nom": "SCORIFRONTIGNAN",
                            "siret": "31524980500138",
                            "id": 755,
                            "localisation": "SUEZ"
                        },
                        "quantitee_traitee": 0.333
                    }
                ]
            },
            "global": {...},
            "region": {...}
        }
        */
