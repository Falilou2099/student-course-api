// Configuration Prettier pour l'API Student-Course
// Ce fichier définit les règles de formatage automatique du code
module.exports = {
  // === PONCTUATION ET GUILLEMETS ===
  semi: false, // Pas de point-virgule en fin de ligne (style moderne)
  singleQuote: false, // Utilise les guillemets doubles "" au lieu de ''
  trailingComma: "es5", // Virgule finale dans les objets/tableaux (compatible ES5)

  // === INDENTATION ET ESPACEMENT ===
  tabWidth: 2, // Indentation de 2 espaces (standard JavaScript)
  useTabs: false, // Utilise des espaces au lieu de tabulations
  printWidth: 80, // Largeur maximale de ligne avant retour automatique
  bracketSpacing: true, // Espaces dans les objets : { foo: bar } au lieu de {foo: bar}

  // === STYLE DES FONCTIONS ===
  arrowParens: "avoid", // Évite les parenthèses pour un seul paramètre : x => x au lieu de (x) => x
  endOfLine: "lf", // Utilise LF (Unix) pour les fins de ligne (compatibilité)
  bracketSameLine: false, // Place la balise fermante sur une nouvelle ligne
  quoteProps: "as-needed", // Guillemets sur les propriétés seulement si nécessaire

  // === CONFIGURATION SPÉCIFIQUE PAR TYPE DE FICHIER ===
  overrides: [
    {
      // Configuration pour les fichiers JSON et Markdown
      files: ["*.json", "*.md"],
      options: {
        tabWidth: 2, // Indentation cohérente de 2 espaces
      },
    },
    {
      // Configuration spécifique pour les fichiers JavaScript
      files: ["*.js"],
      options: {
        semi: false, // Confirme : pas de point-virgule pour JS
        singleQuote: false, // Confirme : guillemets doubles pour JS
      },
    },
  ],
}
