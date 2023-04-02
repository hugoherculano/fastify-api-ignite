import fastify from "fastify";
import cookie from "@fastify/cookie";
import { transactionsRoutes } from "./routes/transactions";

const app = fastify();

app.register(cookie);

app.register(transactionsRoutes, {
    prefix: "transactions",
});


app.listen({ port: 3333 }).then(() => {
    console.log("Runnirg!🤘🏻✅")
})