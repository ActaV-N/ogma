import { Inject } from "typedi";
import { Context } from "./context";

export abstract class Repository {
  @Inject()
  protected context!: Context;
}
