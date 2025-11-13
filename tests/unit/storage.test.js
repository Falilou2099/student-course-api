// Tests unitaires pour le service de stockage
// Vérifie les fonctionnalités CRUD et les règles métier
const storage = require("../../src/services/storage")

// Configuration exécutée avant chaque test
// Remet à zéro les données et charge les données de test
beforeEach(() => {
  storage.reset() // Vide toutes les collections
  storage.seed() // Charge les données initiales (3 étudiants, 2 cours)
})

// Test de validation : empêcher les titres de cours dupliqués
test("should not allow duplicate course title", () => {
  // ARRANGE - Créer un premier cours
  storage.create("courses", { title: "Math", teacher: "Prof. A" })

  // ACT - Tenter de créer un cours avec le même titre
  const result = storage.create("courses", {
    title: "Math",
    teacher: "Prof. B",
  })

  // ASSERT - Vérifier que la duplication est refusée
  expect(result.error).toBe("Course title must be unique")
})

// Test de lecture : vérifier que les données initiales sont correctement chargées
test("should list seeded students", () => {
  const students = storage.list("students")
  expect(students.length).toBe(3) // 3 étudiants dans les données de test
  expect(students[0].name).toBe("Alice") // Premier étudiant est Alice
})

// Test de création : ajouter un nouvel étudiant
test("should create a new student", () => {
  const result = storage.create("students", {
    name: "David",
    email: "david@example.com",
  })
  expect(result.name).toBe("David") // Nom correctement assigné
  expect(storage.list("students").length).toBe(4) // Total passe à 4 étudiants
})

// Test de validation : empêcher les emails d'étudiants dupliqués
test("should not allow duplicate student email", () => {
  const result = storage.create("students", {
    name: "Eve",
    email: "alice@example.com", // Email déjà utilisé par Alice
  })
  expect(result.error).toBe("Email must be unique")
})

// Test de suppression : retirer un étudiant
test("should delete a student", () => {
  const students = storage.list("students")
  const result = storage.remove("students", students[0].id)
  expect(result).toBe(true) // Suppression réussie
})

// Test de règle métier : limiter le nombre d'étudiants par cours (max 4)
test("should not allow more than 4 students in a course", () => {
  // ARRANGE - Préparer les étudiants et le cours
  const students = storage.list("students")
  const course = storage.list("courses")[0]

  // Créer des étudiants supplémentaires pour atteindre la limite
  const extra1 = storage.create("students", {
    name: "Extra1",
    email: "extra1@example.com",
  })
  const extra2 = storage.create("students", {
    name: "Extra2",
    email: "extra2@example.com",
  })

  // ACT - Inscrire 4 étudiants (limite maximale)
  storage.enroll(students[0].id, course.id)
  storage.enroll(students[1].id, course.id)
  storage.enroll(students[2].id, course.id)
  storage.enroll(extra1.id, course.id)

  // Tenter d'inscrire un 5ème étudiant (doit échouer)
  const result = storage.enroll(extra2.id, course.id)

  // ASSERT - Vérifier que l'inscription est refusée
  expect(result.error).toBe("Course is full")
})
