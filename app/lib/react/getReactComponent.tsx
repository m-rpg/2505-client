import { Container, Fullscreen, Text } from "@react-three/uikit";
import { Button, Defaults, DialogAnchor } from "@react-three/uikit-default";
import { ComponentType, useEffect } from "react";
import { useWatchValue } from "../../util/useWatchValue";
import { Client } from "../client/Client";
import { ClientComponentProps } from "./ClientComponentProps";

export function getReactComponent(
  client: Client,
): ComponentType<ClientComponentProps> {
  return function ClientComponent({ setState }) {
    useEffect(
      () =>
        client.watchLoggedOut((loggedOut) => {
          if (loggedOut) {
            setState({ type: "beforeLogin" });
          }
        }),
      [],
    );

    const coins = useWatchValue(client.watchCoins);

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
              <Text fontSize={32}>Logged in as {client.id}</Text>
              <Text fontSize={32}>{coins} coins</Text>
              <Button onClick={() => setState({ type: "beforeLogin" })}>
                <Text>Logout</Text>
              </Button>
            </Container>
          </DialogAnchor>
        </Fullscreen>
      </Defaults>
    );
  };
}
