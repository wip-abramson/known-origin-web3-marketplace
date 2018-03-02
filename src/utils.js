const safeFromJson = (raw) => {
  try {
    return JSON.parse(raw)
  } catch (e) {
    console.warn("safe json failure", e);
    return ""
  }
};

export {
  safeFromJson
};
