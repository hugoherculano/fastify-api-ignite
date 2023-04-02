import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "../app";
import { execSync } from "node:child_process";

describe("Transactions routes", () => {
    beforeAll(async () => {
        await app.ready()
    });
    
    afterAll(async () => {
        await app.close()
    });

    beforeEach(() => {
        execSync("npm run knex migrate:rollback --all")
        execSync("npm run knex migrate:latest")
    })
    
    it("should be able to create a new transaction", async () => {
        await request(app.server)
            .post("/transactions")
            .send({
                title: "Test",
                amount: 2300,
                type: "credit",
            })
            .expect(201)
    })

    it("should be able to list all transactions", async () => {
        const createTransactionResponse = await request(app.server)
            .post("/transactions")
            .send({
                title: "Test",
                amount: 2300,
                type: "credit",
            })
        
        const cookies = createTransactionResponse.get('Set-Cookie');

        const listTransactionsResponse = await request(app.server)
            .get("/transactions")
            .set("Cookie", cookies)
            .expect(200)
        
        expect(listTransactionsResponse.body.transactions).toEqual([
            expect.objectContaining({
                title: "Test",
                amount: 2300,
            })
        ])
    })
})
