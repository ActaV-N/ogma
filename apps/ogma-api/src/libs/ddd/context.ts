import { Constructable, Container, Token } from "typedi";
import { v4 as uuid } from "uuid";

export class Context {
  static of() {
    return new Context();
  }

  dispose() {
    this._dispose();
  }

  get<T>(type: Constructable<T> | Token<T>): T {
    return this._get(type);
  }

  set<T>(type: Constructable<T> | Token<T>, instance: T): void {
    this._set(type, instance);
  }

  has<T>(type: Constructable<T> | Token<T>): boolean {
    return this._has(type);
  }

  private _get: <T>(type: Constructable<T> | Token<T>) => T;
  private _set: <T>(type: Constructable<T> | Token<T>, instance: T) => void;
  private _has: <T>(type: Constructable<T> | Token<T>) => boolean;
  private _dispose: () => void;

  protected constructor() {
    const containerId = uuid();
    const container = Container.of(containerId);

    // @ts-expect-error 생성자로 Context 를 생성하지 못하게 protected 로 막아 두어서 타입 오류 발생.
    container.set(Context, this);

    this._dispose = () => Container.reset(containerId);

    this._get = (type) => container.get(type);
    this._set = (type, instance) => container.set(type, instance);
    this._has = (type) => container.has(type as any);
  }
}
