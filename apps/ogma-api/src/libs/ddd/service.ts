import { Inject } from "typedi";
import { Context } from "./context";

export abstract class Service {
    @Inject()
    protected context!: Context
}