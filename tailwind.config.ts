import { type Config } from "tailwindcss";
// import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  plugins: [
    require("@tailwindcss/typography"),
    require("daisyui")
  ],
} satisfies Config;
