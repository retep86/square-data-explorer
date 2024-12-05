module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontSize: {
        sm: ['0.8rem', '1.2rem'], // Small text reduced
        base: ['0.9rem', '1.4rem'], // Base text reduced
        lg: ['1rem', '1.6rem'], // Large text reduced
        xl: ['1.125rem', '1.75rem'], // Extra-large text reduced
        '2xl': ['1.25rem', '1.75rem'], // 2xl reduced
        // Add more overrides as needed
      },
    },
  },
  plugins: [],
}
