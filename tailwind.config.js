/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './*.html',
    './blog/**/*.html',
    './js/**/*.js',
    './blog/**/*.js',
  ],
  theme: {
    extend: {
      colors: {
        'hsg-slate':      '#30413B',
        'hsg-slate-dark': '#1F2A26',
        'lum-green':      '#455F39',
        'lum-green-dark': '#36492C',
        'sage':           '#B7BA9F',
        'sage-light':     '#D6D8C5',
        'sand':           '#B89B7A',
        'sand-dark':      '#9E835F',
        'sand-deep':      '#876141',
        'ivory':          '#F1EFE8',
        'warm-gray':      '#E8E6DE',
        'zalo':           '#0068FF',
      },
      fontFamily: {
        display: ['SVN-Optima', 'Cormorant Garamond', 'Georgia', 'serif'],
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        accent:  ['DFVN-Abygaer', 'cursive'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
