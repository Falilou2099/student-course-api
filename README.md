# StudentCourseAPI ✨

API REST moderne pour la gestion d'étudiants et de cours, développée avec Node.js/Express.

[![CI/CD](https://github.com/Falilou2099/student-course-api/actions/workflows/ci.yml/badge.svg)](https://github.com/Falilou2099/student-course-api/actions)
[![Coverage](https://img.shields.io/badge/coverage-97.72%25-brightgreen)](./coverage)
[![Code Quality](https://img.shields.io/badge/code%20quality-A-brightgreen)](https://codacy.com)

## 🎯 Objectifs du projet

Ce projet démontre l'application des meilleures pratiques de développement :
- **Qualité de code** avec ESLint et Prettier
- **Tests automatisés** avec couverture complète (97.72%)
- **CI/CD** avec GitHub Actions
- **Documentation** technique et API complète
- **Analyse statique** avec Codacy

## ✅ Accomplissements

### 🧪 Tests et Qualité
- ✅ **Tests complets** : Suite de tests d'intégration et unitaires
- ✅ **Couverture élevée** : 97.72% de couverture de code
- ✅ **ESLint configuré** : Règles strictes pour la cohérence du code
- ✅ **Prettier intégré** : Formatage automatique du code
- ✅ **CI/CD pipeline** : Tests automatiques sur chaque push

### 📚 Documentation
- ✅ **Documentation Swagger** : API complètement documentée
- ✅ **Guide technique** : Documentation détaillée de l'architecture
- ✅ **Guide d'utilisation** : Exemples pratiques d'utilisation de l'API
- ✅ **Template PR** : Processus de contribution standardisé

### 🔍 Analyse et Monitoring
- ✅ **Codacy intégré** : Analyse statique continue
- ✅ **Métriques qualité** : Surveillance de la complexité et duplication
- ✅ **Standards de code** : Conventions strictes appliquées

## 🚀 Fonctionnalités

### API Endpoints
- **Étudiants** : CRUD complet avec validation d'unicité email
- **Cours** : Gestion complète avec validation d'unicité titre
- **Inscriptions** : Système d'inscription avec limites (max 3 étudiants/cours)

### Règles métier
- **Email unique** par étudiant
- **Titre unique** par cours
- **Maximum 3 étudiants** par cours
- **Protection suppression** : Impossible si inscriptions actives
- **Pagination** et filtres sur toutes les listes

## Démarrage rapide

### Installation
```bash
git clone https://github.com/Falilou2099/student-course-api.git
cd student-course-api
npm install
npm start
```

### Scripts disponibles
```bash
npm start              # Démarrer l'application
npm test               # Exécuter tous les tests
npm run test:coverage  # Tests avec couverture
npm run lint           # Vérifier le code avec ESLint
npm run format         # Formater le code avec Prettier
npm run quality        # Exécuter tous les contrôles qualité
```

### Accès rapide
- **API** : `http://localhost:3000`
- **Documentation Swagger** : `http://localhost:3000/api-docs`
- **Couverture de tests** : `./coverage/lcov-report/index.html`

## Documentation

| Document | Description |
|----------|-------------|
| [Guide technique](./docs/TECHNICAL_DOCUMENTATION.md) | Architecture, installation, configuration |
| [Guide API](./docs/API_GUIDE.md) | Exemples d'utilisation, endpoints |
| [Documentation Swagger](http://localhost:3000/api-docs) | Documentation interactive |

## Tests et Qualité

### Métriques actuelles
- **Couverture de tests** : 97.72%
- **Tests** : 25+ tests d'intégration et unitaires
- **Qualité code** : Grade A (Codacy)
- **Zéro vulnérabilité** de sécurité

### Outils intégrés
- **ESLint** : Analyse statique du code
- **Prettier** : Formatage automatique
- **Jest** : Framework de tests
- **Codacy** : Analyse de qualité continue
- **GitHub Actions** : CI/CD automatique

## Contribution

1. **Fork** le repository
2. **Créer** une branche feature (`git checkout -b feature/amazing-feature`)
3. **Committer** les changements (`git commit -m 'feat: add amazing feature'`)
4. **Pousser** la branche (`git push origin feature/amazing-feature`)
5. **Ouvrir** une Pull Request

Consultez le [template de PR](./.github/pull_request_template.md) pour les standards de contribution.

## Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## Contexte académique

Projet réalisé dans le cadre du module **Tests et Qualité** à l'Efrei, démontrant :
- L'application des standards de qualité modernes
- L'intégration d'outils d'analyse statique
- La mise en place de tests automatisés complets
- L'implémentation d'une pipeline CI/CD
- La rédaction de documentation technique professionnelle

---

**Projet finalisé avec succès - Tous les objectifs de qualité atteints !**
