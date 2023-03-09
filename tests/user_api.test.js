const supertest = require("supertest");
const { User } = require("../models/user.js");
const {app} = require("../index.js")
import { describe, expect, it,test } from "vitest";



const api = supertest(app)

test("creates a new user", async () => {
    const response = await api
      .post("/api/users")
      .send({
        nome: "John Doe",
        sobrenome: "filantropico",
        email: "johndoe@example.com",
        password: "password123",
      });

    expect(response.status).toBe(201);
    

    const user = await User.findByPk(response.body.id);
    expect(user).toBeDefined();
    expect(user.nome).toBe("John Doe");
    expect(user.email).toBe("johndoe@example.com");
  });

