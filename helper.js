import { client } from "./index.js";

export async function addStudent(newStudent) {
  return await client.db("b39we").collection("Student").insertOne(newStudent);
}
export async function AddMentor(newMentor) {
  return await client.db("b39we").collection("Mentor").insertOne(newMentor);
}

export async function getMentors() {
  return await client.db("b39we").collection("Mentor").find({}).toArray();
}

export async function getStudents() {
  return await client.db("b39we").collection("Student").find({}).toArray();
}

export async function getStudentsbyMentorName(id) {
  return await client
    .db("b39we")
    .collection("Student")
    .find({ MentorName: id })
    .toArray();
}

export async function updateMentor(MentorName, findMentor) {
  return await client
    .db("b39we")
    .collection("Mentor")
    .updateOne({ MentorName: MentorName }, { $set: findMentor });
}

export async function getMentor(Mentor) {
  return await client
    .db("b39we")
    .collection("Mentor")
    .findOne({ MentorName: Mentor });
}

export async function getStudent(StudentName) {
  return await client
    .db("b39we")
    .collection("Student")
    .findOne({ StudentName: StudentName });
}

export async function updateStudent(Student, mentorName) {
  await client
    .db("b39we")
    .collection("Student")
    .updateOne({ StudentName: Student }, { $set: mentorName });
}
