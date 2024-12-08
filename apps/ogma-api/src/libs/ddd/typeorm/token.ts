import { Token } from "typedi";
import { DataSource } from "typeorm";

export const dataSourceToken = new Token<DataSource>("datasource");
