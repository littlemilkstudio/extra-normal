/**
 * const drag = controller();
 * const animate = animator();
 * const interpolator = stream(
 *  I(value(clamp(normal)))
 *  .I(sequence.interpolate)
 * );
 *
 * useEffect(
 *  () => interpolator.start(interpolated => {
 *    DOM manipulations here.
 *  }),
 *  [s]
 * );
 *
 * useEffect(
 *  () => ['animate'].includes(current) &&
 *    animate(interpolator, {
 *      duration: sequence.duration,
 *      onAnimationComplete: () => send('animationComplete');
 *    }),
 *  [animate, s]
 * );
 *
 * useEffect(
 *  () => ['dragging'].includes(current) &&
 *    drag(interpolator),
 *  [drag, s]
 * );
 *
 * useEffect(() => {
 *  const handleMouseMove = (
 *    I(getXFromEvent)
 *    .I(getDelta)
 *    .I(value(progress([0, DRAG_DISTANCE])))
 *    .I((normalized) => drag.next(normalized))
 *  );
 *  const handleMouseUp = () => send('dragComplete');
 *
 *  document.addEvenListener('mouseMove', handleMouseMove);
 *  document.addEvenListener('mouseUp', handleMouseMove);
 *  return () => {
 *    document.removeEvenListener('mouseMove', handleMouseMove);
 *    document.removeEvenListener('mouseup', handleMouseUp);
 *  }
 * }, )
 *
 * return (
 *   <div onMouseDown={e => send('dragStart', e.y)}>
 * );
 *
 */
