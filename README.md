# IPRESS — GitHub Pages edition

This is the upload-ready static IPRESS website. No npm installation or build is needed. It includes the interactive 3D camera, the seven correctly ordered characters, original photographs, motion controls, creative-field explorer, and official community links.

## Publish for free on GitHub Pages

1. Sign in to GitHub and create a **public** repository named `ipress` (or use an empty public repository you own). GitHub Free supports Pages on public repositories.
2. Extract this ZIP. Open the extracted `ipress-github-pages` folder.
3. In the repository, choose **Add file → Upload files** (or **uploading an existing file** on an empty repository). Upload the **contents** of this folder, including the `assets` and `vendor` folders. Do not upload the ZIP itself or put everything inside an extra enclosing folder. `index.html` must appear in the repository root.
4. Commit the upload to `main`.
5. Open **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**, then **main** and **/(root)**. Click **Save**.
6. After deployment finishes, use **Visit site** on the Pages settings screen. A repository named `ipress` normally appears at `https://YOUR-USERNAME.github.io/ipress/`. Publication may take up to ten minutes.

All local paths are relative, so both a project URL (`/ipress/`) and a user-site URL (`/`) work. The included `.nojekyll` avoids unnecessary Jekyll processing. If your upload interface omits it, create an empty file with that name in the repository root.

## Recruitment form (hosted on this site, submissions sent to Gmail)

The application form now lives on the page itself (`#apply` → "Ouvrir le formulaire sécurisé"). No redirect, no ChatGPT login. Each submission is emailed privately to the site owner through **Web3Forms**, a free form-to-email service that works with static hosting.

### One-time activation (about 2 minutes)

1. Go to https://web3forms.com, enter your Gmail address under "Create your Access Key", and confirm the email you receive.
2. Copy the access key you receive (a UUID).
3. In `index.html`, find `data-access-key="REMPLACE_PAR_TA_CLE_WEB3FORMS"` on the `<form id="application-form">` tag and replace the placeholder with your key.
4. Commit the change on GitHub. Submit a test application; it should arrive in your inbox within a minute.

Until the key is set, the form validates the input but shows "Le formulaire n'est pas encore activé" instead of sending.

### Privacy notes

- The access key is not a password: it can only *send* email to you. It cannot read anything. Nobody (applicants included) can see other applicants' entries, since nothing is stored on the site.
- Submissions pass through Web3Forms' servers on their way to your inbox.
- A hidden honeypot field filters most bots. If spam appears, enable the captcha/domain options in your Web3Forms dashboard.
- Applications sent through the old ChatGPT-hosted form stay in that old project.

## What to edit

- `index.html`: page copy, application form markup (and access key), team-area link.
- `styles.css`, `recruitment.css`, `pages.css`: appearance.
- `app.js`: interactions and exact seven-member order.
- `scene.js`: 3D camera.
- `recruitment.js`: interest explorer.
- `application.js`: inline application form (validation + Web3Forms submission).
- `assets/`: club imagery and local fonts (`art-*.jpg` = photos of the "Des idées plein la tête" explorer).
- `vendor/`: self-hosted Three.js.

The original server-backed Site has not been changed by this export. Keep that project as the source of the working database and administration system.

## Validation

Before handoff: local link/asset resolution, script syntax, exact team order, multi-interest interaction, absence of local API calls, social URLs and original image hashes are checked. Browser-rendered visual appearance and GPU performance have not been rechecked in this session. GitHub deployment is not complete until Pages reports success in your repository.

## Credits and documentation

Original club photographs and characters remain unchanged. Three.js license: `vendor/THREE-LICENSE.txt`. Font licenses: `assets/FONT-LICENSES.txt`.

- GitHub Pages setup: https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site
- Branch publishing settings: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
