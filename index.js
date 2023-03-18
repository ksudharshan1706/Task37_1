import express from "express"; // "type": "module"
import { MongoClient } from "mongodb"; //npm i mongodb
import dotenv from "dotenv"; //npm i dotenv
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

const client = await createConnection();

app.use(express.json());

app.get("/", function (request, response) {
  response.send("TASK 37!! 🐱‍🏍 🌏 ✨🤩");
});
app.post("/AddMentor", async function (request, response) {
  const newMentor = request.body;
  console.log(newMentor);
  const result = await client
    .db("b39we")
    .collection("Mentor")
    .insertOne(newMentor);

  newMentor
    ? response.send(result)
    : response.send({ message: "No mentor added" });
});

app.post("/AddStudent", async function (request, response) {
  const newStudent = request.body;
  console.log(newStudent);
  const result = await client
    .db("b39we")
    .collection("Student")
    .insertOne(newStudent);

  newStudent
    ? response.send(result)
    : response.send({ message: "No student added" });
});

app.put("/assignMentor", async function (request, response) {
  const Mentor = request.body;

  const findStudent = await client
    .db("b39we")
    .collection("Student")
    .findOne({ MentorName: "" });

  const Student = findStudent.StudentName;
  const findMentor = await client
    .db("b39we")
    .collection("Mentor")
    .findOne({ MentorName: Mentor.MentorName });

  const mentorName = { MentorName: Mentor.MentorName };
  console.log(findMentor);
  findMentor.Students =
    typeof findMentor.Students === typeof []
      ? [Student]
      : findMentor.Students.push(Student);
  //
  console.log(Student);
  const updateMentor = await client
    .db("b39we")
    .collection("Mentor")
    .updateOne({ MentorName: Mentor.MentorName }, { $set: findMentor });

  const updateStudent = await client
    .db("b39we")
    .collection("Student")
    .updateOne({ StudentName: Student }, { $set: mentorName });
  response.send(updateMentor);
});

app.listen(PORT, () => console.log(`The server started in: ${PORT} ✨✨`));
