/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
        extend: {
                borderRadius: {
                        lg: 'var(--radius)',
                        md: 'calc(var(--radius) - 2px)',
                        sm: 'calc(var(--radius) - 4px)'
                },
                colors: {
                        background: 'hsl(var(--background))',
                        foreground: 'hsl(var(--foreground))',
                        card: {
                                DEFAULT: 'hsl(var(--card))',
                                foreground: 'hsl(var(--card-foreground))'
                        },
                        popover: {
                                DEFAULT: 'hsl(var(--popover))',
                                foreground: 'hsl(var(--popover-foreground))'
                        },
                        primary: {
                                DEFAULT: 'hsl(var(--primary))',
                                foreground: 'hsl(var(--primary-foreground))'
                        },
                        secondary: {
                                DEFAULT: 'hsl(var(--secondary))',
                                foreground: 'hsl(var(--secondary-foreground))'
                        },
                        muted: {
                                DEFAULT: 'hsl(var(--muted))',
                                foreground: 'hsl(var(--muted-foreground))'
                        },
                        accent: {
                                DEFAULT: 'hsl(var(--accent))',
                                foreground: 'hsl(var(--accent-foreground))'
                        },
                        destructive: {
                                DEFAULT: 'hsl(var(--destructive))',
                                foreground: 'hsl(var(--destructive-foreground))'
                        },
                        border: 'hsl(var(--border))',
                        input: 'hsl(var(--input))',
                        ring: 'hsl(var(--ring))',
                        chart: {
                                '1': 'hsl(var(--chart-1))',
                                '2': 'hsl(var(--chart-2))',
                                '3': 'hsl(var(--chart-3))',
                                '4': 'hsl(var(--chart-4))',
                                '5': 'hsl(var(--chart-5))'
                        }
                },
                keyframes: {
                        'accordion-down': {
                                from: { height: '0' },
                                to: { height: 'var(--radix-accordion-content-height)' }
                        },
                        'accordion-up': {
                                from: { height: 'var(--radix-accordion-content-height)' },
                                to: { height: '0' }
                        },
                        'glitch': {
                                '0%, 100%': { transform: 'translate(0)' },
                                '20%': { transform: 'translate(-2px, 2px)' },
                                '40%': { transform: 'translate(-2px, -2px)' },
                                '60%': { transform: 'translate(2px, 2px)' },
                                '80%': { transform: 'translate(2px, -2px)' }
                        },
                        'pulse-glow': {
                                '0%, 100%': { 
                                        boxShadow: '0 0 20px hsla(353, 88%, 50%, 0.6)',
                                        transform: 'scale(1)' 
                                },
                                '50%': { 
                                        boxShadow: '0 0 40px hsla(353, 88%, 50%, 0.9)',
                                        transform: 'scale(1.05)' 
                                }
                        },
                        'scanline': {
                                '0%': { transform: 'translateY(-100%)' },
                                '100%': { transform: 'translateY(100vh)' }
                        },
                        'float': {
                                '0%, 100%': { transform: 'translateY(0px)' },
                                '50%': { transform: 'translateY(-10px)' }
                        }
                },
                animation: {
                        'accordion-down': 'accordion-down 0.2s ease-out',
                        'accordion-up': 'accordion-up 0.2s ease-out',
                        'glitch': 'glitch 3s infinite',
                        'pulse-glow': 'pulse-glow 2s infinite',
                        'scanline': 'scanline 8s linear infinite',
                        'float': 'float 3s ease-in-out infinite'
                },
                fontFamily: {
                        'stranger': ['Lora', 'serif'],
                        'sans': ['Inter', 'system-ui', 'sans-serif']
                }
        }
  },
  plugins: [require("tailwindcss-animate")],
};
