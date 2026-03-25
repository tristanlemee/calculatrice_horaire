# Pointeuse

Application web de gestion de pointage, installable en PWA.

## Développement

```bash
npm run dev       # Lance le serveur (exposé sur le réseau local via --host)
npm run build     # Build de production
npx serve dist    # Tester le mode offline après build
```

## Architecture

```
src/
  components/     → Composants React (UI)
  hooks/          → Hooks personnalisés
  contexts/       → Contextes React (état global)
  models/         → Types et interfaces TypeScript
public/
  icons/          → Icônes PWA
  manifest.json   → Manifest PWA
  sw.js           → Service Worker
```