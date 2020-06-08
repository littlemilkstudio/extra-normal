/**
 * const interpolator = stream(
 *  I(value(clamp(normal)))
 *  .I(sequence.interpolate)
 * );
 * const drag = controller(value(progress([0, DRAG_LENGTH])));
 * const animate = animator(progress => ({
 *  duration: progress * sequence.duration(),
 * }));
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
 *    animate(interpolator),
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
 *    .I(drag.next)
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
