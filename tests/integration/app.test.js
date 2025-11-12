const request = require('supertest');
const app = require('../../src/app');

describe('Student-Course API Tests Complets', () => {
  beforeEach(() => {
    require('../../src/services/storage').reset();
    require('../../src/services/storage').seed();
  });

  // ==================== TESTS ÉTUDIANTS ====================
  
  describe('Students API', () => {
    test('GET /students should return seeded students', async () => {
      const res = await request(app).get('/students');
      expect(res.statusCode).toBe(200);
      expect(res.body.students.length).toBe(3);
      expect(res.body.students[0].name).toBe('Alice');
      expect(res.body.total).toBe(3);
    });

    test('GET /students with name filter should return filtered results', async () => {
      const res = await request(app).get('/students?name=Alice');
      expect(res.statusCode).toBe(200);
      expect(res.body.students.length).toBe(1);
      expect(res.body.students[0].name).toBe('Alice');
    });

    test('GET /students with email filter should return filtered results', async () => {
      const res = await request(app).get('/students?email=bob');
      expect(res.statusCode).toBe(200);
      expect(res.body.students.length).toBe(1);
      expect(res.body.students[0].email).toBe('bob@example.com');
    });

    test('GET /students with pagination should return paginated results', async () => {
      const res = await request(app).get('/students?page=1&limit=2');
      expect(res.statusCode).toBe(200);
      expect(res.body.students.length).toBe(2);
      expect(res.body.total).toBe(3);
    });

    test('GET /students/:id should return student with courses', async () => {
      const res = await request(app).get('/students/1');
      expect(res.statusCode).toBe(200);
      expect(res.body.student.name).toBe('Alice');
      expect(res.body.student.email).toBe('alice@example.com');
      expect(Array.isArray(res.body.courses)).toBe(true);
    });

    test('GET /students/:id should return 404 for non-existent student', async () => {
      const res = await request(app).get('/students/999');
      expect(res.statusCode).toBe(404);
      expect(res.body.error).toBe('Student not found');
    });

    test('POST /students should create a new student', async () => {
      const res = await request(app)
        .post('/students')
        .send({ name: 'David', email: 'david@example.com' });
      expect(res.statusCode).toBe(201);
      expect(res.body.name).toBe('David');
      expect(res.body.email).toBe('david@example.com');
      expect(res.body.id).toBeDefined();
    });

    test('POST /students should return 400 for missing name', async () => {
      const res = await request(app)
        .post('/students')
        .send({ email: 'test@example.com' });
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('name and email required');
    });

    test('POST /students should return 400 for missing email', async () => {
      const res = await request(app)
        .post('/students')
        .send({ name: 'Test' });
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('name and email required');
    });

    test('POST /students should return 400 for empty fields', async () => {
      const res = await request(app)
        .post('/students')
        .send({ name: '', email: '' });
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('name and email required');
    });

    test('POST /students should not allow duplicate email', async () => {
      const res = await request(app)
        .post('/students')
        .send({ name: 'Eve', email: 'alice@example.com' });
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('Email must be unique');
    });

    test('PUT /students/:id should update student', async () => {
      const res = await request(app)
        .put('/students/1')
        .send({ name: 'Alice Updated', email: 'alice.updated@example.com' });
      expect(res.statusCode).toBe(200);
      expect(res.body.name).toBe('Alice Updated');
      expect(res.body.email).toBe('alice.updated@example.com');
    });

    test('PUT /students/:id should update only name', async () => {
      const res = await request(app)
        .put('/students/1')
        .send({ name: 'Alice New Name' });
      expect(res.statusCode).toBe(200);
      expect(res.body.name).toBe('Alice New Name');
      expect(res.body.email).toBe('alice@example.com'); // Email inchangé
    });

    test('PUT /students/:id should update only email', async () => {
      const res = await request(app)
        .put('/students/1')
        .send({ email: 'alice.new@example.com' });
      expect(res.statusCode).toBe(200);
      expect(res.body.name).toBe('Alice'); // Nom inchangé
      expect(res.body.email).toBe('alice.new@example.com');
    });

    test('PUT /students/:id should return 404 for non-existent student', async () => {
      const res = await request(app)
        .put('/students/999')
        .send({ name: 'Test' });
      expect(res.statusCode).toBe(404);
      expect(res.body.error).toBe('Student not found');
    });

    test('PUT /students/:id should return 400 for duplicate email', async () => {
      const res = await request(app)
        .put('/students/1')
        .send({ email: 'bob@example.com' }); // Email de Bob
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('Email must be unique');
    });

    test('DELETE /students/:id should delete student', async () => {
      const res = await request(app).delete('/students/1');
      expect(res.statusCode).toBe(204);
      
      // Vérifier que l'étudiant n'existe plus
      const getRes = await request(app).get('/students/1');
      expect(getRes.statusCode).toBe(404);
    });

    test('DELETE /students/:id should return 404 for non-existent student', async () => {
      const res = await request(app).delete('/students/999');
      expect(res.statusCode).toBe(404);
      expect(res.body.error).toBe('Student not found');
    });

    test('DELETE /students/:id should return 400 if student is enrolled', async () => {
      // Inscrire l'étudiant à un cours
      await request(app).post('/courses/1/students/1');
      
      const res = await request(app).delete('/students/1');
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('Cannot delete student: enrolled in a course');
    });
  });

  // ==================== TESTS COURS ====================
  
  describe('Courses API', () => {
    test('GET /courses should return seeded courses', async () => {
      const res = await request(app).get('/courses');
      expect(res.statusCode).toBe(200);
      expect(res.body.courses.length).toBe(3);
      expect(res.body.courses[0].title).toBe('Math');
      expect(res.body.total).toBe(3);
    });

    test('GET /courses with title filter should return filtered results', async () => {
      const res = await request(app).get('/courses?title=Math');
      expect(res.statusCode).toBe(200);
      expect(res.body.courses.length).toBe(1);
      expect(res.body.courses[0].title).toBe('Math');
    });

    test('GET /courses with teacher filter should return filtered results', async () => {
      const res = await request(app).get('/courses?teacher=Smith');
      expect(res.statusCode).toBe(200);
      expect(res.body.courses.length).toBe(1);
      expect(res.body.courses[0].teacher).toBe('Mr. Smith');
    });

    test('GET /courses with pagination should return paginated results', async () => {
      const res = await request(app).get('/courses?page=1&limit=2');
      expect(res.statusCode).toBe(200);
      expect(res.body.courses.length).toBe(2);
      expect(res.body.total).toBe(3);
    });

    test('GET /courses/:id should return course with students', async () => {
      const res = await request(app).get('/courses/1');
      expect(res.statusCode).toBe(200);
      expect(res.body.course.title).toBe('Math');
      expect(res.body.course.teacher).toBe('Mr. Smith');
      expect(Array.isArray(res.body.students)).toBe(true);
    });

    test('GET /courses/:id should return 404 for non-existent course', async () => {
      const res = await request(app).get('/courses/999');
      expect(res.statusCode).toBe(404);
      expect(res.body.error).toBe('Course not found');
    });

    test('POST /courses should create a new course', async () => {
      const res = await request(app)
        .post('/courses')
        .send({ title: 'Chemistry', teacher: 'Dr. Wilson' });
      expect(res.statusCode).toBe(201);
      expect(res.body.title).toBe('Chemistry');
      expect(res.body.teacher).toBe('Dr. Wilson');
      expect(res.body.id).toBeDefined();
    });

    test('POST /courses should return 400 for missing title', async () => {
      const res = await request(app)
        .post('/courses')
        .send({ teacher: 'Dr. Test' });
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('title and teacher required');
    });

    test('POST /courses should return 400 for missing teacher', async () => {
      const res = await request(app)
        .post('/courses')
        .send({ title: 'Test Course' });
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('title and teacher required');
    });

    test('POST /courses should not allow duplicate course title', async () => {
      await request(app)
        .post('/courses')
        .send({ title: 'Mathematics', teacher: 'Prof. Smith' });
      
      const res = await request(app)
        .post('/courses')
        .send({ title: 'Mathematics', teacher: 'Prof. Jones' });
      
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('Course title must be unique');
    });

    test('PUT /courses/:id should update course', async () => {
      const res = await request(app)
        .put('/courses/1')
        .send({ title: 'Advanced Math', teacher: 'Prof. Smith' });
      expect(res.statusCode).toBe(200);
      expect(res.body.title).toBe('Advanced Math');
      expect(res.body.teacher).toBe('Prof. Smith');
    });

    test('PUT /courses/:id should update only title', async () => {
      const res = await request(app)
        .put('/courses/1')
        .send({ title: 'New Math' });
      expect(res.statusCode).toBe(200);
      expect(res.body.title).toBe('New Math');
      expect(res.body.teacher).toBe('Mr. Smith'); // Teacher inchangé
    });

    test('PUT /courses/:id should update only teacher', async () => {
      const res = await request(app)
        .put('/courses/1')
        .send({ teacher: 'Dr. New Teacher' });
      expect(res.statusCode).toBe(200);
      expect(res.body.title).toBe('Math'); // Title inchangé
      expect(res.body.teacher).toBe('Dr. New Teacher');
    });

    test('PUT /courses/:id should return 404 for non-existent course', async () => {
      const res = await request(app)
        .put('/courses/999')
        .send({ title: 'Test' });
      expect(res.statusCode).toBe(404);
      expect(res.body.error).toBe('Course not found');
    });

    test('PUT /courses/:id should return 400 for duplicate title', async () => {
      const res = await request(app)
        .put('/courses/1')
        .send({ title: 'Physics' }); // Titre du cours 2
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('Course title must be unique');
    });

    test('DELETE /courses/:id should delete course', async () => {
      const res = await request(app).delete('/courses/1');
      expect(res.statusCode).toBe(204);
      
      // Vérifier que le cours n'existe plus
      const getRes = await request(app).get('/courses/1');
      expect(getRes.statusCode).toBe(404);
    });

    test('DELETE /courses/:id should return 404 for non-existent course', async () => {
      const res = await request(app).delete('/courses/999');
      expect(res.statusCode).toBe(404);
      expect(res.body.error).toBe('Course not found');
    });

    test('DELETE /courses/:id should return 400 if students are enrolled', async () => {
      // Inscrire un étudiant au cours
      await request(app).post('/courses/1/students/1');
      
      const res = await request(app).delete('/courses/1');
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('Cannot delete course: students are enrolled');
    });
  });

  // ==================== TESTS INSCRIPTIONS ====================
  
  describe('Enrollments API', () => {
    test('POST /courses/:courseId/students/:studentId should enroll student', async () => {
      const res = await request(app).post('/courses/1/students/1');
      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      
      // Vérifier que l'étudiant est inscrit
      const courseRes = await request(app).get('/courses/1');
      expect(courseRes.body.students.length).toBe(1);
      expect(courseRes.body.students[0].name).toBe('Alice');
    });

    test('POST /courses/:courseId/students/:studentId should return 400 for non-existent course', async () => {
      const res = await request(app).post('/courses/999/students/1');
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('Course not found');
    });

    test('POST /courses/:courseId/students/:studentId should return 400 for non-existent student', async () => {
      const res = await request(app).post('/courses/1/students/999');
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('Student not found');
    });

    test('POST /courses/:courseId/students/:studentId should return 400 for duplicate enrollment', async () => {
      await request(app).post('/courses/1/students/1');
      
      const res = await request(app).post('/courses/1/students/1');
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('Student already enrolled in this course');
    });

    test('POST /courses/:courseId/students/:studentId should return 400 when course is full', async () => {
      // Inscrire 3 étudiants (limite)
      await request(app).post('/courses/1/students/1');
      await request(app).post('/courses/1/students/2');
      await request(app).post('/courses/1/students/3');
      
      // Créer un 4ème étudiant
      await request(app)
        .post('/students')
        .send({ name: 'David', email: 'david@example.com' });
      
      const res = await request(app).post('/courses/1/students/4');
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('Course is full');
    });

    test('DELETE /courses/:courseId/students/:studentId should unenroll student', async () => {
      // Inscrire d'abord l'étudiant
      await request(app).post('/courses/1/students/1');
      
      const res = await request(app).delete('/courses/1/students/1');
      expect(res.statusCode).toBe(204);
      
      // Vérifier que l'étudiant n'est plus inscrit
      const courseRes = await request(app).get('/courses/1');
      expect(courseRes.body.students.length).toBe(0);
    });

    test('DELETE /courses/:courseId/students/:studentId should return 404 for non-existent enrollment', async () => {
      const res = await request(app).delete('/courses/1/students/1');
      expect(res.statusCode).toBe(404);
      expect(res.body.error).toBe('Enrollment not found');
    });
  });

  // ==================== TESTS GÉNÉRAUX ====================
  
  describe('General API Tests', () => {
    test('GET /nonexistent-route should return 404', async () => {
      const res = await request(app).get('/nonexistent-route');
      expect(res.statusCode).toBe(404);
      expect(res.body.error).toBe('Not Found');
    });

    test('Student should have courses after enrollment', async () => {
      await request(app).post('/courses/1/students/1');
      await request(app).post('/courses/2/students/1');
      
      const res = await request(app).get('/students/1');
      expect(res.statusCode).toBe(200);
      expect(res.body.courses.length).toBe(2);
      expect(res.body.courses[0].title).toBe('Math');
      expect(res.body.courses[1].title).toBe('Physics');
    });

    test('Course should have students after enrollment', async () => {
      await request(app).post('/courses/1/students/1');
      await request(app).post('/courses/1/students/2');
      
      const res = await request(app).get('/courses/1');
      expect(res.statusCode).toBe(200);
      expect(res.body.students.length).toBe(2);
      expect(res.body.students[0].name).toBe('Alice');
      expect(res.body.students[1].name).toBe('Bob');
    });
  });

});