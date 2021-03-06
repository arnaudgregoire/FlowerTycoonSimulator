# FlowerTycoonSimulator

FlowerTycoonSimulator est un jeu de stratégie en ligne dont le but est de vendre un maximum de fleurs. Développé par @arnaudgregoire, @ogus et @ThomasSINNO, Le jeu s'appuie sur une architecture HTML5, NodeJS et PostGreSQL.

![preview](img/preview.jpg)

## Développement

Trello : https://trello.com/b/VOPO9G3D/Planttycoonsimulator

## Dev Get started

Prérequis : avoir node/npm

 - cloner le dépot
 - npm install 

### Initialisation de la bdd

___________________________________________ deprecated

Sur Widows :

Télécharger  et installer postgres : https://www.postgresql.org/download/windows/

Sur Linux :

sudo apt-get install postgresql

Pour l'instant on créé un utlisateur 

user: postgres
mdp: postgres

et on créé une bdd flowertycoonsimulator (en ligne de commande ou avec pgadmin)

On éxécute ensuite le script testdb.js (à la racine)

Note : Si votre username/password n'est pas postgres/postgres il vous suffit de changer les connectionsString
('postgres://postgres:postgres@localhost:5432/flowertycoonsimulator')
dans testdb.js L2 et dans server/game.js L3

On peut ensuite faire npm start

 Le serveur tourne sur le port 8081.
 Le client est alors disponible à cette adresse: http://localhost:8081

____________________________________________________ end deprecated


passage à mongodb :

installer mongodb et mongo shell ( voir google )
lancer le service mongodb : "sudo service mongod start" ( c'est bien "mongod" et non mongodb )

exécuter le script new_mongodb.js avec node



## Principe

Il s'agit de créer un jeu multijoueur de stratégie par navigateur type Ogmae/Farmville.

## But

![preview](img/preview.jpg)

Une partie dure un temps déterminé (possiblement 1 jour)
Le but est d'engranger un maximum de points en réalisant des bouquets de fleurs.
Chaque bouquet de fleurs est constitué de fleurs aléatoires.
Pour faire pousser des fleurs, le joueur dispose de parcelles de terrains sur lesquelles il peut faire pousser des fleurs. Chaque fleur grandit avec le temps.
Mais attention, il y a un nombre limité de places sur le terrain.
Faites du commerce avec vos adversaires, rachetez les graines à bas prix, obtenez le monopole de la tulipe, utilisez les pesticides pour accélérer la croissance de vos plantes. Mais attention aux effets aléatoires, vous pourriez bien subir une vague de sauterelles ou un ouragan.

## Stratégie

Le joueur peut décider de :

 - planter une graine
 - récolter une graine
 - fertiliser une parcelle
 - Acheter une parcelle
 - vendre une ou plusieurs fleurs de son inventaire
 - planter une ou plusieurs graines de son inventaire
