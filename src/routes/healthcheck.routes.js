import express, { Router } from "express";
import { healthCheck } from "../controllers/healthcheck.controller.js";

const routes = Router();

routes.get("/",healthCheck);

export default routes;