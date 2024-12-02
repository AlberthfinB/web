export const formatDate = (date: Date | string | number | null): string => {
  if (!date) {
    return "Tanggal tidak tersedia";
  }

  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) {
    return "Invalid date";
  }

  return parsedDate.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export const formatTime = (date: Date | string | number | null): string => {
  if (!date) {
    return "Waktu tidak tersedia";
  }

  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) {
    return "Invalid date";
  }

  return parsedDate.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};
