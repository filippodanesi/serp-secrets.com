const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                main: 'hsl(var(--color-bg-main))',
                text: {
                    main: 'hsl(var(--color-text-main))',
                    muted: 'hsl(var(--color-text-muted))',
                },
                bg: {
                    main: 'hsl(var(--color-bg-main))',
                    muted: 'hsl(var(--color-bg-muted))',
                },
                border: {
                    main: 'hsl(var(--color-border-main))',
                },
                accent: 'hsl(var(--color-accent))',
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))',
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))',
                },
                primary: {
                    DEFAULT: 'hsl(var(--primary))',
                    foreground: 'hsl(var(--primary-foreground))',
                },
                secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))',
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))',
                },
                accent: {
                    DEFAULT: 'hsl(var(--accent))',
                    foreground: 'hsl(var(--accent-foreground))',
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))',
                },
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
            },
            textColor: {
                main: 'hsl(var(--color-text-main))',
                muted: 'hsl(var(--color-text-muted))',
                accent: 'hsl(var(--color-accent))'
            },
            backgroundColor: {
                main: 'hsl(var(--color-bg-main))',
                muted: 'hsl(var(--color-bg-muted))',
                accent: 'hsl(var(--color-accent))'
            },
            borderColor: {
                main: 'hsl(var(--color-border-main))',
                accent: 'hsl(var(--color-accent))'
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)',
            },
            fontFamily: {
                sans: ['Inter', ...defaultTheme.fontFamily.sans],
                serif: ['Newsreader', ...defaultTheme.fontFamily.serif],
                mono: defaultTheme.fontFamily.mono,
            },
            fontSize: {
                xs: ['0.8125rem', { lineHeight: '1.5rem' }],
                sm: ['0.875rem', { lineHeight: '1.5rem' }],
                base: ['1rem', { lineHeight: '1.75rem' }],
                lg: ['1.125rem', { lineHeight: '1.75rem' }],
                xl: ['1.25rem', { lineHeight: '2rem' }],
                '2xl': ['1.5rem', { lineHeight: '2rem' }],
                '3xl': ['2rem', { lineHeight: '2.5rem' }],
                '4xl': ['2.5rem', { lineHeight: '3.5rem' }],
                '5xl': ['3rem', { lineHeight: '3.5rem' }],
            },
            letterSpacing: {
                'tighter': '-0.05em',
                'tight': '-0.025em',
            },
            typography: (theme) => ({
                dante: {
                    css: {
                        '--typography-serif': theme('fontFamily.serif').join(', '),
                        '--tw-prose-body': theme('colors.foreground'),
                        '--tw-prose-headings': theme('colors.foreground'),
                        '--tw-prose-lead': theme('colors.foreground'),
                        '--tw-prose-links': theme('colors.primary.DEFAULT'),
                        '--tw-prose-bold': theme('colors.foreground'),
                        '--tw-prose-counters': theme('colors.muted.foreground'),
                        '--tw-prose-bullets': theme('colors.muted.foreground'),
                        '--tw-prose-hr': theme('colors.border'),
                        '--tw-prose-quotes': theme('colors.foreground'),
                        '--tw-prose-quote-borders': theme('colors.border'),
                        '--tw-prose-captions': theme('colors.muted.foreground'),
                        '--tw-prose-code': theme('colors.foreground'),
                        '--tw-prose-pre-code': theme('colors.muted.foreground'),
                        '--tw-prose-pre-bg': theme('colors.muted.DEFAULT'),
                        '--tw-prose-th-borders': theme('colors.border'),
                        '--tw-prose-td-borders': theme('colors.border'),
                        'h1,h2,h3,h4,h5,h6': {
                            fontFamily: 'var(--typography-serif)',
                            fontWeight: 600,
                            letterSpacing: '-0.025em'
                        },
                        'p': {
                            lineHeight: '1.7'
                        }
                    }
                },
                DEFAULT: {
                    css: {
                        a: {
                            color: 'rgb(var(--color-accent))',
                            fontWeight: '500',
                            textDecoration: 'underline',
                            textDecorationStyle: 'solid',
                            textDecorationThickness: '1px',
                            textUnderlineOffset: '2px',
                            transition: 'color 0.15s ease',
                            '&:hover': {
                                color: 'rgb(var(--color-text-main))'
                            }
                        },
                        'h1,h2,h3,h4,h5,h6': {
                            fontFamily: theme('fontFamily.serif'),
                            fontWeight: 600,
                            letterSpacing: '-0.025em',
                            color: 'rgb(var(--color-text-main))'
                        },
                        'p': {
                            lineHeight: '1.7',
                            color: 'rgb(var(--color-text-main) / 0.9)'
                        },
                        blockquote: {
                            border: 0,
                            borderLeft: '3px solid rgb(var(--color-accent))',
                            fontFamily: theme('fontFamily.serif'),
                            fontSize: '1.125em',
                            fontStyle: 'normal',
                            fontWeight: '500',
                            lineHeight: 1.6,
                            paddingLeft: '1.5rem',
                            color: 'rgb(var(--color-text-main))',
                            backgroundColor: 'rgb(var(--color-bg-muted))',
                            borderRadius: '0 8px 8px 0',
                            padding: '1.5rem',
                            marginLeft: '0',
                            marginRight: '0',
                            '@media (min-width: theme("screens.sm"))': {
                                fontSize: '1.25em',
                                lineHeight: 1.5
                            }
                        }
                    }
                },
                lg: {
                    css: {
                        blockquote: {
                            paddingLeft: '1.5rem'
                        }
                    }
                }
            })
        }
    },
    plugins: [require('@tailwindcss/typography')],
};