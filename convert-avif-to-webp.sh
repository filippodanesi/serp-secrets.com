#!/bin/bash

# Script per convertire tutte le immagini .avif nella cartella public in formato .webp
# Richiede imagemagick (convert) per funzionare

# Verifica che imagemagick sia installato
if ! command -v convert &> /dev/null; then
    echo "Error: ImageMagick non è installato. Per favore installalo con:"
    echo "  sudo apt-get install imagemagick    # Per sistemi Debian/Ubuntu"
    echo "  brew install imagemagick            # Per macOS con Homebrew"
    exit 1
fi

# Cartella di base
PUBLIC_DIR="public"

# Verifica che la cartella "public" esista
if [ ! -d "$PUBLIC_DIR" ]; then
    echo "Error: La cartella '$PUBLIC_DIR' non esiste nella directory corrente."
    exit 1
fi

# Conta il numero di file .avif
AVIF_COUNT=$(find "$PUBLIC_DIR" -type f -name "*.avif" | wc -l)

if [ "$AVIF_COUNT" -eq 0 ]; then
    echo "Nessun file .avif trovato nella cartella '$PUBLIC_DIR'."
    exit 0
fi

echo "Trovati $AVIF_COUNT file .avif da convertire in .webp..."

# Funzione per convertire un singolo file
convert_file() {
    local avif_file="$1"
    local webp_file="${avif_file%.avif}.webp"
    
    echo "Conversione di: $avif_file -> $webp_file"
    
    # Converti il file da .avif a .webp
    convert "$avif_file" "$webp_file"
    
    # Verifica se la conversione è andata a buon fine
    if [ $? -eq 0 ]; then
        echo "✓ Conversione completata con successo: $webp_file"
        return 0
    else
        echo "✗ Errore durante la conversione di: $avif_file"
        return 1
    fi
}

# Contatori
success_count=0
error_count=0

# Trova ed elabora tutti i file .avif
while IFS= read -r avif_file; do
    if convert_file "$avif_file"; then
        ((success_count++))
    else
        ((error_count++))
    fi
done < <(find "$PUBLIC_DIR" -type f -name "*.avif")

# Stampa riepilogo
echo ""
echo "========== RIEPILOGO CONVERSIONE =========="
echo "File elaborati: $AVIF_COUNT"
echo "Conversioni riuscite: $success_count"
echo "Errori: $error_count"

# Chiedi all'utente se vuole eliminare i file .avif originali
if [ $success_count -gt 0 ]; then
    echo ""
    read -p "Vuoi eliminare i file .avif originali? (s/n): " choice
    
    if [[ $choice == "s" || $choice == "S" ]]; then
        echo "Eliminazione dei file .avif originali..."
        
        deleted_count=0
        
        while IFS= read -r avif_file; do
            if [ -f "${avif_file%.avif}.webp" ]; then
                rm "$avif_file"
                ((deleted_count++))
                echo "Eliminato: $avif_file"
            fi
        done < <(find "$PUBLIC_DIR" -type f -name "*.avif")
        
        echo "Eliminati $deleted_count file .avif originali."
    else
        echo "I file .avif originali sono stati mantenuti."
    fi
fi

echo ""
echo "Conversione completata!"