const storage = require('../../src/services/storage');

beforeEach(() => {
  storage.reset();
  storage.seed();
});

test('should not allow duplicate course title', () => {
  // ARRANGE - Créer un premier cours
  storage.create('courses', { title: 'Math', teacher: 'Prof. A' });
  
  // ACT - Tenter de créer un cours avec le même titre
  const result = storage.create('courses', { title: 'Math', teacher: 'Prof. B' });
  
  // ASSERT - Vérifier que la duplication est refusée
  expect(result.error).toBe('Course title must be unique');
});

test('should list seeded students', () => {
  const students = storage.list('students');
  expect(students.length).toBe(3);
  expect(students[0].name).toBe('Alice');
});

test('should create a new student', () => {
  const result = storage.create('students', { name: 'David', email: 'david@example.com' });
  expect(result.name).toBe('David');
  expect(storage.list('students').length).toBe(4);
});

test('should not allow duplicate student email', () => {
  const result = storage.create('students', { name: 'Eve', email: 'alice@example.com' });
  expect(result.error).toBe('Email must be unique');
});

test('should delete a student', () => {
  const students = storage.list('students');
  const result = storage.remove('students', students[0].id);
  expect(result).toBe(true);
});

test('should not allow more than 4 students in a course', () => {
  // ARRANGE - Préparer les étudiants et le cours
  const students = storage.list('students');
  const course = storage.list('courses')[0];
  
  // Créer des étudiants supplémentaires
  const extra1 = storage.create('students', { name: 'Extra1', email: 'extra1@example.com' });
  const extra2 = storage.create('students', { name: 'Extra2', email: 'extra2@example.com' });
  
  // ACT - Inscrire 4 étudiants (limite)
  storage.enroll(students[0].id, course.id);
  storage.enroll(students[1].id, course.id);
  storage.enroll(students[2].id, course.id);
  storage.enroll(extra1.id, course.id);
  
  // Tenter d'inscrire un 5ème étudiant
  const result = storage.enroll(extra2.id, course.id);
  
  // ASSERT - Vérifier que l'inscription est refusée
  expect(result.error).toBe('Course is full');
});