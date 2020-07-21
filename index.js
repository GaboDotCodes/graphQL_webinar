const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { makeExecutableSchema } = require("graphql-tools");
const _ = require("lodash");

const app = express();

const { log, error } = console;

let name = "Pepito";

const engineers = [
  {
    name: "Sebastian",
    age: 24,
    laptop: "WINDOWSPC",
    boss: 1,
  },
  {
    name: "Andres",
    age: 22,
    laptop: "MACBOOK",
    boss: 2,
  },
  {
    name: "Paola",
    age: 23,
    laptop: "WINDOWSPC",
    boss: 2,
  },
  {
    name: "Carlos",
    age: 23,
    laptop: "MACBOOK",
    boss: 1,
  },
  {
    name: "Gabriel",
    age: 19,
    laptop: "WINDOWSPC",
    boss: 1,
  },
];

const bosses = [
  {
    id: 1,
    name: "Eugenio",
    company: "YoutTube and Github Co.",
  },
  {
    id: 2,
    name: "Aurelio",
    company: "AuraBotix",
  },
];

const schemaExecutable = makeExecutableSchema({
  typeDefs: `
  enum kindOfLaptop {
    MACBOOK
    WINDOWSPC
  }

  type Boss {
    id: ID
    name: String
    company: String
  }

  type Engineer {
    name: String
    age: Int
    laptop: kindOfLaptop
    boss: Boss
  } 

  type Query {
    greet(name: String): String
    greetToUserSaved: String
    getAllEngineers: [Engineer]
  }

  type Mutation {
    changeName(name: String!): String
  }
  `,
  resolvers: {
    Query: {
      greet: (_rootValue, Args, Context, Info) => {
        const { authorization } = Context.headers;
        if (authorization !== "gad7sgft678sdg8yag89dyfu9qhg9jsgj")
          throw new Error("Token invalida");
        const { name } = Args;
        return `Hola ${name}`;
      },
      greetToUserSaved: () => {
        return `Helooww! ${name}`;
      },
      getAllEngineers: () => {
        return engineers;
      },
    },
    Mutation: {
      changeName: (_rootValue, Args, Context, Info) => {
        const { authorization } = Context.headers;
        if (authorization !== "gad7sgft678sdg8yag89dyfu9qhg9jsgj")
          throw new Error("Token invalida");
        name = Args.name;
        return name;
      },
    },
    Engineer: {
      boss: (rootValue, Args, Context, Info) => {
        const { authorization } = Context.headers;
        if (authorization !== "gad7sgft678sdg8yag89dyfu9qhg9jsgj")
          throw new Error("Token invalida");
        const { boss } = rootValue;
        const bossReturn = _.find(bosses, { id: boss });
        return bossReturn;
      },
    },
  },
});

app.use(
  "/api",
  graphqlHTTP({
    schema: schemaExecutable,
    graphiql: true,
  })
);

app.listen(8000, () => {
  console.log("Servidor montado");
});
