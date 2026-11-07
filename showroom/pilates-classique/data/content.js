/* AZEL READY — SOURCE COMMUNE (V1)
   Toute donnée éditable possède une clé stable. La future application Azel Admin
   remplacera cette source par les données du client, sans réécriture du design.
   Le showroom utilise un contenu fictif. Pas d'interface d'administration réelle.
*/
window.AZEL_CONTENT = {
  schemaVersion: 1,
  business: {
    name: 'ATELIER PILATES',
    city: 'Paris',
    year: '',
    email: '',
    telephone: '',
    bookingUrl: '',
    address: '',
    discipline: 'PILATES CLASSIQUE',
  },
  appearance: {
    theme: 'olive',
    accent: '#8B9273',
  },
  hero: {
    kicker: 'UNE MAISON DÉDIÉE À LA MÉTHODE',
    title: 'Le mouvement, dans sa forme essentielle.',
    subTitle: 'Une méthode précise. Un enseignement vivant. Une attention portée à chaque geste.',
    image: 'assets/hero-studio.webp',
    imageAlt: 'Pratique du Pilates classique sur appareil en studio lumineux',
    titleEmphasis: 'dans sa forme',
  },
  method: {
    eyebrow: '01 / LA MÉTHODE',
    title: 'La force d’une méthode. La finesse d’un geste.',
    titleEmphasis: 'La finesse d’un geste.',
    text: 'Le Pilates classique est une méthode complète. Un travail d’équilibre, de force et de contrôle, guidé par la précision du mouvement.',
    principles: ['Concentration','Contrôle','Centre','Fluidité','Précision','Respiration'],
  },
  services: [
    {id:'cours-prive',number:'01',title:'Cours privés',description:'Un temps dédié à votre pratique, à votre rythme et à vos objectifs.',image:'assets/course-private.webp',imageAlt:'Pratique guidée sur appareil Pilates'},
    {id:'cours-duo',number:'02',title:'Cours en duo',description:'Partager une séance, progresser ensemble, conserver toute la précision du geste.',image:'assets/course-duo.webp',imageAlt:'Deux personnes sur reformers guidées par une enseignante'},
    {id:'cours-collectif',number:'03',title:'Petits groupes',description:'L’énergie du collectif, sans renoncer à l’attention portée à chacun.',image:'assets/course-collective.webp',imageAlt:'Trois personnes sur tapis accompagnées par une enseignante'},
  ],
  gallery: {
    studio: 'assets/studio-reformers.webp',
    detail: 'assets/equipment-detail.webp',
  },
  formation: {
    kicker: '04 / TRANSMISSION',
    title: 'Ce que l’on apprend, on le transmet.',
    titleEmphasis: 'on le transmet.',
    description: 'L’enseignement du Pilates se construit sur une pratique approfondie, l’observation et le soin apporté à chaque détail.',
  },
  contact: {
    heading: 'Un nouveau regard sur le mouvement.',
    headingEmphasis: 'le mouvement.',
    intro: 'Cours privés, duo, pratique collective, découvrons ensemble le format qui vous correspond.',
  },
  seo: {
    title: 'Atelier Pilates — Pilates classique à Paris | Concept Azel',
    description: 'Un concept de site éditorial pour un studio de Pilates classique. Démonstration Azel Studio.',
  },
};
