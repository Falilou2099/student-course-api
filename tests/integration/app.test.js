// Tests d'intégration pour l'API Student-Course
// Teste l'ensemble de l'application via les endpoints HTTP
// Utilise supertest pour simuler les requêtes HTTP
const request = require("supertest")
const app = require("../../src/app")

describe("Student-Course API Tests Complets", () => {
  // Configuration exécutée avant chaque test
  // Garantit un état propre et prévisible pour chaque test
  beforeEach(() => {
    require("../../src/services/storage").reset() // Vide toutes les données
    require("../../src/services/storage").seed() // Charge les données de test (3 étudiants, 3 cours)
  })

  // ==================== TESTS ÉTUDIANTS ====================

  // Tests pour l'API des étudiants - Couvre toutes les opérations CRUD
  describe("Students API", () => {
    // === TESTS DE LECTURE (GET) ===

    // Test basique : récupération de tous les étudiants
    test("GET /students should return seeded students", async () => {
      const res = await request(app).get("/students")
      expect(res.statusCode).toBe(200)           // Statut HTTP OK
      expect(res.body.students.length).toBe(3)   // 3 étudiants dans les données de test
      expect(res.body.students[0].name).toBe("Alice") // Premier étudiant est Alice
      expect(res.body.total).toBe(3)             // Total correct
    })

    // Test de filtrage : recherche par nom
    test("GET /students with name filter should return filtered results", async () => {
      const res = await request(app).get("/students?name=Alice")
      expect(res.statusCode).toBe(200)
      expect(res.body.students.length).toBe(1)   // Un seul résultat
      expect(res.body.students[0].name).toBe("Alice") // Résultat correct
    })

    // Test de filtrage : recherche par email (partiel)
    test("GET /students with email filter should return filtered results", async () => {
      const res = await request(app).get("/students?email=bob")
      expect(res.statusCode).toBe(200)
      expect(res.body.students.length).toBe(1)   // Un seul résultat
      expect(res.body.students[0].email).toBe("bob@example.com") // Email complet trouvé
    })

    // Test de pagination : limite le nombre de résultats
    test("GET /students with pagination should return paginated results", async () => {
      const res = await request(app).get("/students?page=1&limit=2")
      expect(res.statusCode).toBe(200)
      expect(res.body.students.length).toBe(2)   // Limite respectée
      expect(res.body.total).toBe(3)             // Total global inchangé
    })

    // Test de récupération individuelle : étudiant avec ses cours
    test("GET /students/:id should return student with courses", async () => {
      const res = await request(app).get("/students/1")
      expect(res.statusCode).toBe(200)
      expect(res.body.student.name).toBe("Alice")    // Données de l'étudiant
      expect(res.body.student.email).toBe("alice@example.com")
      expect(Array.isArray(res.body.courses)).toBe(true) // Liste des cours (peut être vide)
    })

    // Test de gestion d'erreur : étudiant inexistant
    test("GET /students/:id should return 404 for non-existent student", async () => {
      const res = await request(app).get("/students/999") // ID inexistant
      expect(res.statusCode).toBe(404)               // Erreur 404 Not Found
      expect(res.body.error).toBe("Student not found") // Message d'erreur explicite
    })

    // === TESTS DE CRÉATION (POST) ===

    // Test de création réussie : nouvel étudiant valide
    test("POST /students should create a new student", async () => {
      const res = await request(app)
        .post("/students")
        .send({ name: "David", email: "david@example.com" })
      expect(res.statusCode).toBe(201)               // Statut 201 Created
      expect(res.body.name).toBe("David")            // Nom correctement sauvé
      expect(res.body.email).toBe("david@example.com") // Email correctement sauvé
      expect(res.body.id).toBeDefined()              // ID généré automatiquement
    })

    // Tests de validation : données manquantes ou invalides
    test("POST /students should return 400 for missing name", async () => {
      const res = await request(app)
        .post("/students")
        .send({ email: "test@example.com" }) // Nom manquant
      expect(res.statusCode).toBe(400)       // Erreur de validation
      expect(res.body.error).toBe("name and email required")
    })

    test("POST /students should return 400 for missing email", async () => {
      const res = await request(app).post("/students").send({ name: "Test" }) // Email manquant
      expect(res.statusCode).toBe(400)       // Erreur de validation
      expect(res.body.error).toBe("name and email required")
    })

    test("POST /students should return 400 for empty fields", async () => {
      const res = await request(app)
        .post("/students")
        .send({ name: "", email: "" })       // Champs vides
      expect(res.statusCode).toBe(400)       // Erreur de validation
      expect(res.body.error).toBe("name and email required")
    })

    // Test de règle métier : unicité de l'email
    test("POST /students should not allow duplicate email", async () => {
      const res = await request(app)
        .post("/students")
        .send({ name: "Eve", email: "alice@example.com" }) // Email déjà utilisé
      expect(res.statusCode).toBe(400)       // Erreur de validation métier
      expect(res.body.error).toBe("Email must be unique")
    })

    // === TESTS DE MISE À JOUR (PUT) ===

    // Test de mise à jour complète : nom et email
    test("PUT /students/:id should update student", async () => {
      const res = await request(app)
        .put("/students/1")
        .send({ name: "Alice Updated", email: "alice.updated@example.com" })
      expect(res.statusCode).toBe(200)               // Statut 200 OK
      expect(res.body.name).toBe("Alice Updated")    // Nom mis à jour
      expect(res.body.email).toBe("alice.updated@example.com") // Email mis à jour
    })

    // Test de mise à jour partielle : nom seulement
    test("PUT /students/:id should update only name", async () => {
      const res = await request(app)
        .put("/students/1")
        .send({ name: "Alice New Name" })             // Seul le nom est fourni
      expect(res.statusCode).toBe(200)
      expect(res.body.name).toBe("Alice New Name")    // Nom mis à jour
      expect(res.body.email).toBe("alice@example.com") // Email inchangé
    })

    // Test de mise à jour partielle : email seulement
    test("PUT /students/:id should update only email", async () => {
      const res = await request(app)
        .put("/students/1")
        .send({ email: "alice.new@example.com" })     // Seul l'email est fourni
      expect(res.statusCode).toBe(200)
      expect(res.body.name).toBe("Alice")             // Nom inchangé
      expect(res.body.email).toBe("alice.new@example.com") // Email mis à jour
    })

    // Test de gestion d'erreur : étudiant inexistant pour mise à jour
    test("PUT /students/:id should return 404 for non-existent student", async () => {
      const res = await request(app).put("/students/999").send({ name: "Test" }) // ID inexistant
      expect(res.statusCode).toBe(404)               // Erreur 404 Not Found
      expect(res.body.error).toBe("Student not found")
    })

    // Test de validation métier : email unique lors de la mise à jour
    test("PUT /students/:id should return 400 for duplicate email", async () => {
      const res = await request(app)
        .put("/students/1")
        .send({ email: "bob@example.com" })          // Email déjà utilisé par Bob
      expect(res.statusCode).toBe(400)               // Erreur de validation
      expect(res.body.error).toBe("Email must be unique")
    })

    // === TESTS DE SUPPRESSION (DELETE) ===

    // Test de suppression réussie
    test("DELETE /students/:id should delete student", async () => {
      const res = await request(app).delete("/students/1")
      expect(res.statusCode).toBe(204)               // Statut 204 No Content

      // Vérification : l'étudiant n'existe plus
      const getRes = await request(app).get("/students/1")
      expect(getRes.statusCode).toBe(404)            // Confirmation de la suppression
    })

    // Test de gestion d'erreur : étudiant inexistant pour suppression
    test("DELETE /students/:id should return 404 for non-existent student", async () => {
      const res = await request(app).delete("/students/999") // ID inexistant
      expect(res.statusCode).toBe(404)               // Erreur 404 Not Found
      expect(res.body.error).toBe("Student not found")
    })

    // Test de règle métier : impossible de supprimer un étudiant inscrit
    test("DELETE /students/:id should return 400 if student is enrolled", async () => {
      // Préparation : inscrire l'étudiant à un cours
      await request(app).post("/courses/1/students/1")

      const res = await request(app).delete("/students/1")
      expect(res.statusCode).toBe(400)               // Erreur de règle métier
      expect(res.body.error).toBe("Cannot delete student: enrolled in a course")
    })
  })

  // ==================== TESTS COURS ====================

  // Tests pour l'API des cours - Couvre toutes les opérations CRUD
  describe("Courses API", () => {
    // === TESTS DE LECTURE (GET) ===

    // Test basique : récupération de tous les cours
    test("GET /courses should return seeded courses", async () => {
      const res = await request(app).get("/courses")
      expect(res.statusCode).toBe(200)           // Statut HTTP OK
      expect(res.body.courses.length).toBe(3)    // 3 cours dans les données de test
      expect(res.body.courses[0].title).toBe("Math") // Premier cours est Math
      expect(res.body.total).toBe(3)             // Total correct
    })

    // Test de filtrage : recherche par titre
    test("GET /courses with title filter should return filtered results", async () => {
      const res = await request(app).get("/courses?title=Math")
      expect(res.statusCode).toBe(200)
      expect(res.body.courses.length).toBe(1)    // Un seul résultat
      expect(res.body.courses[0].title).toBe("Math") // Résultat correct
    })

    // Test de filtrage : recherche par enseignant (partiel)
    test("GET /courses with teacher filter should return filtered results", async () => {
      const res = await request(app).get("/courses?teacher=Smith")
      expect(res.statusCode).toBe(200)
      expect(res.body.courses.length).toBe(1)    // Un seul résultat
      expect(res.body.courses[0].teacher).toBe("Mr. Smith") // Nom complet trouvé
    })

    // Test de pagination : limite le nombre de résultats
    test("GET /courses with pagination should return paginated results", async () => {
      const res = await request(app).get("/courses?page=1&limit=2")
      expect(res.statusCode).toBe(200)
      expect(res.body.courses.length).toBe(2)    // Limite respectée
      expect(res.body.total).toBe(3)             // Total global inchangé
    })

    test("GET /courses/:id should return course with students", async () => {
      const res = await request(app).get("/courses/1")
      expect(res.statusCode).toBe(200)
      expect(res.body.course.title).toBe("Math")
      expect(res.body.course.teacher).toBe("Mr. Smith")
      expect(Array.isArray(res.body.students)).toBe(true)
    })

    test("GET /courses/:id should return 404 for non-existent course", async () => {
      const res = await request(app).get("/courses/999")
      expect(res.statusCode).toBe(404)
      expect(res.body.error).toBe("Course not found")
    })

    test("POST /courses should create a new course", async () => {
      const res = await request(app)
        .post("/courses")
        .send({ title: "Chemistry", teacher: "Dr. Wilson" })
      expect(res.statusCode).toBe(201)
      expect(res.body.title).toBe("Chemistry")
      expect(res.body.teacher).toBe("Dr. Wilson")
      expect(res.body.id).toBeDefined()
    })

    test("POST /courses should return 400 for missing title", async () => {
      const res = await request(app)
        .post("/courses")
        .send({ teacher: "Dr. Test" })
      expect(res.statusCode).toBe(400)
      expect(res.body.error).toBe("title and teacher required")
    })

    test("POST /courses should return 400 for missing teacher", async () => {
      const res = await request(app)
        .post("/courses")
        .send({ title: "Test Course" })
      expect(res.statusCode).toBe(400)
      expect(res.body.error).toBe("title and teacher required")
    })

    test("POST /courses should not allow duplicate course title", async () => {
      await request(app)
        .post("/courses")
        .send({ title: "Mathematics", teacher: "Prof. Smith" })

      const res = await request(app)
        .post("/courses")
        .send({ title: "Mathematics", teacher: "Prof. Jones" })

      expect(res.statusCode).toBe(400)
      expect(res.body.error).toBe("Course title must be unique")
    })

    test("PUT /courses/:id should update course", async () => {
      const res = await request(app)
        .put("/courses/1")
        .send({ title: "Advanced Math", teacher: "Prof. Smith" })
      expect(res.statusCode).toBe(200)
      expect(res.body.title).toBe("Advanced Math")
      expect(res.body.teacher).toBe("Prof. Smith")
    })

    test("PUT /courses/:id should update only title", async () => {
      const res = await request(app)
        .put("/courses/1")
        .send({ title: "New Math" })
      expect(res.statusCode).toBe(200)
      expect(res.body.title).toBe("New Math")
      expect(res.body.teacher).toBe("Mr. Smith") // Teacher inchangé
    })

    test("PUT /courses/:id should update only teacher", async () => {
      const res = await request(app)
        .put("/courses/1")
        .send({ teacher: "Dr. New Teacher" })
      expect(res.statusCode).toBe(200)
      expect(res.body.title).toBe("Math") // Title inchangé
      expect(res.body.teacher).toBe("Dr. New Teacher")
    })

    test("PUT /courses/:id should return 404 for non-existent course", async () => {
      const res = await request(app).put("/courses/999").send({ title: "Test" })
      expect(res.statusCode).toBe(404)
      expect(res.body.error).toBe("Course not found")
    })

    test("PUT /courses/:id should return 400 for duplicate title", async () => {
      const res = await request(app)
        .put("/courses/1")
        .send({ title: "Physics" }) // Titre du cours 2
      expect(res.statusCode).toBe(400)
      expect(res.body.error).toBe("Course title must be unique")
    })

    test("DELETE /courses/:id should delete course", async () => {
      const res = await request(app).delete("/courses/1")
      expect(res.statusCode).toBe(204)

      // Vérifier que le cours n'existe plus
      const getRes = await request(app).get("/courses/1")
      expect(getRes.statusCode).toBe(404)
    })

    test("DELETE /courses/:id should return 404 for non-existent course", async () => {
      const res = await request(app).delete("/courses/999")
      expect(res.statusCode).toBe(404)
      expect(res.body.error).toBe("Course not found")
    })

    test("DELETE /courses/:id should return 400 if students are enrolled", async () => {
      // Inscrire un étudiant au cours
      await request(app).post("/courses/1/students/1")

      const res = await request(app).delete("/courses/1")
      expect(res.statusCode).toBe(400)
      expect(res.body.error).toBe("Cannot delete course: students are enrolled")
    })
  })

  // ==================== TESTS INSCRIPTIONS ====================

  // Tests pour l'API des inscriptions - Gère la relation many-to-many entre étudiants et cours
  describe("Enrollments API", () => {
    // === TESTS D'INSCRIPTION (POST) ===

    // Test d'inscription réussie : étudiant vers cours
    test("POST /courses/:courseId/students/:studentId should enroll student", async () => {
      const res = await request(app).post("/courses/1/students/1")
      expect(res.statusCode).toBe(201)           // Statut 201 Created
      expect(res.body.success).toBe(true)        // Confirmation de succès

      // Vérification : l'étudiant apparaît dans la liste du cours
      const courseRes = await request(app).get("/courses/1")
      expect(courseRes.body.students.length).toBe(1)     // Un étudiant inscrit
      expect(courseRes.body.students[0].name).toBe("Alice") // Alice est inscrite
    })

    // Tests de validation : entités inexistantes
    test("POST /courses/:courseId/students/:studentId should return 400 for non-existent course", async () => {
      const res = await request(app).post("/courses/999/students/1") // Cours inexistant
      expect(res.statusCode).toBe(400)           // Erreur de validation
      expect(res.body.error).toBe("Course not found")
    })

    test("POST /courses/:courseId/students/:studentId should return 400 for non-existent student", async () => {
      const res = await request(app).post("/courses/1/students/999") // Étudiant inexistant
      expect(res.statusCode).toBe(400)           // Erreur de validation
      expect(res.body.error).toBe("Student not found")
    })

    // Test de règle métier : pas de double inscription
    test("POST /courses/:courseId/students/:studentId should return 400 for duplicate enrollment", async () => {
      // Première inscription (réussie)
      await request(app).post("/courses/1/students/1")

      // Tentative de double inscription
      const res = await request(app).post("/courses/1/students/1")
      expect(res.statusCode).toBe(400)           // Erreur de règle métier
      expect(res.body.error).toBe("Student already enrolled in this course")
    })

    // Test de règle métier : limite de capacité du cours (4 étudiants max)
    test("POST /courses/:courseId/students/:studentId should return 400 when course is full", async () => {
      // Préparation : remplir le cours à sa capacité maximale (3 étudiants)
      await request(app).post("/courses/1/students/1")
      await request(app).post("/courses/1/students/2")
      await request(app).post("/courses/1/students/3")

      // Créer un 4ème étudiant pour tester la limite
      await request(app)
        .post("/students")
        .send({ name: "David", email: "david@example.com" })

      // Tentative d'inscription du 4ème étudiant (doit échouer)
      const res = await request(app).post("/courses/1/students/4")
      expect(res.statusCode).toBe(400)           // Erreur de capacité
      expect(res.body.error).toBe("Course is full")
    })

    // === TESTS DE DÉSINSCRIPTION (DELETE) ===

    // Test de désinscription réussie
    test("DELETE /courses/:courseId/students/:studentId should unenroll student", async () => {
      // Préparation : inscrire d'abord l'étudiant
      await request(app).post("/courses/1/students/1")

      const res = await request(app).delete("/courses/1/students/1")
      expect(res.statusCode).toBe(204)           // Statut 204 No Content

      // Vérification : l'étudiant n'est plus dans la liste du cours
      const courseRes = await request(app).get("/courses/1")
      expect(courseRes.body.students.length).toBe(0) // Aucun étudiant inscrit
    })

    // Test de gestion d'erreur : inscription inexistante
    test("DELETE /courses/:courseId/students/:studentId should return 404 for non-existent enrollment", async () => {
      const res = await request(app).delete("/courses/1/students/1") // Pas d'inscription existante
      expect(res.statusCode).toBe(404)           // Erreur 404 Not Found
      expect(res.body.error).toBe("Enrollment not found")
    })
  })

  // ==================== TESTS GÉNÉRAUX ====================

  // Tests transversaux et de comportement global de l'API
  describe("General API Tests", () => {
    // Test de gestion des routes inexistantes
    test("GET /nonexistent-route should return 404", async () => {
      const res = await request(app).get("/nonexistent-route") // Route non définie
      expect(res.statusCode).toBe(404)           // Erreur 404 Not Found
      expect(res.body.error).toBe("Not Found")   // Message d'erreur générique
    })

    // === TESTS DE COHÉRENCE DES RELATIONS ===

    // Test de cohérence : étudiant voit ses cours après inscription
    test("Student should have courses after enrollment", async () => {
      // Inscrire Alice à deux cours
      await request(app).post("/courses/1/students/1")
      await request(app).post("/courses/2/students/1")

      // Vérifier que Alice voit ses deux cours
      const res = await request(app).get("/students/1")
      expect(res.statusCode).toBe(200)
      expect(res.body.courses.length).toBe(2)    // Deux cours inscrits
      expect(res.body.courses[0].title).toBe("Math")    // Premier cours
      expect(res.body.courses[1].title).toBe("Physics") // Deuxième cours
    })

    // Test de cohérence : cours voit ses étudiants après inscription
    test("Course should have students after enrollment", async () => {
      // Inscrire deux étudiants au cours de Math
      await request(app).post("/courses/1/students/1")
      await request(app).post("/courses/1/students/2")

      // Vérifier que le cours voit ses deux étudiants
      const res = await request(app).get("/courses/1")
      expect(res.statusCode).toBe(200)
      expect(res.body.students.length).toBe(2)   // Deux étudiants inscrits
      expect(res.body.students[0].name).toBe("Alice")   // Premier étudiant
      expect(res.body.students[1].name).toBe("Bob")     // Deuxième étudiant
    })
  })
})
