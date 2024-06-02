const adminsWhiteListed = ["66586283c63551c72e37babf"];

export const isAdmin = (userId) => adminsWhiteListed.includes(String(userId));
