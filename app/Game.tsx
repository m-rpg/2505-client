import { ComponentType, useEffect, useRef } from "react";
import styles from "./Game.module.css";
import { contrastColor } from "./lib/color/contrastColor";
import { GameState, GameStateWithoutId } from "./lib/GameState";
import { simpleHashColor } from "./lib/simpleHashColor";
import { SceneComponentProps } from "./SceneComponentProps";
import { loginScene } from "./scenes/loginScene";
import { useAtomicState } from "./util/useAtomicState";
import { useUnmountedRef } from "./util/useUnmountedRef";

export interface GameProps {
  state: GameState;
  setState: (newState: GameStateWithoutId) => void;
}

interface SplashProps {
  id: string;
  color: string;
}

function Splash({ id, color }: SplashProps) {
  return (
    <div className={styles["container"]}>
      <div className={styles["content"]} style={{ backgroundColor: color }}>
        <div className={styles["titleContainer"]}>
          <div
            className={styles["title"]}
            style={{ color: contrastColor(color) }}
          >
            {id}
          </div>
        </div>

        <div className={styles["navbar"]}>
          <div className={styles["navButton"]} />
          <div className={styles["navButtonWide"]} />
          <div className={styles["navButton"]} />
        </div>
      </div>
    </div>
  );
}

export default function Game({ state, setState }: GameProps) {
  const color = simpleHashColor(state.id);

  switch (state.type) {
    case "beforeLogin":
      return <Login id={state.id} color={color} setState={setState} />;
    case "loggedIn":
      return (
        <LoggedIn
          id={state.id}
          color={color}
          accessToken={state.accessToken}
          setState={setState}
        />
      );
  }
}

interface LoginProps {
  id: string;
  color: string;
  setState: (newState: GameStateWithoutId) => void;
}

function Login({ id, color, setState }: LoginProps) {
  const ref = useRef<ComponentType<SceneComponentProps> | null>(null);
  if (ref.current === null) {
    ref.current = loginScene(id);
  }
  return <ref.current setState={setState} />;
}

interface LoggedInProps {
  id: string;
  color: string;
  accessToken: string;
  setState: (newState: GameStateWithoutId) => void;
}

function LoggedIn({ id, color, accessToken, setState }: LoggedInProps) {
  const [loadingRef, setLoading] = useAtomicState(false);
  const unmountedRef = useUnmountedRef();

  useEffect(() => {
    if (loadingRef.current) {
      return;
    }
    setLoading(true);

    (async () => {
      try {
        const response1 = await fetch(
          `${process.env["NEXT_PUBLIC_SERVER_URL"]}/api/daily-reward`,
          {
            method: "GET",
            headers: {
              Authorization: `${accessToken}`,
            },
          },
        );
        if (!response1.ok) {
          if (!unmountedRef.current) {
            setLoading(false);
          }
          return;
        }
        interface Data1 {
          can_claim: boolean;
          next_reward: string;
          streak: number;
        }
        const data1: Data1 = await response1.json();
        if (data1.can_claim) {
          const response2 = await fetch(
            `${process.env["NEXT_PUBLIC_SERVER_URL"]}/api/daily-reward/claim`,
            {
              method: "POST",
              headers: {
                Authorization: `${accessToken}`,
              },
            },
          );
          if (!response2.ok) {
            if (!unmountedRef.current) {
              setLoading(false);
            }
            alert("Failed to claim daily reward");
            return;
          }
          interface Data2 {
            message: string;
            reward: {
              base_reward: number;
              streak_bonus: number;
              total_reward: number;
              new_balance: number;
              new_streak: number;
              next_reward: string;
            };
          }
          const data2: Data2 = await response2.json();
          alert(`New balance is: ${data2.reward.new_balance}`);
          if (!unmountedRef.current) {
            setLoading(false);
          }
        }
      } catch (error) {
        if (!unmountedRef.current) {
          setLoading(false);
        }
        alert(error);
      }
    })();
  }, []);

  return <Splash id={id} color={color} />;
}
