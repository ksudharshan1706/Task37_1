import express from "express"; // "type": "module"
import { MongoClient } from "mongodb"; //npm i mongodb
import dotenv from "dotenv"; //npm i dotenv
import {
  addStudent,
  AddMentor,
  getMentors,
  getStudents,
  getStudentsbyMentorName,
  updateMentor,
  getMentor,
  getStudent,
  updateStudent,
} from "./helper.js";

const app = express();
dotenv.config();
dotenv.config();
const PORT = process.env.PORT;
//const MONGO_URL = "mongodb://127.0.0.1"; // this url is responsible for connecting the DB.
const MONGO_URL = process.env.MONGO_URL;
console.log(PORT, MONGO_URL);
async function createConnection() {
  const client = new MongoClient(MONGO_URL);
  await client.connect();
  console.log("Mongo is Connected");
  return client;
}

export const client = await createConnection();

app.use(express.json());

//Home
app.get("/", function (request, response) {
  response.send("TASK 37!! 🐱‍🏍 🌏 ✨🤩");
});

app.get("/Mentors", async function (request, response) {
  const result = await getMentors();
  response.send(result);
});

app.get("/Students", async function (request, response) {
  const result = await getStudents();
  response.send(result);
});

app.post("/AddMentor", async function (request, response) {
  const newMentor = request.body;
  const result = AddMentor(newMentor);

  newMentor
    ? response.send(result)
    : response.send({ message: "No mentor added" });
});

app.post("/AddStudent", async function (request, response) {
  const newStudent = request.body;
  const result = await addStudent(newStudent);

  newStudent
    ? response.send(result)
    : response.send({ message: "No student added" });
});

//assign the first mentor
app.put("/assignMentor", async function (request, response) {
  const Mentor = request.body;
  const mentorName = { MentorName: Mentor.MentorName };

  const findStudent = await client
    .db("b39we")
    .collection("Student")
    .findOne({ MentorName: "" });
  if (!findStudent) {
    response.send({ message: "All students are assigned with a mentor" });
    return;
  }
  const Student = findStudent.StudentName;

  //adding the student to mentor's Student array
  const findMentor = await getMentor(Mentor.MentorName);
  findMentor.Students.push(Student);
  const updatedMentor = await updateMentor(Mentor.MentorName, findMentor);

  //updating Students Mentor
  const updatedStudent = await updateStudent(Student, mentorName);

  response.send(findMentor);
});

//get students to a partcular mentor
app.get("/StudentsOfMentor/:mentorName", async function (request, response) {
  const { mentorName } = request.params;
  const result = await getStudentsbyMentorName(mentorName);
  response.send(result);
});

//updating the mentor and adding previousMentor
app.put("/updateMentor/:StudentName", async function (request, response) {
  const Mentor = request.body;
  const { StudentName } = request.params;
  //finding the student
  const findStudent = await getStudent(StudentName);

  const Student = findStudent.StudentName;
  const PreviousMentor = findStudent.MentorName;

  //removing student from previous mentor
  const findpreviousMentor = await getMentor(PreviousMentor);
  findpreviousMentor.Students.pop(Student);
  const updatePreviousMentor = await updateMentor(
    PreviousMentor,
    findpreviousMentor
  );

  //finding new mentor
  const findMentor = await getMentor(Mentor.MentorName);
  findMentor.Students.push(Student);
  const updatedMentor = await updateMentor(Mentor.MentorName, findMentor);

  //updating students previous mentor and new mentor
  const newMentorName = {
    PreviousMentor: PreviousMentor,
    MentorName: Mentor.MentorName,
  };
  const updatedStudent = await updateStudent(Student, newMentorName);

  response.send(findMentor);
});

app.get("/PreviousMentor/:StudentName", async function (request, response) {
  const { StudentName } = request.params;
  const result = await getStudent(StudentName);
  result
    ? response.send({
        StudentName: StudentName,
        PreviousMentor: result.PreviousMentor,
      })
    : response.send({ message: "No Student available with that name" });
});
app.listen(PORT, () => console.log(`The server started in: ${PORT} ✨✨`));
