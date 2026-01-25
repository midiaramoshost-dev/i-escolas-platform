import { motion, Variants, useReducedMotion } from "framer-motion";
import { ReactNode, forwardRef } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

type AnimationType = 
  | "fadeUp" 
  | "fadeDown" 
  | "fadeLeft" 
  | "fadeRight" 
  | "scaleUp" 
  | "scaleDown"
  | "rotateIn"
  | "flipX"
  | "flipY"
  | "blur"
  | "slideUp"
  | "slideDown"
  | "bounce"
  | "elastic"
  | "wave"
  | "reveal"
  | "zoom"
  | "skew";

interface ScrollRevealProps {
  children: ReactNode;
  animation?: AnimationType;
  delay?: number;
  duration?: number;
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  className?: string;
  staggerIndex?: number;
  staggerDelay?: number;
}

const animationVariants: Record<AnimationType, Variants> = {
  fadeUp: {
    hidden: { opacity: 0, y: 80 },
    visible: { opacity: 1, y: 0 },
  },
  fadeDown: {
    hidden: { opacity: 0, y: -80 },
    visible: { opacity: 1, y: 0 },
  },
  fadeLeft: {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0 },
  },
  fadeRight: {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0 },
  },
  scaleUp: {
    hidden: { opacity: 0, scale: 0.5 },
    visible: { opacity: 1, scale: 1 },
  },
  scaleDown: {
    hidden: { opacity: 0, scale: 1.5 },
    visible: { opacity: 1, scale: 1 },
  },
  rotateIn: {
    hidden: { opacity: 0, rotate: -180, scale: 0.5 },
    visible: { opacity: 1, rotate: 0, scale: 1 },
  },
  flipX: {
    hidden: { opacity: 0, rotateX: 90 },
    visible: { opacity: 1, rotateX: 0 },
  },
  flipY: {
    hidden: { opacity: 0, rotateY: 90 },
    visible: { opacity: 1, rotateY: 0 },
  },
  blur: {
    hidden: { opacity: 0, filter: "blur(20px)" },
    visible: { opacity: 1, filter: "blur(0px)" },
  },
  slideUp: {
    hidden: { opacity: 0, y: 100, clipPath: "inset(100% 0% 0% 0%)" },
    visible: { opacity: 1, y: 0, clipPath: "inset(0% 0% 0% 0%)" },
  },
  slideDown: {
    hidden: { opacity: 0, y: -100, clipPath: "inset(0% 0% 100% 0%)" },
    visible: { opacity: 1, y: 0, clipPath: "inset(0% 0% 0% 0%)" },
  },
  bounce: {
    hidden: { opacity: 0, y: 100, scale: 0.8 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
    },
  },
  elastic: {
    hidden: { opacity: 0, scale: 0, rotate: -45 },
    visible: { opacity: 1, scale: 1, rotate: 0 },
  },
  wave: {
    hidden: { opacity: 0, x: -50, skewX: -10 },
    visible: { opacity: 1, x: 0, skewX: 0 },
  },
  reveal: {
    hidden: { 
      opacity: 0, 
      clipPath: "polygon(0 0, 0 0, 0 100%, 0% 100%)" 
    },
    visible: { 
      opacity: 1, 
      clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" 
    },
  },
  zoom: {
    hidden: { opacity: 0, scale: 0, y: 50 },
    visible: { opacity: 1, scale: 1, y: 0 },
  },
  skew: {
    hidden: { opacity: 0, skewY: 10, y: 50 },
    visible: { opacity: 1, skewY: 0, y: 0 },
  },
};

const transitionPresets: Record<AnimationType, object> = {
  fadeUp: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  fadeDown: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  fadeLeft: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  fadeRight: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  scaleUp: { duration: 0.6, ease: [0.34, 1.56, 0.64, 1] },
  scaleDown: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  rotateIn: { duration: 0.8, ease: [0.34, 1.56, 0.64, 1] },
  flipX: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  flipY: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  blur: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  slideUp: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  slideDown: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  bounce: { 
    duration: 0.8, 
    type: "spring", 
    stiffness: 300, 
    damping: 15 
  },
  elastic: { 
    duration: 1.2, 
    type: "spring", 
    stiffness: 150, 
    damping: 12 
  },
  wave: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  reveal: { duration: 1, ease: [0.77, 0, 0.175, 1] },
  zoom: { 
    duration: 0.6, 
    type: "spring", 
    stiffness: 200, 
    damping: 20 
  },
  skew: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
};

export const ScrollReveal = forwardRef<HTMLDivElement, ScrollRevealProps>(
  (
    {
      children,
      animation = "fadeUp",
      delay = 0,
      duration,
      threshold = 0.1,
      rootMargin = "-50px",
      triggerOnce = true,
      className = "",
      staggerIndex = 0,
      staggerDelay = 0.1,
    },
    forwardedRef
  ) => {
    const [ref, { isVisible }] = useScrollReveal({
      threshold,
      rootMargin,
      triggerOnce,
    });

    const prefersReducedMotion = useReducedMotion();

    const totalDelay = delay + staggerIndex * staggerDelay;
    const baseTransition = transitionPresets[animation];
    const transition = {
      ...baseTransition,
      ...(duration && { duration }),
      delay: totalDelay,
    };

    // Skip animations if user prefers reduced motion
    if (prefersReducedMotion) {
      return (
        <div ref={ref} className={className}>
          {children}
        </div>
      );
    }

    return (
      <div ref={ref} className={className}>
        <motion.div
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={animationVariants[animation]}
          transition={transition}
          style={{ willChange: "transform, opacity" }}
        >
          {children}
        </motion.div>
      </div>
    );
  }
);

ScrollReveal.displayName = "ScrollReveal";

// Specialized components for common use cases
export const FadeUp = (props: Omit<ScrollRevealProps, "animation">) => (
  <ScrollReveal {...props} animation="fadeUp" />
);

export const FadeLeft = (props: Omit<ScrollRevealProps, "animation">) => (
  <ScrollReveal {...props} animation="fadeLeft" />
);

export const FadeRight = (props: Omit<ScrollRevealProps, "animation">) => (
  <ScrollReveal {...props} animation="fadeRight" />
);

export const ScaleUp = (props: Omit<ScrollRevealProps, "animation">) => (
  <ScrollReveal {...props} animation="scaleUp" />
);

export const Blur = (props: Omit<ScrollRevealProps, "animation">) => (
  <ScrollReveal {...props} animation="blur" />
);

export const SlideUp = (props: Omit<ScrollRevealProps, "animation">) => (
  <ScrollReveal {...props} animation="slideUp" />
);

export const Bounce = (props: Omit<ScrollRevealProps, "animation">) => (
  <ScrollReveal {...props} animation="bounce" />
);

export const Elastic = (props: Omit<ScrollRevealProps, "animation">) => (
  <ScrollReveal {...props} animation="elastic" />
);

export const Reveal = (props: Omit<ScrollRevealProps, "animation">) => (
  <ScrollReveal {...props} animation="reveal" />
);

// Text reveal character by character
interface TextRevealProps {
  text: string;
  className?: string;
  charDelay?: number;
  threshold?: number;
}

export const TextReveal = ({
  text,
  className = "",
  charDelay = 0.03,
  threshold = 0.1,
}: TextRevealProps) => {
  const [ref, { isVisible }] = useScrollReveal({ threshold, triggerOnce: true });

  return (
    <div ref={ref} className={className}>
      {text.split("").map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{
            duration: 0.4,
            delay: index * charDelay,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{ display: "inline-block", whiteSpace: "pre" }}
        >
          {char}
        </motion.span>
      ))}
    </div>
  );
};

// Word reveal word by word
interface WordRevealProps {
  text: string;
  className?: string;
  wordDelay?: number;
  threshold?: number;
}

export const WordReveal = ({
  text,
  className = "",
  wordDelay = 0.1,
  threshold = 0.1,
}: WordRevealProps) => {
  const [ref, { isVisible }] = useScrollReveal({ threshold, triggerOnce: true });
  const words = text.split(" ");

  return (
    <div ref={ref} className={className}>
      {words.map((word, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 30, rotateX: 45 }}
          animate={isVisible ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: 30, rotateX: 45 }}
          transition={{
            duration: 0.5,
            delay: index * wordDelay,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{ display: "inline-block", marginRight: "0.3em" }}
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
};

// Line reveal for paragraphs
interface LineRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export const LineReveal = ({ children, className = "", delay = 0 }: LineRevealProps) => {
  const [ref, { isVisible }] = useScrollReveal({ threshold: 0.1, triggerOnce: true });

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ y: "100%" }}
        animate={isVisible ? { y: 0 } : { y: "100%" }}
        transition={{
          duration: 0.8,
          delay,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};

// Staggered container for list items
interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  threshold?: number;
}

export const StaggerContainer = ({
  children,
  className = "",
  staggerDelay = 0.1,
  threshold = 0.1,
}: StaggerContainerProps) => {
  const [ref, { isVisible }] = useScrollReveal({ threshold, triggerOnce: true });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.1,
      },
    },
  };

  return (
    <motion.div
      ref={ref as any}
      className={className}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      variants={containerVariants}
    >
      {children}
    </motion.div>
  );
};

// Stagger item to be used inside StaggerContainer
interface StaggerItemProps {
  children: ReactNode;
  className?: string;
  animation?: AnimationType;
}

export const StaggerItem = ({
  children,
  className = "",
  animation = "fadeUp",
}: StaggerItemProps) => {
  return (
    <motion.div
      className={className}
      variants={animationVariants[animation]}
      transition={transitionPresets[animation]}
    >
      {children}
    </motion.div>
  );
};

// Counter animation for numbers
interface CounterProps {
  from?: number;
  to: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
  threshold?: number;
}

export const Counter = ({
  from = 0,
  to,
  duration = 2,
  suffix = "",
  prefix = "",
  className = "",
  threshold = 0.3,
}: CounterProps) => {
  const [ref, { isVisible }] = useScrollReveal({ threshold, triggerOnce: true });

  return (
    <div ref={ref} className={className}>
      <motion.span
        initial={{ opacity: 0 }}
        animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {prefix}
        <motion.span
          initial={{ opacity: 1 }}
          animate={isVisible ? { opacity: 1 } : { opacity: 1 }}
        >
          {isVisible && (
            <motion.span
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
            >
              <CounterAnimation from={from} to={to} duration={duration} />
            </motion.span>
          )}
        </motion.span>
        {suffix}
      </motion.span>
    </div>
  );
};

const CounterAnimation = ({ from, to, duration }: { from: number; to: number; duration: number }) => {
  const [count, setCount] = useState(from);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(from + (to - from) * easeOutQuart);
      
      setCount(current);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [from, to, duration]);

  return <>{count}</>;
};

// Import useState and useEffect at the top
import { useState, useEffect } from "react";
