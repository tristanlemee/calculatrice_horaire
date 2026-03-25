# Pointeuse — Spécifications projet

## Contexte
Application web client-side de gestion de pointage pour salariés, installable en PWA (Progressive Web App) pour un usage mobile offline. Aucun backend. Persistance via localStorage (uniquement pour les paramètres utilisateur).

## Stack technique
- React 18+ avec TypeScript strict
- Vite
- Tailwind CSS (utility-first, pas de CSS custom sauf variables)
- Lucide React (icônes)
- PWA manuelle (Service Worker + manifest écrits à la main, aucun plugin)
- Aucune dépendance supplémentaire

## Architecture
```
src/
  components/       → Composants React (UI)
  hooks/            → Hooks personnalisés
  contexts/         → Contextes React (état global)
  models/           → Types et interfaces TypeScript
  App.tsx
  main.tsx
public/
  icons/            → Icônes PWA (192x192 et 512x512)
  manifest.json     → Manifest PWA
  sw.js             → Service Worker
```

Alias configurés :
- `@components` → `src/components`
- `@hooks` → `src/hooks`
- `@contexts` → `src/contexts`
- `@models` → `src/models`

## PWA (configuration manuelle)
L'application doit être installable sur mobile et fonctionner entièrement hors-ligne après la première visite. Tout est fait à la main, sans plugin.

### Fichiers PWA :

**`public/manifest.json`** :
- name: "Pointeuse"
- short_name: "Pointeuse"
- description: "Gestion de pointage et calcul d'écart horaire"
- start_url: "/"
- scope: "/"
- theme_color: "#020617" (slate-950)
- background_color: "#020617"
- display: "standalone"
- orientation: "portrait"
- icons : références vers icon-192.png et icon-512.png (+ maskable pour 512)

**`public/sw.js`** — Service Worker avec stratégie cache-first :
- À l'événement `install` : ouvrir un cache nommé (ex: `pointeuse-v1`) et y precacher `/` et `/index.html`
- À l'événement `activate` : supprimer les anciens caches (ceux dont le nom ne correspond pas à la version courante)
- À l'événement `fetch` : stratégie cache-first — chercher dans le cache d'abord, si absent faire le fetch réseau, cloner la réponse, la mettre en cache, et la retourner
- IMPORTANT : comme Vite génère des noms de fichiers hashés (ex: `assets/index-a1b2c3.js`), le Service Worker ne peut pas lister ces fichiers en dur. Donc à l'install, ne precacher que `/` et `/index.html`, et laisser le handler fetch mettre en cache dynamiquement les autres assets au fur et à mesure des requêtes.
- Ne cacher que les requêtes GET avec une URL en http/https

**Enregistrement du Service Worker** dans `src/main.tsx` :
```ts
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
  })
}
```

### Prompt d'installation :
- Détecter l'événement `beforeinstallprompt` dans l'app
- Proposer un bouton "Installer" dans le header si l'app n'est pas déjà installée
- Ce bouton sera implémenté dans le prompt 7 (Header + assemblage)

### Développement mobile local :
- Le script `dev` dans package.json expose le serveur sur le réseau local :
  `"dev": "vite --host"`
  Cela permet de tester sur mobile via l'IP locale (ex: http://192.168.x.x:5173)
- Note : le Service Worker ne fonctionne qu'en HTTPS ou sur localhost. En dev local via IP réseau, le SW ne sera pas actif. Pour tester le mode offline : `npm run build` puis `npx serve dist`.

## Règles métier

### Paramètres configurables (pas de valeur hardcodée)
- Durée pause méridienne minimale : 45 minutes (défaut)
- Durée journée de travail : 7 heures (défaut)
- Plage d'arrivée autorisée : 07:00 – 10:00 (défaut)
- Plage de départ autorisée : 15:15 – 19:15 (défaut)

### Écart
- Positif = heures supplémentaires accumulées
- Négatif = heures à rattraper
- L'écart est optionnel en entrée (défaut : 0)

### Logique de calcul (CRITIQUE)
Le système cherche à **minimiser la valeur absolue de l'écart** tout en respectant les plages horaires.

Exemples :
- Arrivée 08:00, journée 7h, pause 45min → départ théorique = 15:45. Si écart = +01:00, le système propose départ = 14:45 (écart résultant = 0). Si 14:45 < plage départ min (15:15), alors départ = 15:15 et écart résultant = +00:30.
- Départ souhaité 15:45, journée 7h, pause 45min → arrivée théorique = 08:00. Si écart = -02:00, arrivée théorique = 06:00, mais 06:00 < plage arrivée min (07:00), donc arrivée = 07:00 et écart résultant = -01:00.

Formule de base : `départ = arrivée + durée_journée + pause_méridienne`

Avec écart : le système tente d'absorber l'écart en ajustant l'heure calculée, puis clamp aux plages autorisées, puis recalcule l'écart résultant.

### Trois modes de calcul
1. **Arrivée → Départ** : saisir heure d'arrivée (+ écart optionnel) → affiche heure de départ + écart résultant
2. **Départ → Arrivée** : saisir heure de départ souhaitée (+ écart optionnel) → affiche heure d'arrivée nécessaire + écart résultant
3. **Arrivée + Départ → Écart** : saisir arrivée et départ (+ écart optionnel) → affiche le nouvel écart

## Design
- Dark mode obligatoire
- Palette : bleu (primaire), blanc (texte), rouge (accents/alertes)
- Style sobre, moderne, **aucun border-radius** (0 arrondi partout)
- Typographie nette et lisible
- Aucune esthétique "AI générique"
- Safe areas respectées pour les appareils avec encoche/barre de navigation gestuelle

## Conventions de code
- TypeScript strict, pas de `any`
- Composants fonctionnels uniquement
- Hooks personnalisés pour la logique réutilisable
- Context API pour les paramètres globaux
- Nommage : PascalCase composants, camelCase fonctions/variables, UPPER_SNAKE_CASE constantes
- Tout texte UI en français

## localStorage
- Clé : `pointeuse_settings`
- Stocke uniquement les paramètres (pause, durée journée, plages horaires)
- Les données de calcul ne sont PAS persistées
