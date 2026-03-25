# Pointeuse

Application web de gestion de pointage, installable en PWA.

## TODO — Assets à créer manuellement

### Icônes PWA (`public/icons/`)

- [ ] `icon-192.png` (192×192 px)
- [ ] `icon-512.png` (512×512 px)

**Spécifications visuelles :**
- Fond : `#020617` (slate-950)
- Lettre **"P"** centrée, couleur : `#3b82f6` (bleu)
- Style minimaliste, carré, **sans arrondi**

Ces fichiers sont référencés dans `public/manifest.json` et `index.html`.

---

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

## Configuration réseau

**Ajout :**

```powershell
netsh interface portproxy add v4tov4 listenport=5174 listenaddress=0.0.0.0 connectport=5174 connectaddress=172.30.243.95
netsh advfirewall firewall add rule name="Vite Dev" dir=in action=allow protocol=TCP localport=5174
```

**Supprimer :**

```powershell
netsh advfirewall firewall delete rule name="Vite Dev"
netsh interface portproxy delete v4tov4 listenport=5174 listenaddress=0.0.0.0
powershell -Command "Get-NetConnectionProfile | Set-NetConnectionProfile -NetworkCategory Public"
```

**Consulter :**

```powershell
netsh interface portproxy show all
```