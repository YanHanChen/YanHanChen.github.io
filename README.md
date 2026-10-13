# yanhanchen.github.io

Personal academic website of Yan-Han Chen, built with [al-folio](https://github.com/alshedivat/al-folio) (v1.x).

## Where things live

| What | File |
|---|---|
| Bio, photo caption, News/Selected-papers switches | `_pages/about.md` |
| Profile photo | `assets/img/prof_pic.jpg` |
| Publications (also used for the CV) | `_bibliography/papers.bib` |
| News items (shown on the About page) | `_news/*.md` |
| Teaching | `_pages/teaching.md` |
| CV PDF (embedded on the CV page) | `files/CV_YanHanChen.pdf` |
| Email / Scholar / GitHub / LinkedIn icons | `_data/socials.yml` |
| Co-author links on publications | `_data/coauthors.yml` |
| Site name, URL, features | `_config.yml` |

## Preview locally

```bash
bundle install          # first time only
bundle exec jekyll serve
```

Open http://localhost:4000. Edits reload automatically (restart after changing `_config.yml`).

## Deploy

Pushing to `master` runs `.github/workflows/deploy.yml`, which builds the site and publishes it to the `gh-pages` branch.
GitHub Pages must be set to serve the `gh-pages` branch (Settings → Pages), and Actions need
"Read and write permissions" (Settings → Actions → General).
