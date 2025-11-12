# Guide d'utilisation de l'API Student Course

## 🚀 Démarrage rapide

### Installation et lancement
```bash
git clone https://github.com/Falilou2099/student-course-api.git
cd student-course-api
npm install
npm start
```

L'API sera disponible sur `http://localhost:3000`

### Documentation interactive
Accédez à la documentation Swagger : `http://localhost:3000/api-docs`

## 📚 Exemples d'utilisation

### Gestion des étudiants

#### Créer un étudiant
```bash
curl -X POST http://localhost:3000/api/students \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Martin",
    "email": "alice.martin@example.com"
  }'
```

#### Lister les étudiants
```bash
# Tous les étudiants
curl http://localhost:3000/api/students

# Avec pagination
curl "http://localhost:3000/api/students?page=1&limit=5"

# Avec filtre par nom
curl "http://localhost:3000/api/students?name=Alice"
```

#### Récupérer un étudiant
```bash
curl http://localhost:3000/api/students/1
```

#### Modifier un étudiant
```bash
curl -X PUT http://localhost:3000/api/students/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Dupont",
    "email": "alice.dupont@example.com"
  }'
```

#### Supprimer un étudiant
```bash
curl -X DELETE http://localhost:3000/api/students/1
```

### Gestion des cours

#### Créer un cours
```bash
curl -X POST http://localhost:3000/api/courses \
  -H "Content-Type: application/json" \
  -d '{
    "title": "JavaScript Avancé",
    "teacher": "Prof. Dubois"
  }'
```

#### Lister les cours
```bash
# Tous les cours
curl http://localhost:3000/api/courses

# Avec filtre par titre
curl "http://localhost:3000/api/courses?title=JavaScript"

# Avec filtre par enseignant
curl "http://localhost:3000/api/courses?teacher=Dubois"
```

### Gestion des inscriptions

#### Inscrire un étudiant à un cours
```bash
curl -X POST http://localhost:3000/api/courses/1/enroll \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": "1"
  }'
```

#### Désinscrire un étudiant
```bash
curl -X DELETE http://localhost:3000/api/courses/1/unenroll \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": "1"
  }'
```

## 🔍 Codes de réponse HTTP

| Code | Signification | Description |
|------|---------------|-------------|
| 200 | OK | Requête réussie |
| 201 | Created | Ressource créée avec succès |
| 204 | No Content | Suppression réussie |
| 400 | Bad Request | Données invalides ou contrainte violée |
| 404 | Not Found | Ressource non trouvée |
| 500 | Internal Server Error | Erreur serveur |

## ⚠️ Règles métier importantes

### Contraintes d'unicité
- **Email étudiant** : Chaque étudiant doit avoir un email unique
- **Titre de cours** : Chaque cours doit avoir un titre unique

### Limites d'inscription
- Maximum **3 étudiants** par cours
- Un étudiant ne peut pas s'inscrire **deux fois** au même cours

### Contraintes de suppression
- Un étudiant inscrit à des cours **ne peut pas être supprimé**
- Un cours avec des étudiants inscrits **ne peut pas être supprimé**

## 🧪 Exemples de scénarios complets

### Scénario 1 : Création complète d'un cours avec étudiants

```bash
# 1. Créer des étudiants
curl -X POST http://localhost:3000/api/students \
  -H "Content-Type: application/json" \
  -d '{"name": "Alice Martin", "email": "alice@example.com"}'

curl -X POST http://localhost:3000/api/students \
  -H "Content-Type: application/json" \
  -d '{"name": "Bob Durand", "email": "bob@example.com"}'

# 2. Créer un cours
curl -X POST http://localhost:3000/api/courses \
  -H "Content-Type: application/json" \
  -d '{"title": "React Basics", "teacher": "Prof. Smith"}'

# 3. Inscrire les étudiants
curl -X POST http://localhost:3000/api/courses/1/enroll \
  -H "Content-Type: application/json" \
  -d '{"studentId": "1"}'

curl -X POST http://localhost:3000/api/courses/1/enroll \
  -H "Content-Type: application/json" \
  -d '{"studentId": "2"}'
```

### Scénario 2 : Gestion des erreurs

```bash
# Tentative de création d'un étudiant avec email existant (erreur 400)
curl -X POST http://localhost:3000/api/students \
  -H "Content-Type: application/json" \
  -d '{"name": "Charlie", "email": "alice@example.com"}'

# Tentative d'inscription d'un 4ème étudiant (erreur 400)
curl -X POST http://localhost:3000/api/students \
  -H "Content-Type: application/json" \
  -d '{"name": "David", "email": "david@example.com"}'

curl -X POST http://localhost:3000/api/courses/1/enroll \
  -H "Content-Type: application/json" \
  -d '{"studentId": "3"}'
```

## 🔧 Développement et tests

### Lancer les tests
```bash
npm test                # Tous les tests
npm run test:coverage   # Avec couverture
npm run test:watch      # Mode watch
```

### Vérification de la qualité
```bash
npm run lint           # Vérifier le code
npm run format         # Formater le code
npm run quality        # Tous les contrôles
```

## 📋 Format des réponses

### Réponse de liste (avec pagination)
```json
{
  "students": [
    {
      "id": "1",
      "name": "Alice Martin",
      "email": "alice@example.com"
    }
  ],
  "total": 1
}
```

### Réponse d'erreur
```json
{
  "error": "Student email must be unique"
}
```

### Réponse de création
```json
{
  "id": "1",
  "name": "Alice Martin",
  "email": "alice@example.com"
}
```

## 🛠️ Outils recommandés

### Clients API
- **Postman** : Interface graphique complète
- **Insomnia** : Client REST léger
- **curl** : Ligne de commande
- **HTTPie** : Alternative moderne à curl

### Exemple avec HTTPie
```bash
# Installation
pip install httpie

# Utilisation
http POST localhost:3000/api/students name="Alice" email="alice@example.com"
http GET localhost:3000/api/students
```

## 🔗 Ressources utiles

- [Documentation technique complète](./TECHNICAL_DOCUMENTATION.md)
- [Documentation Swagger interactive](http://localhost:3000/api-docs)
- [Repository GitHub](https://github.com/Falilou2099/student-course-api)
- [Guide de contribution](../README.md#contribution)
