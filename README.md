# GitHub Status

**Tier:** 1-Beginner

Web apps acquire data in many ways. Through user input in web pages, through
API's to backend systems, from files and databases, and sometimes by "scraping"
websites. The objective of the GitHub Status app is to introduce you to one
way to scrape information from another web site.

GitHub Status uses the GitHub Statuspage API to retrieve the current GitHub site
status. The API returns JSON that is normalized and displayed by the React app.

## User Stories

- [x] User can see the current status for GitHub Git operations, API Requests,
Operational Issues, PRs, Dashboard, Projects, Notifications, Gists, and GitHub Pages.
- [x] User can retrieve the most recent status from GitHub Status by clicking the
"Refresh status" button.

## Bonus features

- [x] Components outside operational status are highlighted with distinct text,
icon, border, and background treatments.

## Useful links and resources

- [Web Scraping (Wikipedia)](https://en.wikipedia.org/wiki/Web_scraping)
- [GitHub Status](https://www.githubstatus.com/)
- [Javascript JSON (MDN)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON)
- [Javascript Object Notation](https://json.org/)

## Example projects

- [Peter Luczynski's example](https://peterluczynski.github.io/github-status/)
- [Diogo Moreira's example](https://diogomoreira.github.io/github-status/)

## Run locally

```powershell
npm install
npm run dev
```

Open the local URL printed by Vite. Development requests are proxied to
`https://www.githubstatus.com/api/v2/summary.json`.

## Commands

- `npm run dev` starts the local development server.
- `npm test` runs the Vitest unit suite.
- `npm run lint` checks source files with Oxlint.
- `npm run build` creates the production bundle.
- `npm run preview` serves the production bundle locally.

## Behavior

The app loads GitHub component status on startup and refreshes it on demand.
It keeps the latest successful data visible during refresh failures and displays
a visible error. Degraded and unavailable states use text plus distinct visual
and icon treatments.
