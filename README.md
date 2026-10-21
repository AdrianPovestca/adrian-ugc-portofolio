# adrian.script — Tech UGC portfolio

React + TypeScript + Vite. Static site, ready for GitHub and Cloudflare Pages.

## Rulează local

```bash
npm install
npm run dev
```

## Ce schimbi tu, unde

Tot conținutul care se schimbă stă în `src/content.ts`: reels, pachete, add-ons, pași, email.

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
