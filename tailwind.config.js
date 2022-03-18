const lineClamp = require("@tailwindcss/line-clamp");
const typography = require("@tailwindcss/typography");
const forms = require("@tailwindcss/forms");

module.exports = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    enabled: true,
    darkMode: "class",
    variants: {},
    theme: {
        extend: {
            colors: {
                gray: {
                    900: "#202225",
                    800: "#2f3136",
                    700: "#36393f",
                    600: "#4f545c",
                    400: "#d4d7dc",
                    300: "#e3e5e8",
                    200: "#ebedef",
                    100: "#f2f3f5",
                },
                "bookmark-purple": "#5267DF",
                "bookmark-red": "#fa5959",
                "bookmark-blue": "#242A45",
                "bookmark-grey": "#9194A2",
                "bookmark-white": "#f7f7f7",
            },
            spacing: {
                88: "22rem",
            },
            fontFamily: {
                Poppins: ["Poppins, sans-serif"],
            },
            container: {
                center: true,
                padding: "1rem",
                screens: {
                    lg: "1124px",
                    xl: "1124px",
                    "2xl": "1124px",
                },
            },
        },
    },
    plugins: [forms, typography, lineClamp],
};
