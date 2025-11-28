export function convertDateTimeToVietnam(isoString) {
  if (!isoString) return "";

  const date = new Date(isoString);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day}-${month}-${year} ${hours}:${minutes}`;
}

export function convertLikeNumber(likeCount) {
  if (likeCount < 1000) return likeCount.toString();
  if (likeCount < 1_000_000)
    return (likeCount / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  return (likeCount / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
}

const UNITS = [
  { unit: "year", seconds: 31536000 },
  { unit: "month", seconds: 2592000 },
  { unit: "week", seconds: 604800 },
  { unit: "day", seconds: 86400 },
  { unit: "hour", seconds: 3600 },
  { unit: "minute", seconds: 60 },
  { unit: "second", seconds: 1 },
];

const rtf = new Intl.RelativeTimeFormat("vi", { numeric: "auto" });

export const formatTimeAgo = (dateInput) => {
  try {
    const date = new Date(dateInput);
    const now = new Date();
    const secondsDiff = (date.getTime() - now.getTime()) / 1000;

    for (const { unit, seconds } of UNITS) {
      const value = Math.round(secondsDiff / seconds);
      if (Math.abs(value) >= 1) {
        return rtf.format(value, unit);
      }
    }
    return "vừa xong";
  } catch (error) {
    console.error("Invalid date for formatTimeAgo:", dateInput, error);
    return ""; 
  }
};

export const createContentSnippet = (htmlContent, maxLength = 150) => {
    if (!htmlContent) {
      return "";
    }
  
    const div = document.createElement("div");
    div.innerHTML = htmlContent;
    const plainText = div.textContent || div.innerText || "";
  
    if (plainText.length <= maxLength) {
      return plainText;
    }
    
    const truncated = plainText.substr(0, maxLength);
    const lastSpace = truncated.lastIndexOf(" ");
    
    if (lastSpace > 0) {
      return truncated.substr(0, lastSpace) + "...";
    }
  
    return truncated + "...";
  };