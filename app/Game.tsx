import styles from "./Game.module.css";

interface GameProps {
  title: string;
  color: string;
}

export default function Game({ title, color }: GameProps) {
  return (
    <div className={styles["container"]}>
      {/* Game content */}
      <div className={styles["content"]} style={{ backgroundColor: color }}>
        <div className={styles["titleContainer"]}>
          <h2 className={styles["title"]}>{title}</h2>
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
