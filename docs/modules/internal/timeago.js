//////////////////////////
// FORMAT TIMEAGOS

/** Gets text in any .timeago class spans and converts to human readblae format.
 *  Uses moment.js imported on window
 */

const times = document.querySelectorAll(".timeago");
for (let i = 0; i < times.length; i++) {
  const t = times[i];
  const formatted = moment(t.innerText).fromNow();
  t.innerText = formatted;
}
