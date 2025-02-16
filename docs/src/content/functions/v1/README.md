The `data.json` file in this directory is not generated automatically by the
build process. Instead, it is copied manually and committed to the repo.

To get the latest version of this file:

1. `git checkout <the latest v1 tag or branch>`
2. `cd docs`
3. `npm run typedoc`
4. copy the file in `docs/src/data/data.json` somewhere local
5. Go back to your branch and copy the file you copied to `docs/src/data/v1/data.json`
