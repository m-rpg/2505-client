import { Dispatch, SetStateAction, useState } from "react";
import { contrastColor } from "./color/contrastColor";
import styles from "./Game.module.css";
import { focusRef } from "./util/focusRef";
import { useAtomicState } from "./util/useAtomicState";
import { useUnmountedRef } from "./util/useUnmountedRef";

export interface GameProps {
  id: string;
  color: string;
}

type State = StateLogin | StateLoggedIn;

interface StateLogin {
  type: "login";
}

interface StateLoggedIn {
  type: "loggedIn";
  accessToken: string;
}

function Splash({ id, color }: GameProps) {
  return (
    <div className={styles["container"]}>
      {/* Game content */}
      <div className={styles["content"]} style={{ backgroundColor: color }}>
        <div className={styles["titleContainer"]}>
          <h2
            className={styles["title"]}
            style={{ color: contrastColor(color) }}
          >
            {id}
          </h2>
        </div>

        {/* Navigation bar for game instance management */}
        <div className={styles["navbar"]}>
          <div className={styles["navButton"]} />
          <div className={styles["navButtonWide"]} />
          <div className={styles["navButton"]} />
        </div>
      </div>
    </div>
  );
}

export default function Game({ id, color }: GameProps) {
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
        if (!unmountedRef.current) {
          return;
        }
        setState({
          ...state,
          type: "loggedIn",
          accessToken: data.token,
        });
        setLoading(false);
      } catch (error) {
        if (unmountedRef.current) {
          return;
        }
        alert(error);
        setLoading(false);
      }
    })();
  };

  if (loadingRef.current) {
    return <Splash id={id} color={color} />;
  }
  return (
    <div>
      <h1>Login to {id}</h1>
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
    </div>
  );
}

interface LoggedInProps extends GameProps {
  state: StateLoggedIn;
  setState: Dispatch<SetStateAction<State>>;
}

function LoggedIn({ id, color, state, setState }: LoggedInProps) {
  return <Splash id={id} color={color} />;
}
