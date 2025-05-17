import { contrastColor } from "./color/contrastColor";
import styles from "./Game.module.css";

export interface GameProps {
  id: string;
  color: string;
}

export default function Game({ id, color }: GameProps) {
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
          <button className={styles["navButton"]}></button>
          <button className={styles["navButtonWide"]}></button>
          <button className={styles["navButton"]}></button>
        </div>
      </div>
    </div>
  );
}
