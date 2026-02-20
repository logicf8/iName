export function addDisplayTxt(
  arr,
  {
    text,
    level = "info", // info | warning | error
    emoji,
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
    text: text.trim(),
    level,
    emoji: emoji ?? levelEmojiMap[level],
    message
  });
}

