# Starship Progress Monitor

Live dashboard tracking SpaceX Starship integrated flight tests, milestones, and upcoming launches.

**Live:** [bennettwells.net/starship](https://bennettwells.net/starship)

## Features

- Hero dashboard with status, metrics, and Flight 14 countdown
- Interactive flight timeline (IFT-1 through upcoming flights)
- Recharts analytics: outcome breakdown and yearly cadence
- News/updates feed with official SpaceX and NASASpaceflight links
- Configurable auto-refresh (1 / 5 / 15 min or off)
- Share button and last-updated timestamp
- Responsive dark space-themed UI

## Tech Stack

- React 19 + Vite + TypeScript
- Tailwind CSS v4
- Recharts
- date-fns
- GitHub Actions → Cloudflare Pages (`bennettwells-website`)

---

## Project Plan & API Mapping

### Data flow

```
SpaceX API (primary) ──► spacexApi.ts ──► useStarshipData hook ──► React components
        │ fail/empty
        └──► fallbackData.ts (curated IFT history)
```

### SpaceX API endpoints

| Endpoint | Method | Purpose | Maps to |
|----------|--------|---------|---------|
| `/v4/rockets` | GET | Find Starship rocket ID | `rocketName`, rocket filter |
| `/v4/rockets/:id` | GET | Rocket metadata | Description, success rate |
| `/v4/launches/query` | POST | Filter launches by rocket | `StarshipFlight[]` |
| `/v4/launches` | GET | Fallback full launch list | Filter by name/rocket |
| `/v4/launches/upcoming` | GET | Next launch window | `nextLaunchDate`, countdown |
| `/v5/launches` | GET | Alternate launch feed | Future compatibility |

### Field mapping (`SpaceXLaunch` → `StarshipFlight`)

| API field | App field | Notes |
|-----------|-----------|-------|
| `id` | `id` | Unique key |
| `name` | `name`, `flightNumber` | Parsed from IFT/Flight N |
| `date_utc` | `dateUtc` | ISO timestamp |
| `success` | `outcome` | `true`→success, `false`→failure, `null`→partial |
| `upcoming` | `outcome` | `true`→upcoming |
| `details` | `summary` | Flight description |
| `launchpad` | `site` | Default Starbase if unpopulated |

### Fallback sources

When `api.spacexdata.com` is unavailable (known intermittent SSL issues):

1. Curated flight history in `src/services/fallbackData.ts`
2. Static news links to SpaceX Updates and NASASpaceflight
3. UI badge shows **Curated fallback** vs **SpaceX API**

---

## Local development

```bash
git clone https://github.com/bennettwellsnet/starship-monitor.git
cd starship-monitor
npm install
npm run dev
```

Open [http://localhost:5173/starship/](http://localhost:5173/starship/) (note base path).

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Vite dev server |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Preview production build |

---

## Deployment

### Architecture

1. Push to `starship-monitor` `main`
2. GitHub Action builds Vite app (`base: /starship/`)
3. `dist/` synced to `bennettwellsnet/bennettwells-website/starship/`
4. Cloudflare Pages serves `bennettwells.net/starship/`

### Required secret

Add `WEBSITE_PAT` to the `starship-monitor` repo (Settings → Secrets):

- GitHub PAT with `repo` scope on `bennettwells-website`

### Manual deploy

```bash
npm run build
# Copy dist/* to bennettwells-website/starship/ and push
```

---

## Project structure

```
starship-monitor/
├── src/
│   ├── components/     # UI sections
│   ├── hooks/          # useStarshipData
│   ├── services/       # API + fallback data
│   └── types/          # TypeScript interfaces
├── .github/workflows/  # CI/CD
├── vite.config.ts      # base: '/starship/'
└── README.md
```

## License

MIT — not affiliated with SpaceX.