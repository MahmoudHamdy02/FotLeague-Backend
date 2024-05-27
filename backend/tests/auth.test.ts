import {describe, it, expect, afterAll, beforeAll} from "@jest/globals";
import app from "../app";
import request from "supertest";
import { pool } from "../db";
import { readFileSync } from "fs";

const sql = readFileSync("./sql/init.sql");

beforeAll(async () => {
    await pool.query("DROP SCHEMA public CASCADE;");
    await pool.query("CREATE SCHEMA public;");
    await pool.query(`GRANT ALL ON SCHEMA public TO ${process.env.POSTGRES_USER};`);
    await pool.query("GRANT ALL ON SCHEMA public TO public;");
    await pool.query(sql.toString());
});

afterAll(async () => {
    await pool.end();
});

describe("Auth System", () => {
    const newUser = {
        email: "test@gmail.com",
        password: "test123",
        name: "testuser",
        role: 2
    };

    let cookie: string;

    it("blocks protected route when not signed in", async () => {
        const res = await request(app).get("/auth/status");
        expect(res.statusCode).toEqual(401);
        expect(res.body.error).toEqual("User is not authenticated");
    });

    it("creates a new user", async () => {
        const res = await request(app).post("/auth/signup")
                .send(newUser);
        expect(res.statusCode).toEqual(201);
        expect(res.body.email).toEqual(newUser.email);
        expect(res.body.name).toEqual(newUser.name);
        expect(res.body.role).toEqual(newUser.role);
        expect(typeof res.body.id).toEqual("number");
        expect(res.body.password).not.toEqual(newUser.password);
        cookie = res.headers["set-cookie"][0];
    });

    it("auto logins user after signup", async () => {
        const res = await request(app).get("/auth/status")
                .set("Cookie", cookie);
        expect(res.statusCode).toEqual(200);
        expect(res.body.email).toEqual(newUser.email);
        expect(res.body.name).toEqual(newUser.name);
        expect(res.body.role).toEqual(newUser.role);
        expect(typeof res.body.id).toEqual("number");
        expect(res.body.password).not.toEqual(newUser.password);
    });

    it("logs out user", async () => {
        const res = await request(app).post("/auth/logout")
                .set("Cookie", cookie);
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toEqual("Logged out");
    });

    it("blocks protected route after logging out", async () => {
        const res = await request(app).get("/auth/status");
        expect(res.statusCode).toEqual(401);
        expect(res.body.error).toEqual("User is not authenticated");
    });

    it("throws an error when signing up using existing email", async () => {
        const res = await request(app).post("/auth/signup")
                .send(newUser);
        expect(res.statusCode).toEqual(400);
        expect(res.body.error).toEqual("Error creating user");
    });

    it("throws an error when logging in using wrong credentials", async () => {
        const res = await request(app).post("/auth/login")
                .send({email: newUser.email, password: "test12"});
        expect(res.statusCode).toEqual(401);
    });

    it("logs in user", async () => {
        const res = await request(app).post("/auth/login")
                .send({email: newUser.email, password: newUser.password});
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toEqual("Signed in");
        cookie = res.headers["set-cookie"][0];
    });

    it("allows access to protected routes after login", async () => {
        const res = await request(app).get("/auth/status")
                .set("Cookie", cookie);
        expect(res.statusCode).toEqual(200);
        expect(res.body.email).toEqual(newUser.email);
        expect(res.body.name).toEqual(newUser.name);
        expect(res.body.role).toEqual(newUser.role);
        expect(typeof res.body.id).toEqual("number");
        expect(res.body.password).not.toEqual(newUser.password);
    });
});