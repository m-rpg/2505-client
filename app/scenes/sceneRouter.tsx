import { Container, Fullscreen, Text } from "@react-three/uikit";
import { Button, Defaults, DialogAnchor } from "@react-three/uikit-default";
import { ComponentType, memo, useEffect } from "react";
import { GameState, GameStateLoggedIn } from "../lib/GameState";
import { SceneComponentProps } from "../SceneComponentProps";
import { useAtomicState } from "../util/useAtomicState";
import { useUnmountedRef } from "../util/useUnmountedRef";
import { loginScene } from "./loginScene";

export function sceneRouter(
  state: GameState,
): ComponentType<SceneComponentProps> {
  switch (state.type) {
    case "beforeLogin":
      return loginScene(state.id);
    case "loggedIn":
      return memo((props) => <LoggedIn {...props} {...state} />);
  }
}

interface LoggedInProps extends SceneComponentProps, GameStateLoggedIn {}

function LoggedIn({ setScene, setState, id, accessToken }: LoggedInProps) {
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

  return (
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
            <Text fontSize={32}>Logged in as {id}</Text>
            <Button
              onClick={() => {
                setState({ type: "beforeLogin" });
                setScene(loginScene(id));
              }}
            >
              <Text>Logout</Text>
            </Button>
          </Container>
        </DialogAnchor>
      </Fullscreen>
    </Defaults>
  );
}
