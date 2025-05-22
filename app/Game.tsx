import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { contrastColor } from "./color/contrastColor";
import styles from "./Game.module.css";
import { simpleHashColor } from "./simpleHashColor";
import { focusRef } from "./util/focusRef";
import { useAtomicState } from "./util/useAtomicState";
import { useUnmountedRef } from "./util/useUnmountedRef";

export interface GameProps {
  id: string;
}

type State = StateLogin | StateLoggedIn;

interface StateLogin {
  type: "login";
}

interface StateLoggedIn {
  type: "loggedIn";
  accessToken: string;
}

interface SplashProps extends GameProps {
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

export default function Game({ id }: GameProps) {
  const color = simpleHashColor(id);

  const [state, setState] = useState<State>({
    type: "login",
  });

  switch (state.type) {
    case "login":
      return <Login id={id} color={color} state={state} setState={setState} />;
    case "loggedIn":
      return (
        <LoggedIn id={id} color={color} state={state} setState={setState} />
      );
  }
}

interface LoginProps extends GameProps {
  color: string;
  state: StateLogin;
  setState: Dispatch<SetStateAction<State>>;
}

function Login({ id, color, state, setState }: LoginProps) {
  const [password, setPassword] = useState("");
  const [loadingRef, setLoading] = useAtomicState(false);
  const unmountedRef = useUnmountedRef();

  const handleLogin = () => {
    if (state.type !== "login" || loadingRef.current) {
      return;
    }
    setLoading(true);

    (async () => {
      try {
        const response = await fetch(
          `${process.env["NEXT_PUBLIC_SERVER_URL"]}/api/auth/login`,
          {
            method: "POST",
            body: JSON.stringify({ username: id, password }),
          }
        );
        if (!response.ok) {
          alert("Failed to login");
          setLoading(false);
          return;
        }
        const data = await response.json();
        if (unmountedRef.current) {
          return;
        }
        setState({
          ...state,
          type: "loggedIn",
          accessToken: data.token,
        });
        setLoading(false);
      } catch (error) {
        if (!unmountedRef.current) {
          setLoading(false);
        }
        alert(error);
      }
    })();
  };

  const handleRegister = () => {
    if (state.type !== "login" || loadingRef.current) {
      return;
    }
    setLoading(true);

    (async () => {
      try {
        const response = await fetch(
          `${process.env["NEXT_PUBLIC_SERVER_URL"]}/api/auth/register`,
          {
            method: "POST",
            body: JSON.stringify({ username: id, password }),
          }
        );
        if (!response.ok) {
          alert("Failed to register");
          setLoading(false);
          return;
        }
        setLoading(false);
        handleLogin();
      } catch (error) {
        if (!unmountedRef.current) {
          setLoading(false);
        }
        alert(error);
      }
    })();
  };

  if (loadingRef.current) {
    return <Splash id={id} color={color} />;
  }
  return (
    <div className={styles["container"]} style={{ backgroundColor: color }}>
      <div className={styles["content"]} style={{ backgroundColor: color }}>
        <div className={styles["titleContainer"]}>
          <div
            className={styles["title"]}
            style={{ color: contrastColor(color) }}
          >
            Login to {id}
          </div>
        </div>

        <div className={styles["titleContainer"]}>
          <input
            ref={focusRef}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleLogin();
              }
            }}
          />
          <button onClick={handleLogin}>Login</button>
          <button onClick={handleRegister}>Register</button>
        </div>

        <div className={styles["titleContainer"]} style={{ flex: 0.5 }} />

        <div className={styles["navbar"]}>
          <div className={styles["navButton"]} />
          <div className={styles["navButtonWide"]} />
          <div className={styles["navButton"]} />
        </div>
      </div>
    </div>
  );
}

interface LoggedInProps extends GameProps {
  color: string;
  state: StateLoggedIn;
  setState: Dispatch<SetStateAction<State>>;
}

function LoggedIn({ id, color, state, setState }: LoggedInProps) {
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
              Authorization: `${state.accessToken}`,
            },
          }
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
                Authorization: `${state.accessToken}`,
              },
            }
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
