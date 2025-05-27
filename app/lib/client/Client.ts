import { ComponentType } from "react";
import { Result } from "../../util/Result";
import { Change, Watch, WatchGet, watchTarget } from "../../util/watchTarget";
import { ClientComponentProps } from "../react/ClientComponentProps";
import { getReactComponent } from "../react/getReactComponent";

export class Client {
  public readonly reactComponent: ComponentType<ClientComponentProps>;

  public readonly watchLoggedOut: Watch<boolean>;
  private readonly _setLoggedOut: Change<boolean>;
  private readonly _getLoggedOut: WatchGet<boolean>;

  public readonly watchPoint: Watch<number>;
  private readonly _setPoint: Change<number>;
  private readonly _getPoint: WatchGet<number>;

  private readonly pendingJobs: Promise<unknown>[];

  constructor(
    public readonly id: string,
    private readonly token: string,
  ) {
    [this.watchLoggedOut, this._setLoggedOut, this._getLoggedOut] =
      watchTarget(false);
    [this.watchPoint, this._setPoint, this._getPoint] = watchTarget(0);

    this.pendingJobs = [];

    this.init();

    this.reactComponent = getReactComponent(this);
  }

  private async run<T>(job: () => Promise<T>): Promise<T> {
    const lastPendingJob = this.pendingJobs[this.pendingJobs.length - 1];
    const result = (async () => {
      await lastPendingJob;
      return await job();
    })();
    this.pendingJobs.push(result);

    return await result;
  }

  private async fetchJson<T>(
    method: "GET",
    path: string,
  ): Promise<Result<T, 401>>;
  private async fetchJson<T>(
    method: "POST" | "PUT" | "PATCH" | "DELETE",
    path: string,
    body?: unknown,
  ): Promise<Result<T, 401>>;
  private async fetchJson<T>(
    method: string,
    path: string,
    body?: unknown,
  ): Promise<Result<T, 401>> {
    if (this.loggedOut) {
      return { ok: false, error: 401 };
    }

    const response = await fetch(
      `${process.env["NEXT_PUBLIC_SERVER_URL"]}/api/${path}`,
      {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: this.token,
        },
        body: body ? JSON.stringify(body) : undefined,
      },
    );

    if (response.status === 401) {
      this._setLoggedOut(true);
      return { ok: false, error: 401 };
    }

    return { ok: true, value: await response.json() };
  }

  async init() {
    return await this.run(async () => {
      const result = await this.fetchJson<{
        user: {
          id: string;
          username: string;
          coins: number;
          reward_streak: number;
          last_reward: string;
        };
      }>("GET", "profile");
      if (!result.ok) {
        return;
      }

      this._setPoint(result.value.user.coins);
    });
  }

  get loggedOut() {
    return this._getLoggedOut();
  }

  get point() {
    return this._getPoint();
  }
}
