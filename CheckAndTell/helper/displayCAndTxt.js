export function addCATtxt(
  arr,
  {
    title,
    text,
    level = "info", // info | warning | error
    emoji,
    pic,
    result,
    rows,
    message
  }
) {
  if (!text) return;

  const levelEmojiMap = {
    warning: "🚨",
    expired: "🔔",
    info: ""
   };

  arr.push({
    title: title.trim(),
    text: text.trim(),
    level,
    emoji: emoji ?? levelEmojiMap[level],
    pic,
    result,
    rows,
    message
  });
}

