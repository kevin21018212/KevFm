import { Variants } from "framer-motion";

// Container variant with staggered children animations
export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
};

// Text animations for h2 and h1
export const textVariants: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 100, delay: 0.5 },
  },
};

export const h1Variants: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 100, delay: 1 },
  },
};

// Bounce animations for image stack items with delay
export const bounceVariants: (delay: number) => Variants = (delay) => ({
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
      delay,
    },
  },
  hover: { scale: 1.1 },
});

export const imageHoverVariants: Variants = {};

export const textSlideInVariants: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 100, delay: 0.5 },
  },
};

// Cool animation for the link or box
export const linkVariants: Variants = {
  hover: {
    scale: 1.1,
    rotate: 5,
    transition: { yoyo: Infinity, duration: 0.3 },
  },
};

// Fade in and out variants for other elements
export const fadeInOutVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5 } },
  exit: { opacity: 0, transition: { duration: 0.5 } },
};

// Image animations
export const imageVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

// Track animations
export const trackVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } },
};
// Slide down animation for the entire image stack
export const slideDownVariants = {
  hidden: { opacity: 0, y: -30 }, // Smaller value to slide in less far
  visible: {
    opacity: 1,
    y: 0,
    
    transition: {
      type: "spring",
      stiffness: 100,
      when: "beforeChildren", // Ensure children animate after parent
      staggerChildren: 0.2, // Stagger animation for children
    },
  },
};
