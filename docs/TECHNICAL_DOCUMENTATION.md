# Documentation Technique - Student Course API

## 📋 Table des matières
- [Architecture](#architecture)
- [Installation](#installation)
- [Configuration](#configuration)
- [API Endpoints](#api-endpoints)
- [Modèles de données](#modèles-de-données)
- [Règles métier](#règles-métier)
- [Tests](#tests)
- [Qualité du code](#qualité-du-code)
- [Déploiement](#déploiement)
- [Maintenance](#maintenance)

## 🏗️ Architecture

### Vue d'ensemble
L'API Student Course est une application Node.js/Express qui gère les étudiants, les cours et leurs inscriptions. Elle utilise un stockage en mémoire pour la simplicité et les tests.

```
src/
├── app.js              # Point d'entrée de l'application
├── controllers/        # Logique métier des endpoints
│   ├── coursesController.js
│   └── studentsController.js
├── routes/            # Définition des routes
│   ├── courses.js
│   └── students.js
└── services/          # Services partagés
    └── storage.js     # Gestion du stockage en mémoire
```

### Technologies utilisées
- **Node.js** (v14+) - Runtime JavaScript
- **Express.js** - Framework web
- **Jest** - Framework de tests
- **ESLint** - Linter JavaScript
- **Prettier** - Formateur de code
- **Swagger** - Documentation API
- **GitHub Actions** - CI/CD

## 🚀 Installation

### Prérequis
- Node.js v14 ou supérieur
- npm v6 ou supérieur

### Installation locale
```bash
# Cloner le repository
git clone https://github.com/Falilou2099/student-course-api.git
cd student-course-api

# Installer les dépendances
npm install

# Démarrer l'application
npm start

# L'API sera disponible sur http://localhost:3000
```

### Scripts disponibles
```bash
npm start          # Démarrer l'application
npm test           # Exécuter tous les tests
npm run test:watch # Tests en mode watch
npm run test:coverage # Tests avec couverture
npm run lint       # Vérifier le code avec ESLint
npm run lint:fix   # Corriger automatiquement les erreurs ESLint
npm run format     # Formater le code avec Prettier
npm run quality    # Exécuter tous les contrôles qualité
```

## ⚙️ Configuration

### Variables d'environnement
```bash
PORT=3000                    # Port d'écoute (défaut: 3000)
NODE_ENV=development         # Environnement (development/production)
```

### Configuration ESLint
Le projet utilise ESLint avec des règles strictes :
- Pas de point-virgules
- Guillemets doubles
- Indentation 2 espaces
- Accolades obligatoires sur tous les if/else

### Configuration Prettier
Prettier est configuré pour être compatible avec ESLint :
- Pas de point-virgules
- Guillemets doubles
- Indentation 2 espaces

## 🔌 API Endpoints

### Étudiants

#### GET /api/students
Récupère la liste des étudiants avec pagination et filtres.

**Paramètres de requête :**
- `name` (string, optionnel) - Filtrer par nom
- `email` (string, optionnel) - Filtrer par email
- `page` (number, défaut: 1) - Numéro de page
- `limit` (number, défaut: 10) - Nombre d'éléments par page

**Réponse :**
```json
{
  "students": [
    {
      "id": "1",
      "name": "John Doe",
      "email": "john@example.com"
    }
  ],
  "total": 1
}
```

#### POST /api/students
Crée un nouvel étudiant.

**Corps de la requête :**
```json
{
  "name": "John Doe",
  "email": "john@example.com"
}
```

#### GET /api/students/:id
Récupère un étudiant par son ID.

#### PUT /api/students/:id
Met à jour un étudiant.

#### DELETE /api/students/:id
Supprime un étudiant (si non inscrit à des cours).

### Cours

#### GET /api/courses
Récupère la liste des cours avec pagination et filtres.

**Paramètres de requête :**
- `title` (string, optionnel) - Filtrer par titre
- `teacher` (string, optionnel) - Filtrer par enseignant
- `page` (number, défaut: 1) - Numéro de page
- `limit` (number, défaut: 10) - Nombre d'éléments par page

#### POST /api/courses
Crée un nouveau cours.

**Corps de la requête :**
```json
{
  "title": "JavaScript Fundamentals",
  "teacher": "Jane Smith"
}
```

#### GET /api/courses/:id
Récupère un cours par son ID.

#### PUT /api/courses/:id
Met à jour un cours.

#### DELETE /api/courses/:id
Supprime un cours (si aucun étudiant inscrit).

### Inscriptions

#### POST /api/courses/:id/enroll
Inscrit un étudiant à un cours.

**Corps de la requête :**
```json
{
  "studentId": "1"
}
```

#### DELETE /api/courses/:id/unenroll
Désinscrit un étudiant d'un cours.

**Corps de la requête :**
```json
{
  "studentId": "1"
}
```

## 📊 Modèles de données

### Étudiant
```javascript
{
  id: string,        // UUID généré automatiquement
  name: string,      // Nom complet (requis)
  email: string      // Email unique (requis)
}
```

### Cours
```javascript
{
  id: string,        // UUID généré automatiquement
  title: string,     // Titre unique (requis)
  teacher: string    // Nom de l'enseignant (requis)
}
```

### Inscription
```javascript
{
  studentId: string, // ID de l'étudiant
  courseId: string   // ID du cours
}
```

## 📋 Règles métier

### Contraintes d'unicité
- **Email étudiant** : Chaque étudiant doit avoir un email unique
- **Titre de cours** : Chaque cours doit avoir un titre unique

### Contraintes d'inscription
- **Limite par cours** : Maximum 3 étudiants par cours
- **Inscription unique** : Un étudiant ne peut pas s'inscrire deux fois au même cours

### Contraintes de suppression
- **Étudiant** : Ne peut pas être supprimé s'il est inscrit à des cours
- **Cours** : Ne peut pas être supprimé s'il a des étudiants inscrits

### Validation des données
- **Champs requis** : Tous les champs sont obligatoires lors de la création
- **Format email** : Validation basique du format email
- **Longueur des chaînes** : Pas de limite spécifique implémentée

## 🧪 Tests

### Structure des tests
```
tests/
├── integration/
│   └── app.test.js     # Tests d'intégration des endpoints
└── unit/
    └── storage.test.js # Tests unitaires du service de stockage
```

### Couverture de code
- **Couverture actuelle** : 97.72%
- **Seuil minimum** : 80%
- **Branches couvertes** : 95%+

### Types de tests
1. **Tests d'intégration** : Testent les endpoints complets
2. **Tests unitaires** : Testent les fonctions individuelles
3. **Tests de validation** : Testent les règles métier
4. **Tests d'erreur** : Testent la gestion des erreurs

### Exécution des tests
```bash
# Tous les tests
npm test

# Tests avec couverture
npm run test:coverage

# Tests en mode watch
npm run test:watch

# Tests spécifiques
npm test -- --testNamePattern="students"
```

## 🔍 Qualité du code

### Outils de qualité
- **ESLint** : Analyse statique du code JavaScript
- **Prettier** : Formatage automatique du code
- **Codacy** : Analyse de qualité continue
- **Jest** : Couverture de code et tests

### Métriques de qualité
- **Complexité cyclomatique** : Maximum 15
- **Duplication de code** : Maximum 3%
- **Couverture de tests** : Minimum 80%
- **Vulnérabilités** : Aucune tolérée

### Standards de codage
- **Conventions de nommage** : camelCase pour les variables et fonctions
- **Structure des fonctions** : Maximum 20 lignes par fonction
- **Commentaires** : Expliquer le "pourquoi", pas le "quoi"
- **Gestion d'erreurs** : try-catch pour toutes les opérations risquées

## 🚀 Déploiement

### CI/CD Pipeline
Le projet utilise GitHub Actions pour :
1. **Installation** des dépendances
2. **Linting** du code
3. **Formatage** avec Prettier
4. **Tests** avec couverture
5. **Analyse** de qualité

### Environnements
- **Développement** : Local avec nodemon
- **Test** : Pipeline CI avec Node.js 14, 16, 18
- **Production** : Déployable sur Heroku, Vercel, ou AWS

### Configuration de production
```bash
# Variables d'environnement requises
NODE_ENV=production
PORT=3000

# Optimisations recommandées
npm ci --only=production
```

## 🔧 Maintenance

### Monitoring
- **Logs** : Console.log pour le développement
- **Erreurs** : Gestion centralisée des erreurs
- **Performance** : Surveillance des temps de réponse

### Mises à jour
- **Dépendances** : `npm audit` régulier
- **Sécurité** : Surveillance des vulnérabilités
- **Tests** : Maintien de la couverture

### Debugging
```bash
# Mode debug
DEBUG=* npm start

# Logs détaillés
NODE_ENV=development npm start
```

### Contribution
1. Fork le repository
2. Créer une branche feature
3. Suivre les standards de code
4. Ajouter des tests
5. Créer une Pull Request

## 📚 Ressources

- [Documentation Swagger](http://localhost:3000/api-docs)
- [Repository GitHub](https://github.com/Falilou2099/student-course-api)
- [Issues et bugs](https://github.com/Falilou2099/student-course-api/issues)

---

**Dernière mise à jour** : Décembre 2024
**Version** : 1.0.0
