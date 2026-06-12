'use client';
import React from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1];

const PRESETS = {
  up:        { y: 28, x: 0, opacity: 0 },
  down:      { y: -28, x: 0, opacity: 0 },
  left:      { x: 28, y: 0, opacity: 0 },
  right:     { x: -28, y: 0, opacity: 0 },
  fade:      { y: 0, x: 0, opacity: 0 },
  scale:     { scale: 0.96, opacity: 0 },
  blur:      { y: 18, opacity: 0, filter: 'blur(6px)' },
};

/**
 * Reveal — fades an element in when it scrolls into view.
 * Props:
 *  - as: element tag (default 'div')
 *  - variant: 'up' | 'down' | 'left' | 'right' | 'fade' | 'scale' | 'blur'
 *  - delay: seconds to wait before animating
 *  - duration: animation length in seconds (default 0.7)
 *  - amount: viewport threshold (0..1) before triggering (default 0.15)
 *  - once: animate only the first time (default true)
 */
export function Reveal({
  as: As = 'div',
  variant = 'up',
  delay = 0,
  duration = 0.7,
  amount = 0.15,
  once = true,
  className = '',
  style,
  children,
  ...rest
}) {
  const prefersReducedMotion = useReducedMotion();
  const MotionTag = motion[As] || motion.div;

  if (prefersReducedMotion) {
    return (
      <As className={className} style={style} {...rest}>
        {children}
      </As>
    );
  }

  const hidden = PRESETS[variant] || PRESETS.up;
  const shown  = { y: 0, x: 0, opacity: 1, scale: 1, filter: 'blur(0px)' };

  return (
    <MotionTag
      initial={hidden}
      whileInView={shown}
      viewport={{ once, amount }}
      transition={{ duration, delay, ease: EASE }}
      className={className}
      style={style}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}

/**
 * RevealGroup — staggers its direct children.
 * Wrap each child in <Reveal.Item /> (or just pass plain children — they'll be
 * staggered using `staggerChildren`).
 *
 * Props:
 *  - stagger: delay between each child (default 0.08)
 *  - delay: initial delay before first child
 *  - amount: viewport threshold (default 0.15)
 *  - variant: same as Reveal (default 'up') — used by Item
 */
export function RevealGroup({
  as: As = 'div',
  stagger = 0.08,
  delay = 0,
  amount = 0.15,
  once = true,
  className = '',
  style,
  children,
  ...rest
}) {
  const prefersReducedMotion = useReducedMotion();
  const MotionTag = motion[As] || motion.div;

  if (prefersReducedMotion) {
    return (
      <As className={className} style={style} {...rest}>
        {children}
      </As>
    );
  }

  return (
    <MotionTag
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
      className={className}
      style={style}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}

/**
 * RevealGroup.Item — child of RevealGroup. Inherits stagger from parent.
 */
RevealGroup.Item = function RevealItem({
  as: As = 'div',
  variant = 'up',
  duration = 0.6,
  className = '',
  style,
  children,
  ...rest
}) {
  const prefersReducedMotion = useReducedMotion();
  const MotionTag = motion[As] || motion.div;

  if (prefersReducedMotion) {
    return (
      <As className={className} style={style} {...rest}>
        {children}
      </As>
    );
  }

  const hidden = PRESETS[variant] || PRESETS.up;
  const shown  = { y: 0, x: 0, opacity: 1, scale: 1, filter: 'blur(0px)' };

  return (
    <MotionTag
      variants={{
        hidden,
        show: { ...shown, transition: { duration, ease: EASE } },
      }}
      className={className}
      style={style}
      {...rest}
    >
      {children}
    </MotionTag>
  );
};

/**
 * Parallax — gently translates an element vertically as the user scrolls past it.
 * Best for backgrounds, hero images, decorative layers — not for clickable UI.
 *
 * Props:
 *  - amount: pixels of total movement (default 60). Positive = element moves down slower.
 *  - direction: 'up' | 'down' (default 'up')
 */
export function Parallax({
  as: As = 'div',
  amount = 60,
  direction = 'up',
  className = '',
  style,
  children,
  ...rest
}) {
  const prefersReducedMotion = useReducedMotion();
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const range = direction === 'up' ? [amount, -amount] : [-amount, amount];
  const y = useTransform(scrollYProgress, [0, 1], range);
  const MotionTag = motion[As] || motion.div;

  if (prefersReducedMotion) {
    return (
      <As ref={ref} className={className} style={style} {...rest}>
        {children}
      </As>
    );
  }

  return (
    <MotionTag ref={ref} className={className} style={{ ...style, y }} {...rest}>
      {children}
    </MotionTag>
  );
}

export default Reveal;
