# adrian.script — Tech UGC portfolio

React + TypeScript + Vite. Static site, ready for GitHub and Cloudflare Pages.

## Rulează local

```bash
npm install
npm run dev
```

## Ce schimbi tu, unde

Tot conținutul care se schimbă stă în `src/content.ts`: reels, pachete, add-ons, pași, email.

## Formularul de contact (butoanele „Ask about this" și „Send me a message")

Butoanele deschid o fereastră cu formular (nume, email, produs/link, pachet, mesaj).

- **Fără cheie** (cum e acum): la „Open in my email" se deschide Gmail (pe telefon, aplicația de mail) cu adresa ta și mesajul deja scris. Vizitatorul apasă doar Send.
- **Cu cheie Web3Forms** (recomandat): mesajul ajunge direct în inboxul tău, fără ca vizitatorul să aibă Gmail.
  1. Intră pe web3forms.com, scrie `adrianscriptpov@gmail.com`, primești pe email o „Access Key".
  2. Pune-o în `src/content.ts`, la `site.formKey: 'cheia-ta'`. Cheia e publică prin design, nu e un secret.
  3. `git add .`, `git commit`, `git push`. Trimite-ți un mesaj de test de pe site.
  Planul gratuit are 250 mesaje pe lună.

## Poza din hero

Pune poza ta în `public/hero.jpg` (vertical, minim 900 px lățime, fără text pe ea) și ai terminat. Calea se schimbă în `site.heroPhoto`. Pentru video în loc de poză: `site.heroMedia: 'video'` (folosește primul reel, dacă are `video`).

## Cel mai rapid: toate videourile cu o singură comandă

1. Pune toate videourile într-un folder (ex: Desktop/videouri) și dă-le numele reel-urilor:
   `error-line-180`, `what-my-mom-thinks`, `staring-at-code`, `artisan-rituals`, `artisan-morning-dial-in`, `artisan-bomber-unboxing`, `artisan-oatly` (extensia nu contează; majusculele și spațiile nu contează).
2. Rulează:
   ```bash
   npm run videos -- ~/Desktop/videouri
   ```
   Convertește fiecare video în formatul potrivit, îl pune în `public/reels/`, îl activează în `src/content.ts` și verifică totul. La final îți spune ce fișiere n-a recunoscut și ce mai lipsește.
3. `npm run dev`, apeși play ca să testezi, apoi `git add .`, `git commit`, `git push`.

Nu ai nevoie de Homebrew: ffmpeg vine cu `npm install` (pachetul `ffmpeg-static`). Dacă tot lipsește: `node node_modules/ffmpeg-static/install.js`.

## Videouri: pas cu pas, unul câte unul (3 pași)

1. **Convertește** fiecare video (H.264, vertical 1080x1920, sub 25 MB) direct în `public/reels/`, cu numele din `src/content.ts`:
   ```bash
   npm run convert -- ~/Desktop/clipul-meu.mov error-line-180
   ```
   (Nu ai nevoie de Homebrew: ffmpeg vine cu `npm install` (pachetul `ffmpeg-static`). Dacă tot lipsește: `node node_modules/ffmpeg-static/install.js`.)
2. **Activează** reel-ul: în `src/content.ts` scoți `//` din linia `video: '/reels/error-line-180.mp4'`.
3. **Verifică** înainte de push:
   ```bash
   npm run check:videos
   ```
   Îți spune exact ce nu e în regulă: fișier lipsă, nume greșit, prea mare, HEVC în loc de H.264 sau video pe orizontală.

Redarea pe site: primul video pornește singur (fără sunet) când ajungi la Reels, la final urmează următorul în ordine, iar la click pe alt video îl pornește pe acela și îl oprește pe cel dinainte. Sunetul se activează din butonul de pe card și rămâne pornit pentru videourile următoare.

### Cum adaugi un video (reels sau brand work)

1. Exportă videoul **1080×1920, H.264, sub 25 MB** (limita Cloudflare Pages pe fișier). Comandă ffmpeg:
   ```bash
   ffmpeg -i input.mov -vf "scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2" \
     -c:v libx264 -crf 22 -preset slow -c:a aac -b:a 128k -movflags +faststart public/reels/nume-video.mp4
   ```
2. Pune un poster (primul cadru, JPG) în `public/posters/`.
3. În `src/content.ts`, adaugă un obiect în `reels` (sau completează `video: '/reels/nume-video.mp4'` la unul existent).
4. Fără câmpul `video`, cardul rămâne doar poster și nu duce nicăieri. Cu `video`, se redă direct în pagină, cu buton de sunet. Câmpul `instagram` e opțional și apare doar ca link mic sub card.
5. Același lucru pentru videourile Artisan, din `brandWork.videos` (liniile cu `// video:` sunt deja pregătite, scoate `//`).

Dacă un video depășește 25 MB, folosește Cloudflare Stream/R2 sau lasă linkul de Instagram.

## Înainte să publici

- [ ] Verifică emailul din `src/content.ts` (`site.email`): acum e `adrianscriptpov@gmail.com`, exact cum a fost scris
- [ ] Verifică prețurile și ce include fiecare pachet (sunt orientative)
- [ ] Verifică „5 to 7 days” din `steps` și „Best value” din pachete
- [ ] Pune link-ul direct al fiecărui reel în `instagram`
- [ ] Actualizează vizualizările din când în când

## Publicare pe Cloudflare Pages

1. Urcă repo-ul pe GitHub.
2. Cloudflare → Workers & Pages → Create → Pages → Connect to Git.
3. Build command: `npm run build` · Build output directory: `dist`.
4. Fiecare `git push` pe `main` publică automat.
