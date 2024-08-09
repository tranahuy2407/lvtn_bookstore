const flowbite = require("flowbite-react/tailwind");

/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    flowbite.content(),
  ],
  theme: {
    extend: {
      colors: {
        accent:"#179957",
        accentDark:"#184D47",
        primary: "#ff0000",
      },
      container: {
        center: true,
        padding:"15px"
      }
    },
  },
  plugins: [flowbite.plugin(),
  //  require("daisyui"),
  ],

};
