# Configuration Prettier

Ce document explique la configuration Prettier utilisée dans l'API Student-Course pour assurer un formatage cohérent du code JavaScript.

## Configuration générale (.prettierrc)

### Ponctuation et guillemets
- `"semi": false` - Pas de point-virgule automatique
- `"singleQuote": false` - Utilise les guillemets doubles
- `"trailingComma": "es5"` - Virgules finales compatibles ES5

### Indentation et espacement
- `"tabWidth": 2` - Largeur d'indentation : 2 espaces
- `"useTabs": false` - Utilise des espaces au lieu de tabulations
- `"printWidth": 80` - Largeur maximale de ligne : 80 caractères
- `"bracketSpacing": true` - Espaces dans les accolades d'objets { foo: bar }

### Style des fonctions et fins de ligne
- `"arrowParens": "avoid"` - Évite les parenthèses pour les fonctions fléchées à un paramètre
- `"endOfLine": "lf"` - Utilise LF (Unix) pour les fins de ligne
- `"bracketSameLine": false` - Place la balise fermante sur une nouvelle ligne
- `"quoteProps": "as-needed"` - Guillemets sur les propriétés d'objet seulement si nécessaire

## Configuration spécifique par type de fichier

### Fichiers JSON et Markdown
- Indentation 2 espaces pour JSON et Markdown

### Fichiers JavaScript
- Pas de point-virgule pour les fichiers JS
- Guillemets doubles pour les fichiers JS

## Utilisation

Pour formater le code automatiquement :
```bash
npm run format
```

Pour vérifier le formatage sans modifier les fichiers :
```bash
npm run format:check
```
