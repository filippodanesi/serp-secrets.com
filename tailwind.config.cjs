const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
    darkMode: 'class',
    theme: {
        fontFamily: {
            sans: [
                'system-ui', 'BlinkMacSystemFont',
                'Segoe UI', 'Helvetica', 'Arial', 'sans-serif',
                'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'
            ],
            serif: [
                'system-ui', 'BlinkMacSystemFont',
                'Segoe UI', 'Helvetica', 'Arial', 'sans-serif',
                'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'
            ]
        },
        extend: {
            textColor: {
                main: 'rgb(var(--color-text-main))',
                muted: 'rgb(var(--color-text-muted))'
            },
            backgroundColor: {
                main: 'rgb(var(--color-bg-main))',
                muted: 'rgb(var(--color-bg-muted))'
            },
            borderColor: {
                main: 'rgb(var(--color-border-main))'
            },
            typography: (theme) => ({
                dante: {
                    css: {
                        '--typography-serif': theme('fontFamily.serif').join(', '),
                        '--tw-prose-body': theme('textColor.main'),
                        '--tw-prose-headings': theme('textColor.main'),
                        '--tw-prose-lead': theme('textColor.main'),
                        '--tw-prose-links': theme('textColor.main'),
                        '--tw-prose-bold': theme('textColor.main'),
                        '--tw-prose-counters': theme('textColor.main'),
                        '--tw-prose-bullets': theme('textColor.main'),
                        '--tw-prose-hr': theme('borderColor.main'),
                        '--tw-prose-quotes': theme('textColor.main'),
                        '--tw-prose-quote-borders': theme('borderColor.main'),
                        '--tw-prose-captions': theme('textColor.main'),
                        '--tw-prose-code': theme('textColor.main'),
                        '--tw-prose-pre-code': theme('colors.zinc.100'),
                        '--tw-prose-pre-bg': theme('colors.zinc.800'),
                        '--tw-prose-th-borders': theme('borderColor.main'),
                        '--tw-prose-td-borders': theme('borderColor.main'),
                        'h1,h2,h3,h4,h5,h6': {
                            fontFamily: 'var(--typography-serif)',
                            fontWeight: 500
                        }
                    }
                },
                DEFAULT: {
                    css: {
                        a: {
                            fontWeight: 'normal',
                            textDecoration: 'underline',
                            textDecorationStyle: 'solid',
                            textDecorationThickness: '1px',
                            textUnderlineOffset: '2px',
                            '&:hover': {
                                textDecorationStyle: 'solid'
                            }
                        },
                        'h1,h2,h3,h4,h5,h6': {
                            fontFamily: theme('fontFamily.serif'),
                            fontWeight: 500
                        },
                        blockquote: {
                            border: 0,
                            fontFamily: theme('fontFamily.serif'),
                            fontSize: '1.3125em',
                            fontStyle: 'italic',
                            fontWeight: 'normal',
                            lineHeight: 1.4,
                            paddingLeft: 0,
                            '@media (min-width: theme("screens.sm"))': {
                                fontSize: '1.66667em',
                                lineHeight: 1.3
                            }
                        }
                    }
                },
                lg: {
                    css: {
                        blockquote: {
                            paddingLeft: 0
                        }
                    }
                }
            })
        }
    },
    plugins: [require('@tailwindcss/typography')],
};
