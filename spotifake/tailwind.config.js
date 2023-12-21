module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    // Ajoutez d'autres chemins si nécessaire
  ],
  theme: {
    extend: {
      colors: {
        spotify: {
          black: "#191414",
          green: "#1DB954",
          white: "#FFFFFF",
          grey: "#B3B3B3",
        },
      },
      // Vous pouvez également étendre d'autres aspects du thème ici
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
