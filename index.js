const express = require("express");

const server = express();

server.use(express.json());

var projects = [
  {
    id: "1",
    title: "Primeiro projeto",
    tasks: []
  },
  {
    id: "2",
    title: "Segundo projeto",
    tasks: []
  }
];

var contRequests = 0;

server.listen(3000, () => {
  for (let i = 0; i < projects.length; i++) {
    console.log(projects[i]);
  }
});

server.use((req, res, next) => {
  contRequests++;
  console.log(
    contRequests <= 1
      ? `Foi feita ${contRequests} requisição.`
      : `Foram feitas ${contRequests} requisições.`
  );
  return next();
});

function checkIdExists(req, res, next) {
  const { id } = req.params;

  for (let i = 0; i < projects.length; i++) {
    if (id === projects[i].id) {
      return next();
    }
  }

  return res.status(400).json({ error: "Project does not exist" });
}

server.post("/projects/", (req, res) => {
  const { id, title } = req.body;

  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project);
  return res.json(projects);
});

server.get("/projects/", (req, res) => {
  return res.json(projects);
});

server.put("/projects/:id", checkIdExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  for (let i = 0; i < projects.length; i++) {
    if (projects[i].id === id) {
      projects[i].title = title;
    }
  }

  return res.json(projects);
});

server.delete("/projects/:id", checkIdExists, (req, res) => {
  const { id } = req.params;

  for (let i = 0; i < projects.length; i++) {
    if (projects[i].id === id) {
      projects.splice(i, 1);
    }
  }

  return res.send();
});

server.post("/projects/:id/tasks", checkIdExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  for (let i = 0; i < projects.length; i++) {
    if (projects[i].id === id) {
      projects[i].tasks.push(title);
    }
  }

  return res.json(projects);
});
