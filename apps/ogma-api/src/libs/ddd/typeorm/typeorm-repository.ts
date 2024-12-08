import {
  EntityTarget,
  ObjectLiteral,
  Repository as TypeormRepository,
} from "typeorm";
import { Inject } from "typedi";
import { Context } from "../context";
import { dataSourceToken } from "./token";

export abstract class Repository<T extends ObjectLiteral> {
  @Inject()
  protected context!: Context;

  protected entityClass!: EntityTarget<T>;

  get entityManager() {
    return this.context.get(dataSourceToken).manager;
  }

  async save(entities: T[]) {
    return this.entityManager.save(entities);
  }
}
