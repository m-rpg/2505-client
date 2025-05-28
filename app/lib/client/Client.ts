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

  public readonly watchCoins: Watch<number>;
  private readonly _setCoins: Change<number>;
  private readonly _getCoins: WatchGet<number>;

  public readonly watchDailyRewardAvailability: Watch<boolean | undefined>;
  private readonly _setDailyRewardAvailability: Change<boolean | undefined>;
  private readonly _getDailyRewardAvailability: WatchGet<boolean | undefined>;

  private readonly pendingJobs: Promise<unknown>[];

  constructor(
    public readonly id: string,
    private readonly token: string,
  ) {
    [this.watchLoggedOut, this._setLoggedOut, this._getLoggedOut] =
      watchTarget(false);
    [this.watchCoins, this._setCoins, this._getCoins] = watchTarget(0);
    [
      this.watchDailyRewardAvailability,
      this._setDailyRewardAvailability,
      this._getDailyRewardAvailability,
    ] = watchTarget<boolean | undefined>(undefined);

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
      this.logout();
      return { ok: false, error: 401 };
    }

    return { ok: true, value: await response.json() };
  }

  private async init() {
    return Promise.all([
      this.run(async () => {
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

        this._setCoins(result.value.user.coins);
      }),
      this.run(async () => {
        const result = await this.fetchJson<{
          can_claim: boolean;
          next_reward: string;
          streak: number;
        }>("GET", "daily-reward");
        if (!result.ok) {
          return;
        }

        this._setDailyRewardAvailability(result.value.can_claim);
      }),
    ]);
  }

  get loggedOut() {
    return this._getLoggedOut();
  }

  logout() {
    this._setLoggedOut(true);
  }

  get coins() {
    return this._getCoins();
  }

  get dailyRewardAvailability() {
    return this._getDailyRewardAvailability();
  }

  async claimDailyReward() {
    if (!this.dailyRewardAvailability) {
      return;
    }

    this._setDailyRewardAvailability(undefined);
    return this.run(async () => {
      const result = await this.fetchJson<{
        message: string;
        reward: {
          base_reward: number;
          streak_bonus: number;
          total_reward: number;
          new_balance: number;
          new_streak: number;
          next_reward: string;
        };
      }>("POST", "daily-reward/claim");
      if (!result.ok) {
        return;
      }

      this._setDailyRewardAvailability(false);
      this._setCoins(result.value.reward.new_balance);
    });
  }
}
