import { EnhancedGameState } from "../../Game";

export interface ClientComponentProps {
  setState: (state: EnhancedGameState) => void;
}
