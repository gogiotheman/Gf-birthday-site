# Gf-birthday-site

A small site for my girlfriend's birthday.

## Project status

**Built so far:** the greeting page, plus the overall look, navigation and
folder structure the rest of the site will share.

**Still to build:** the video carousel, the yearly/monthly timeline, the
daily poem generator, and the activity picker — one at a time, as planned.

## How to preview it

No install needed. Just double-click `index.html` (or any other page) and
it opens in your browser. Nothing is hosted online yet — that's the GitHub
step we'll do later.

## How to customize the text

Open `assets/js/config.js`. Every bit of editable text on the greeting
page lives there — her name, your name, and the message. Save the file
and refresh the browser to see the change. You don't need to touch any
other file to change the words.

## Folder structure

```
birthday-site/
├── index.html          the greeting page
├── main.html            (stub) will hold the video carousel
├── timeline.html         (stub) will hold the yearly timeline
├── poetry.html            (stub) will hold the daily poem generator
├── activities.html        (stub) will hold tonight's activity picker
├── assets/
│   ├── css/style.css    shared look — colors, fonts, layout
│   └── js/
│       ├── config.js    all the editable text
│       └── main.js      shared behavior (stars, nav, the seal animation)
└── README.md
```

Each new page we build will reuse the same `style.css` and plug its own
piece of text into `config.js`, so the whole site stays visually
consistent without repeated work.
