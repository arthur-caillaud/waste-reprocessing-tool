# Ceci est le README.md du projet Akka Technologies x EDF

L'outil développé vise à piloter l'optimisation du retraitement des déchets de site d'EDF en France.

Backend : NodeJS Express App

Frontend : ReactJS App
<br/><br/><br/>
<h3>BackEnd</h3>

Le BackEnd est séparé en de nombreux dossiers. Nous expliquons ici ce qu'il en est.
<br/><br/>
<h5>Dossiers de gestion de BDD</h5>

Les dossiers :
* config
* migrations
* models
* seeders

ont été générés automatiquement par le module Sequelize, qui sert de middlework entre MySQL et notre application.
Le dossier models, plus particulièrement, contient tous les modèles de données, un fichier par table de BDD.
C'est dans ce dossier qu'il faut apporter des modifications lorsque l'on **souhaitera ajouter des indicateurs de performance financière**, dans la table indicateurs.

Le dossier migrations ne contient pour l'instant qu'un seul fichier, qui permet, à l'invocation de la commande

    sequelize db: migrate
de renouveler le contenu de la table distance, qui contient toutes les distances entre sites.

*Note : invoquer cette méthode requiert l'installation en global de sequelize-cli via npm*
<br/><br/>
<h5>Dossier datamanagement</h5>

Le dossier datamanagement contient les scripts permettant, à la réception d'un fichier excel dans le sous dossier /data, l'insertion de tous les bordereaux de l'excel directement dans la base de données interne de l'application.
**Une rapide modification de ce dossier permettra de récupérer directement une autre base de données en entrée, si le système de saisie via Excel est abandonné**.

On y trouve aussi les fonctions de connexion à la base de données.

*Note :  les fichiers de configuration sont dans le dossier config, à la racine + /backend
, c'est donc là qu'il faut modifier l'URL de la base de données, nom, mot de passe, etc...*

<br/>
<h5>App.js</h5>

Fichier lancé par la commande npm start qui démarre le serveur.
Les autres fichiers sont des fichiers de configuration classiques à la racine, récapitulant les packages installés.

<br/>
<h5>Dossier Routes</h5>

Ce dossier contient toutes les routes du backend. Lorsque le front fait une requête pour obtenir de la donnée, cette requête transite par app.js qui renvoie la requête vers le dossier routes.
On entre alors dans le fichier correspondant au type de données demandées.

Ces fichiers contiennent, de manière générale, des observers, qui attendent des réponses des services faisant le lien avec la base de données. Quand ces services remontent des informations, le dossier Routes les renvoie vers le Frontend.

<br/>
<h5>Dossier Services</h5>

Ce dossier contient les services de récupération de données dans les tables de la base de données. Les fichiers qu'il contient exposent des observables, qui sont observées par le dossier Routes. 
