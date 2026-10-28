## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Run the app:
   `npm run dev`

## Install as a WordPress theme

1. Create the upload package: `npm run package:wordpress`.
2. In WordPress, go to **Appearance → Themes → Add New → Upload Theme**, upload `Forgelinea-WordPress-Theme.zip`, install it, and activate **Forgelinea Engineering**.

The command builds a manifest and hashed assets into `wordpress-theme/build`, then creates the ZIP with `style.css`, `functions.php`, and `index.php` at the archive root. Do not zip the enclosing `wordpress-theme` folder; WordPress needs to find `style.css` at the top level of the uploaded archive. PHP enqueues the generated JavaScript and CSS through the manifest.
