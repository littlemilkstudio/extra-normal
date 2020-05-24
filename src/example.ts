/**
 * const drag = controller();
 * const animate = animator();
 * const stream = stream(
 *  I(value(clamp(normal)))
 *  .I(sequence.interpolate)
 * );
 *
 * start and return stop methods
 * useEffect(() => stream.start(interpolated => {
 *  Do dom manipulations here. could also plug in an emitter if needed.
 * }), [s]);
 *
 * useEffect(() =>
 *    ['animate'].includes(current) &&
 *    animate.start(stream, {
 *      duration: sequence.duration,
 *      onAnimationComplete: () => send('animationComplete');
 *    })
 * , [animate, s]);
 *
 * useEffect(() =>
 *    ['dragging'].includes(current) &&
 *    drag.start(stream)
 * }, [drag, s]);
 *
 * useEffect(() => {
 *  const handleMouseMove = I(getCoordFromEvent)
 *    .I((coord) => drag.next(coord));
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
