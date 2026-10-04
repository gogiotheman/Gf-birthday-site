/* =======================================================================
   SITE CONFIG — this is the only file you should need to touch for text.
   Edit the values on the right of each colon. Keep the quote marks.
   ======================================================================= */

const SITE_CONFIG = {
  // Shown throughout the site
  herName: "Ειρήνη",
  yourName: "Your George",

  // Optional site password. Set to "" to disable the gate.
  // Example: "my-secret-love-code"
  sitePassword: "georgeisstupid",

  // ---- Greeting page (index.html) ----
  greeting: {
    eyebrow: "Για την γλυκιά, έξυπνη και χαριτωμένη",                 // small line above her name
    tagline: "a pocket universe, just for you",
    openLabel: "tap the seal to open",
    message:
      "Few are the words that can describe how you make my soul bloom every single day. The abandoned garden of my heart grows and grows, sprouting magnificent roses and sparkling sunflowers, until the temple of loneliness, the fountain of sadness, and the mausoleum of whining are all buried beneath a dense, springtime green. And so it is for me in winter, in spring, in summer, and in autumn alike. Ever since that spring when I first came to have you in my life. " +
      "If this is the impact you have on me, I can only be head-over-heels excited about what you will do in this world, with all the years we will be lucky enough to count for you.\n\n" +
      "Χρόνια πολλά, αγάπη μου.\n\n" +    
      "Happy birthday to the most magical person I know. Life does give happiness back - and it gave me you." +
      "What lies beyond is a tiny, minuscule world, with a few moments I thought worthy of celebrating you for." +
      "I love you. And I invite you...",
    enterLabel: "step inside",
  },

  // ---- Together page (main.html) — video carousel ----
  main: {
    eyebrow: "a muse herself... to whom a song should be sung ",
    title: "our songs (and many others to come)",
  },

  // Add 2–3 YouTube links here. For each one, paste just the ID —
  // the part after "v=" in a youtube.com URL, or after "youtu.be/".
  // e.g. https://youtu.be/dQw4w9WgXcQ  ->  id: "dQw4w9WgXcQ"
  // Leave id as "" to show an empty "add a video" slot instead.
  videos: [
    { id: "DMg7HctbOF8", title: "(silently) I LOVE YOU! when you're singing that song and" },
    { id: "wtQHB_6_S90", title: "crying my eyes out on this one" }
  ],

   // ---- Timeline page (timeline.html) ----
  timeline: {
    eyebrow: "time is only a collection of memories",
    title: "better to have them with you",
    // Set this to whatever range of years matters to you two —
    // e.g. the year you met through this year.
    startYear: 2025,
    endYear: 2030,
  },
 
  // ---- Activities page (activities.html) ----
  activities: {
    eyebrow: "no pressure, just pick",
    title: "tonight's spell",
    hint: "pick as many as you like, then send it straight to my phone.",
 
    // Your number, with country code, no spaces or dashes — e.g. "+40712345678".
    // Leave it as "" and the send buttons stay switched off until you add it.
    phoneNumber: "+40783111317",
 
    // The sentence the message opens with — the picks get added after it.
    messageIntro: "Tonight I'm in the mood for:",
 
    // Add, remove or reword these freely — lowercase so they read naturally
    // in a sentence.
    items: [
      "watching a movie",
      "playing a board game",
      "doing a puzzle together",
      "doing personality quizzes",
      "playing a video game",
      "play small bar games (UNO, Chess, Backgammon, etc.)",
      "cooking together on camera",
      "play games for the mind (trivia, riddles, quizzes, etc.)",
      "debate about a topic",
      "learn soemthig new together",
      "just staying in and talking",
    ],

    customOptionLabel: "something else",
    customOptionPlaceholder: "tell me what you had in mind...",
  },
};
