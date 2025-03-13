#!/bin/bash

# Directory del blog
BLOG_DIR="src/content/blog"

# Per ogni file MDX nel blog
for file in "$BLOG_DIR"/*.mdx; do
  filename=$(basename "$file")
  imagename="${filename%.mdx}.webp"
  
  echo "==========================================="
  echo "File: $filename"
  echo "Immagine di copertina: $imagename"
  echo ""
  
  # Cerca la riga con il tag img e l'attributo id="cover-img"
  img_line=$(grep -n 'id="cover-img"' "$file" | head -n 1)
  
  if [ -n "$img_line" ]; then
    # Estrai l'attributo alt dall'immagine
    alt_text=$(grep 'id="cover-img"' "$file" | head -n 1 | grep -o 'alt="[^"]*"' | sed 's/alt="//' | sed 's/"//')
    
    echo "Alt text: $alt_text"
    echo ""
    
    # Il codice da aggiungere all'inizio del file (dopo il frontmatter)
    import_line="import coverImage from '../../assets/images/blog/$imagename';"
    
    # Il codice da sostituire
    old_img_line='<img id="cover-img" src="/'$imagename'" alt="'$alt_text'">'
    new_img_line='<Image 
    id="cover-img" 
    src={coverImage} 
    alt="'$alt_text'" 
    loading="eager" 
    priority={true} 
  />'
    
    echo "Sostituisci:"
    echo "$old_img_line"
    echo ""
    echo "Con:"
    echo "$new_img_line"
    echo ""
    echo "E aggiungi questo import dopo il frontmatter:"
    echo "$import_line"
    echo "==========================================="
  else
    echo "Nessuna immagine di copertina trovata"
    echo "==========================================="
  fi
done