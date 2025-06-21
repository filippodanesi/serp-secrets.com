#!/bin/bash

echo "🔄 Riavvio server per caricare nuovi post WordPress..."

# Termina il server Astro
pkill -f "astro dev"

# Aspetta un secondo
sleep 2

# Pulisce la cache
rm -rf node_modules/.astro

echo "🚀 Riavvio server..."

# Riavvia il server
npm run dev 