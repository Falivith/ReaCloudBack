const supertest = require("supertest");
const app = require('../app')
const api = supertest(app)
const User = require("../models/user.js");
import { describe, expect, it,test,beforeEach } from "vitest";
import { connectToDatabase } from "../util/db";


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


  test("creates user with e-mail that is already stored in database", async () => {
    const response = await api
      .post("/api/users")
      .send({
        nome: "John Doe",
        sobrenome: "filantropico",
        email: "johndoe@example.com",
        password: "password123",
      });

    expect(response.status).toBe(400);
    
  });



