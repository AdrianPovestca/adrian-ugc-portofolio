// ─────────────────────────────────────────────────────────────
//  Tot ce se schimbă des stă aici: reels, pachete, contact.
//  Nu trebuie să atingi App.tsx ca să adaugi un video.
// ─────────────────────────────────────────────────────────────

export const site = {
  name: 'adrian.script',
  fullName: 'Adrian Povestca',
  email: 'adrianscriptpov@gmail.com',
  instagram: 'https://www.instagram.com/adrian_script/',
  instagramReels: 'https://www.instagram.com/adrian_script/reels/',
}

export type Reel = {
  id: string
  title: string
  kind: string
  views: string
  note: string
  /** poster din /public/posters (și imaginea de acoperire până pornește videoul) */
  poster: string
  /** videoul final, pus manual în /public/reels, ex: '/reels/error-line-180.mp4' */
  video?: string
  /** link direct către reel pe Instagram, ex: 'https://www.instagram.com/reel/XXXX/' */
  instagram?: string
}

// Cum adaugi un reel nou: pui mp4-ul în /public/reels, apoi completezi `video`.
// Ordinea din listă = ordinea din carusel.
export const reels: Reel[] = [
  {
    id: 'error-line-180',
    title: 'Error in line 180',
    kind: 'Relatable coding',
    views: '500K+',
    note: 'The bug that ruins the whole afternoon. Everyone has one.',
    poster: '/posters/error-line-180.jpg',
    // video: '/reels/error-line-180.mp4',
    // instagram: 'https://www.instagram.com/reel/...',
  },
  {
    id: 'what-my-mom-thinks',
    title: 'What my mom thinks I do',
    kind: 'POV skit',
    views: '239K',
    note: 'Dark room, green terminal, zero explanation. People tagged their parents.',
    poster: '/posters/what-my-mom-thinks.jpg',
    // video: '/reels/what-my-mom-thinks.mp4',
  },
  {
    id: 'staring-at-code',
    title: 'Me staring at my code wondering why it actually works',
    kind: 'Relatable coding',
    views: '12.2K',
    note: 'The only thing scarier than a bug is code that works and you don’t know why.',
    poster: '/posters/staring-at-code.jpg',
    // video: '/reels/staring-at-code.mp4',
  },
]

// Lucrări pentru branduri. Aici nu afișăm vizualizări: contează munca, nu numerele.
export const brandWork = {
  client: 'Artisan Coffee Place',
  place: 'Bucharest',
  text: 'Four reels for a coffee place in Bucharest: the gear, the rituals, the morning dial-in. Real people, real counter, no stock footage.',
  // Spune adevărul aici. Dacă ai lucrat DIRECT cu aceste branduri, schimbă eticheta în 'In collaboration with'.
  clientLink: 'https://www.instagram.com/artisancoffeeplace/',
  featuringLabel: 'Gear and products on screen',
  featuring: ['Mahlkönig', 'La Marzocco', 'Bomber', 'Oatly'],
  videos: [
    {
      id: 'artisan-rituals',
      title: 'Rituals that speak for themselves',
      note: 'A pour-over, start to finish.',
      poster: '/posters/artisan-rituals.jpg',
      // video: '/reels/artisan-rituals.mp4',
      instagram: 'https://www.instagram.com/reel/DYKITMSTwki/',
    },
    {
      id: 'artisan-morning-dial-in',
      title: 'Morning dial in',
      note: 'The first shots of the day, before the doors open.',
      poster: '/posters/artisan-morning-dial-in.jpg',
      // video: '/reels/artisan-morning-dial-in.mp4',
      instagram: 'https://www.instagram.com/reel/DV72mrRDPjL/',
    },
    {
      id: 'artisan-bomber-unboxing',
      title: 'Bomber milk pitcher unboxing',
      note: 'A product unboxing shot at the counter.',
      poster: '/posters/artisan-bomber-unboxing.jpg',
      // video: '/reels/artisan-bomber-unboxing.mp4',
    },
    {
      id: 'artisan-oatly',
      title: 'Oatly pour',
      note: 'One carton, one close-up, one satisfying pour.',
      poster: '/posters/artisan-oatly.jpg',
      // video: '/reels/artisan-oatly.mp4',
    },
  ] as { id: string; title: string; note: string; poster: string; video?: string; instagram?: string }[],
}

export const formats = [
  {
    title: 'The “same” video',
    text: 'A daily tech struggle people recognise instantly: the bug, the deadline, the 2am fix. Your product shows up as the way out. This is the video people send to a friend.',
  },
  {
    title: 'Demo with a face',
    text: 'Screen recording of your app or tool, with me on camera reacting. The interface does the proving, I make it feel like a real person’s opinion.',
  },
  {
    title: 'Cinematic POV',
    text: 'Short, moody, well lit. Makes a tool or gadget look like part of someone’s life, not a feature list.',
  },
  {
    title: 'Hook variations',
    text: 'Same video, different first three seconds. You test which one stops the scroll and keep the winner.',
  },
]

// ADJUST: prețurile sunt orientative (USD).
// Preț „founding client": primii clienți plătesc mai puțin, în schimbare pentru un testimonial și permisiunea de a arăta proiectul.
// Pune aici câte locuri chiar vrei să oferi. Când ajunge la 0, site-ul arată automat prețurile normale.
export const foundingSpots: number = 3

export type Pack = {
  name: string
  bestFor: string
  price: string
  unit: string
  perVideo: string
  saving?: string
  note?: string
  featured?: boolean
  /** valorile care se schimbă cât timp există locuri founding */
  founding?: { price: string; perVideo: string; saving?: string }
  includes: string[]
}

export const packs: Pack[] = [
  {
    name: 'One video',
    bestFor: 'Testing an idea before you commit.',
    price: '$240',
    unit: 'one video',
    perVideo: '$240 per video',
    founding: { price: '$180', perVideo: '$180 per video' },
    includes: [
      'Concept, hook and talking points',
      '1 vertical video (9:16), up to 30 seconds',
      'Filmed, edited and captioned',
      '1 round of revisions',
      'Organic posting rights for 30 days',
    ],
  },
  {
    name: 'Launch kit',
    bestFor: 'A new app, feature or product that needs to land.',
    price: '$590',
    unit: 'three videos',
    perVideo: '$197 per video',
    saving: 'Save $130 vs. three single videos',
    featured: true,
    founding: { price: '$390', perVideo: '$130 per video', saving: 'Save $150 vs. three single videos' },
    includes: [
      '3 videos, three angles: relatable, demo with a face, cinematic POV',
      '2 extra hook variations to test',
      'Paid ads rights for 30 days on one platform (normally a $216 add-on)',
      'Short kickoff call so I get your product right',
      '1 round of revisions per video',
      'Filmed, edited and captioned',
    ],
  },
  {
    name: 'Monthly',
    bestFor: 'Brands that want a steady flow of fresh creative.',
    price: '$880',
    unit: 'per month, four videos',
    perVideo: '$220 per video',
    saving: 'Save $80 vs. four single videos',
    note: 'Opens after our first project together.',
    includes: [
      '4 videos a month, mixed angles',
      '2 hook variations a month',
      'Paid ads rights for 30 days on one platform',
      'Raw footage included',
      'Monthly planning call and a mid-month check-in',
      '2 rounds of revisions per video',
    ],
  },
]

export const addons = [
  { name: 'Paid ads rights', price: '+30% of the video price, per platform, per 30 days. One platform for 30 days is already in Launch kit and Monthly' },
  { name: 'Whitelisting (ads from my account)', price: '+30% of the video price, per month' },
  { name: 'Extra hook variation', price: '$30 each' },
  { name: 'Raw footage', price: '+30%' },
  { name: 'Rush delivery (under 72 hours)', price: '+30%' },
]

export const steps = [
  {
    title: 'Tell me about the product',
    text: 'No brief needed. Send a link, or we hop on a 15-minute call. I’ll ask what I need: who it’s for, what people should do after watching, and what makes it different.',
  },
  {
    title: 'I write the concepts',
    text: 'You get 2 or 3 ideas, each with a hook, the moment people recognise, and talking points. You pick one, change it or drop it before I film anything.',
  },
  {
    title: 'We agree the details and I start',
    text: 'The number of videos, where you can use them (organic or ads), revisions and price are confirmed in writing. A 30% deposit starts the work, and I begin as soon as I have access to the product.',
  },
  {
    title: 'I film and edit',
    text: 'Shot on camera, with screen recordings where the product needs to prove itself. The first cut usually lands in 5 to 7 days from the day I have the product and the approved concept.',
  },
  {
    title: 'You review, then get the files',
    text: 'You send your feedback in one batch and I apply it. Your package’s revision rounds are included. The balance is due when you approve the final cut, and the files arrive right after, ready to post or run as ads.',
  },
]
