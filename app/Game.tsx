import { Canvas } from "@react-three/fiber";
import { Container, Fullscreen, Text } from "@react-three/uikit";
import {
  Button,
  Defaults,
  DialogAnchor,
  Input,
  Separator,
} from "@react-three/uikit-default";
import { useState } from "react";
import { Client } from "./lib/client/Client";
import {
  GameStateBeforeLogin,
  GameStateLoggedIn,
  GameStateWithoutId,
} from "./lib/GameState";
import { simpleHashColor } from "./lib/simpleHashColor";
import { useAtomicState } from "./util/useAtomicState";
import { useUnmountedRef } from "./util/useUnmountedRef";

export interface EnhancedGameStateLoggedIn extends GameStateLoggedIn {
  client: Client;
}

export type EnhancedGameState =
  | GameStateBeforeLogin
  | EnhancedGameStateLoggedIn;

export interface GameProps {
  state: EnhancedGameState;
  setState: (newState: GameStateWithoutId) => void;
}

export default function Game({ state, setState }: GameProps) {
  const color = simpleHashColor(state.id); // XXX: ??

  return (
    <Canvas
      orthographic
      style={{ position: "absolute", inset: "0", touchAction: "none" }}
      gl={{ localClippingEnabled: true }}
    >
      {state.type === "beforeLogin" ? (
        <LoginScene setState={setState} id={state.id} />
      ) : (
        <state.client.reactComponent setState={setState} />
      )}
    </Canvas>
  );
}

interface LoginSceneProps {
  setState: (state: GameStateWithoutId) => void;
  id: string;
}

function LoginScene({ setState, id }: LoginSceneProps) {
  const [password, setPassword] = useState("");
  const [loadingRef, setLoading] = useAtomicState(false);
  const unmountedRef = useUnmountedRef();

  const handleLogin = () => {
    if (loadingRef.current) {
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
          },
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
          type: "loggedIn",
          token: data.token,
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
    if (loadingRef.current) {
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
          },
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

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight intensity={1} position={[-5, 5, 10]} />

      <Defaults>
        <Fullscreen
          backgroundColor="white"
          dark={{ backgroundColor: "black" }}
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          gap={32}
          padding={32}
        >
          <DialogAnchor>
            <Container
              width={300}
              flexDirection="column"
              alignItems="center"
              gap={16}
            >
              <Text fontSize={32}>Login as {id}</Text>
              <Input
                placeholder="Password"
                type="password"
                value={password}
                onValueChange={setPassword}
              />
              <Button onClick={handleLogin}>
                <Text>Login</Text>
              </Button>
              <Button onClick={handleRegister}>
                <Text>Register</Text>
              </Button>
              <Separator />
              <Text fontSize={12}>© 2025 MyGame Inc.</Text>
            </Container>
          </DialogAnchor>
        </Fullscreen>
      </Defaults>
    </>
  );
}
