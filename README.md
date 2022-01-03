# gnotes

Do you read and forget? `gnotes` helps you become an active reader.

Take freeform notes on things you've read, and generate an explorable view of your notes in an interactive timeline with filters.

Like learning out loud? Publish your notes to the public internet to share with the world.

![image](https://user-images.githubusercontent.com/9841162/147895296-0f268f4e-8db4-4dd5-97d4-a8016b34b0d6.png)

### Install

`npm install`

### Adding notes

`npm run new <you-note-name>`

Fill out the meta data how you see fit, using any any conventions you like. You can move your note.md file anywhere inside `notes/`.

### Viewing your notes

**Locally**: `npm run view`

Click to the link to open your webpage in the browser.

**Deploy**: `npm run build`

## JSON API

Builds of your notes also produce a JSON API (enabled by default).

#### /notes.json

Returns metadata for all your notes

```sh
curl <your site>/api/notes.json
```

<details>
  <summary>Example response:</summary>
  <code class="language-json">
[
  {
    "id": "clairefro/gnotes/notes/parmenides-on-nature.md",
    "fm": {
      "title": "On Nature",
      "author": "Parmenides",
      "yearPublished": -480,
      "type": "📜 poem",
      "link": "http://philoctetes.free.fr/parmenidesunicode.htm",
      "tags": ["philosophy", "presocratic"],
      "lastNoted": "2021-12-28"
    },
    "prettyUrl": "https://github.com/clairefro/gnotes/blob/main/notes/parmenides-on-nature.md",
    "rawUrl": "https://raw.githubusercontent.com/clairefro/gnotes/main/notes/parmenides-on-nature.md",
    "relPath": "notes/parmenides-on-nature.md"
  },
  {
    "id": "clairefro/gnotes/notes/endo-shusaku-silence.md",
    "fm": {
      "title": "Silence",
      "author": "Endo, Shusaku",
      "yearPublished": 1966,
      "type": "📕 book",
      "link": "https://celmoreblog.files.wordpress.com/2016/05/235449575-silence-shusaku-endo-william-johnston.pdf",
      "tags": [
        "fiction",
        "philosophy",
        "religion",
        "martyrdom",
        "christianity",
        "japan",
        "missionary"
      ],
      "lastNoted": "2021-12-16"
    },
    "prettyUrl": "https://github.com/clairefro/gnotes/blob/main/notes/endo-shusaku-silence.md",
    "rawUrl": "https://raw.githubusercontent.com/clairefro/gnotes/main/notes/endo-shusaku-silence.md",
    "relPath": "notes/endo-shusaku-silence.md"
  }
]
</code>
</details>

#### /info.json

Reutrns a summary of metadata about all your notes

```sh
curl <your site>/api/info.json
```

<details>
  <summary>Example response:</summary>
    <code class="language-json">
{
  "repoUrl": "https://github.com/clairefro/gnotes",
  "summary": {
    "notes": { "count": 7 },
    "authors": {
      "count": 7,
      "map": {
        "Arendt, Hannah": 1,
        "Boethius": 1,
        "Borges, Jorge Luis": 1,
        "Endo, Shusaku": 1,
        "Watts, Alan": 1,
        "Parmenides": 1,
        "Zhuangzi": 1
      }
    },
    "types": { "count": 2, "map": { "📕 book": 6, "📜 poem": 1 } },
    "tags": {
      "count": 12,
      "map": {
        "philosophy": 6,
        "fiction": 3,
        "religion": 2,
        "totalitarianism": 1,
        "politics": 1,
        "infinity": 1,
        "martyrdom": 1,
        "christianity": 1,
        "japan": 1,
        "missionary": 1,
        "presocratic": 1,
        "taoism": 1
      }
    },
    "yearPublished": { "min": -480, "max": 1996, "diff": 2476 }
  }
}
</code>
</details>

## Config

You can update the `notesDir`, `distDir`, whether or not to build webpage and/or API, and more.

See `gnotes-config.js`.

_To change the `distDir`, update `config.distDir` in `package.json`_
