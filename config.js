/* ==========================================================
   CONFIGURATION DU SITE — modifie uniquement ce fichier
   ----------------------------------------------------------
   "url" accepte n'importe quel lien YouTube :
   https://www.youtube.com/watch?v=XXXX · https://youtu.be/XXXX
   https://www.youtube.com/shorts/XXXX · https://www.youtube.com/embed/XXXX
   Les champs description, year, duration, tag sont facultatifs.
   ========================================================== */

window.SITE_CONFIG = {
  siteName: "NEXUS",

  // Code d'accès (chiffres uniquement, 4 à 8 caractères)
  accessCode: "2077",

  // Page d'accueil : 1 grande vidéo + 3 vidéos en dessous
  home: {
    featured: {
      title: "Big Buck Bunny",
      description: "Un lapin géant au grand cœur décide de rendre la monnaie de leur pièce à trois rongeurs qui gâchent la paix de la forêt.",
      year: "2008", duration: "10 min", tag: "Nouveauté",
      url: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
    },
    rowTitle: "À la une",
    videos: [
      { title: "Sintel", description: "Une jeune femme part à la recherche du dragon qu'elle a élevé.", year: "2010", duration: "15 min", url: "https://www.youtube.com/watch?v=eRsGyueVLvQ" },
      { title: "Tears of Steel", description: "Dans un Amsterdam futuriste, des scientifiques tentent de sauver le monde.", year: "2012", duration: "12 min", url: "https://www.youtube.com/watch?v=R6MlUcmOul8" },
      { title: "Spring", description: "Une bergère et son chien affrontent les esprits anciens pour faire revenir le printemps.", year: "2019", duration: "8 min", url: "https://www.youtube.com/watch?v=WhWc3b3KhnY" },
    ],
  },


  // Page "Coulisses" — la 1re vidéo est mise en avant en haut de page.
  // "category" sert aux filtres (Making-of, Tournage, Interview, Bêtisier… libre à toi).
  behindTheScenes: [
    { title: "Making-of : construire un monde", category: "Making-of", duration: "14 min", description: "Des premiers croquis au rendu final : comment l'univers a pris forme, étape par étape.", url: "https://www.youtube.com/watch?v=TLkA0RELQ1g" },
    { title: "Sur le plateau", category: "Tournage", duration: "6 min", description: "Une journée de tournage, de l'installation des lumières au dernier clap.", url: "https://www.youtube.com/watch?v=SkVqJ1SGeL0" },
    { title: "Rencontre avec le réalisateur", category: "Interview", duration: "9 min", description: "Inspirations, doutes et choix de mise en scène racontés sans filtre.", url: "https://www.youtube.com/watch?v=Z4C82eyhwgU" },
    { title: "Les prises ratées", category: "Bêtisier", duration: "4 min", description: "Fous rires, chutes et répliques oubliées : le meilleur des ratés.", url: "https://www.youtube.com/watch?v=YE7VzlLtp-4" },
    { title: "Animation : du squelette au mouvement", category: "Making-of", duration: "11 min", description: "Comment un personnage passe d'un modèle figé à une performance pleine de vie.", url: "https://www.youtube.com/watch?v=u9lj-c29dxI" },
    { title: "Musique et sound design", category: "Interview", duration: "7 min", description: "L'équipe son dévoile les secrets de l'ambiance sonore.", url: "https://www.youtube.com/watch?v=Y-rmzh0PI3c" },
  ],

  // Page "Séries" — chaque série est une playlist de vidéos (épisodes numérotés automatiquement).
  // Ajoute, retire ou réordonne les séries et les épisodes librement.
  // ⚠️ Page désactivée pour le moment : passe showSeries à true pour l'afficher
  // (menu, page Séries, rangée "Nos séries" sur l'accueil et recherche).
  showSeries: false,
  series: [
    {
      title: "Longs métrages",
      description: "Nos films les plus ambitieux, à regarder confortablement installé.",
      episodes: [
        { title: "Sintel", duration: "15 min", description: "Une jeune femme part à la recherche du dragon qu'elle a élevé.", url: "https://www.youtube.com/watch?v=eRsGyueVLvQ" },
        { title: "Tears of Steel", duration: "12 min", description: "Dans un Amsterdam futuriste, des scientifiques tentent de sauver le monde.", url: "https://www.youtube.com/watch?v=R6MlUcmOul8" },
        { title: "Big Buck Bunny", duration: "10 min", description: "Un lapin géant au grand cœur face à trois rongeurs farceurs.", url: "https://www.youtube.com/watch?v=aqz-KE-bpKQ" },
        { title: "Cosmos Laundromat", duration: "12 min", description: "Un mouton dépressif et une infinité de vies possibles.", url: "https://www.youtube.com/watch?v=Y-rmzh0PI3c" },
      ],
    },
    {
      title: "Courts métrages",
      description: "Des histoires courtes, intenses et pleines d'idées.",
      episodes: [
        { title: "Spring", duration: "8 min", description: "Une bergère et son chien face aux esprits anciens.", url: "https://www.youtube.com/watch?v=WhWc3b3KhnY" },
        { title: "Coffee Run", duration: "3 min", description: "Une course effrénée sous caféine.", url: "https://www.youtube.com/watch?v=PVGeM40dABA" },
        { title: "Charge", duration: "4 min", description: "Un vieil homme défend sa dernière source d'énergie.", url: "https://www.youtube.com/watch?v=UXqq0ZvbOnk" },
        { title: "Agent 327", duration: "4 min", description: "Un agent secret dans un salon de coiffure très suspect.", url: "https://www.youtube.com/watch?v=mN0zPOpADL4" },
        { title: "Sprite Fright", duration: "10 min", description: "Des champignons qui n'aiment pas les intrus.", url: "https://www.youtube.com/watch?v=_cMxraX_5RE" },
      ],
    },
    {
      title: "Divertissement",
      description: "Défis, sketchs et moments à partager.",
      episodes: [
        { title: "Épisode pilote", duration: "1 min", description: "Là où tout a commencé.", url: "https://www.youtube.com/watch?v=jNQXAC9IVRw" },
        { title: "Le grand défi", duration: "5 min", description: "Un défi impossible, relevé (presque) sans tricher.", url: "https://www.youtube.com/watch?v=9xwazD5SyVg" },
        { title: "Best-of de la saison", duration: "8 min", description: "Les meilleurs moments réunis en une vidéo.", url: "https://www.youtube.com/watch?v=ScMzIvxBSi4" },
      ],
    },
    {
      title: "Clips musicaux",
      description: "Les clips que nous avons réalisés, du concept au montage final.",
      episodes: [
        { title: "Clip 01", duration: "4 min", url: "https://www.youtube.com/watch?v=kJQP7kiw5Fk" },
        { title: "Clip 02", duration: "4 min", url: "https://www.youtube.com/watch?v=OPf0YbXqDm0" },
        { title: "Clip 03", duration: "4 min", url: "https://www.youtube.com/watch?v=JGwWNGJdvx8" },
        { title: "Clip 04", duration: "4 min", url: "https://www.youtube.com/watch?v=9bZkp7q19f0" },
      ],
    },
    {
      title: "Tutos",
      description: "Apprends nos techniques pas à pas : tournage, montage, effets.",
      episodes: [
        { title: "Les bases, partie 1", duration: "4 h", description: "Tout pour bien démarrer, depuis zéro.", url: "https://www.youtube.com/watch?v=rfscVS0vtbw" },
        { title: "Les bases, partie 2", duration: "3 h", description: "On va plus loin avec des exemples concrets.", url: "https://www.youtube.com/watch?v=PkZNo7MFNFg" },
        { title: "Making-of décortiqué", duration: "14 min", description: "On analyse un making-of plan par plan.", url: "https://www.youtube.com/watch?v=TLkA0RELQ1g" },
      ],
    },
  ],

  // Page "À venir" — triée automatiquement par date (format AAAA-MM-JJ).
  // "url" = bande-annonce YouTube (facultatif). Sans bande-annonce, "image" (lien d'image) est utilisée si fournie.
  upcoming: [
    { title: "Agent 327 : Opération Barbier", date: "2027-01-16", tag: "Série", description: "L'agent secret le plus maladroit d'Europe reprend du service pour une mission à haut risque.", url: "https://www.youtube.com/watch?v=mN0zPOpADL4" },
    { title: "Coffee Run — Version longue", date: "2027-02-20", tag: "Film", description: "La course effrénée revient dans une version étendue avec des scènes inédites.", url: "https://www.youtube.com/watch?v=PVGeM40dABA" },
    { title: "Charge : la suite", date: "2027-04-03", tag: "Exclusivité", description: "Le dernier gardien de l'énergie doit désormais protéger toute une ville.", url: "https://www.youtube.com/watch?v=UXqq0ZvbOnk" },
    { title: "Projet secret", date: "2027-06-21", tag: "Teaser", description: "On ne peut rien dire… sauf que ça va être grand." },
  ],
};
