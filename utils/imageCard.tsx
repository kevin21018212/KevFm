import { motion } from "framer-motion";
import { bounceVariants } from "./animations";
import styles from "../styles/body.module.scss";
export const ImageCard: React.FC<{
  src: string;
  alt: string;
  delay: number;
}> = ({ src, alt, delay }) => (
  <div className={styles.middleStuff}>
    <div className={styles.img}>
      <motion.img
        src={src}
        alt={alt}
        variants={bounceVariants(delay)}
        initial="hidden"
        animate="visible"
        whileHover="hover"
      />
    </div>
    <motion.div className={styles.text}>
      <p>{alt}</p>
    </motion.div>
  </div>
);
