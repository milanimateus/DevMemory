const KEYS = {
  PLAYER: "devmemory_player",
  DIFFICULTY: "devmemory_difficulty",
  RANKING: "devmemory_ranking",
};

export const storage = {
  saveSession(name, difficulty) {
    localStorage.setItem(KEYS.PLAYER, name);
    localStorage.setItem(KEYS.DIFFICULTY, difficulty);
  },

  getSession() {
    return {
      playerName: localStorage.getItem(KEYS.PLAYER),
      difficulty: localStorage.getItem(KEYS.DIFFICULTY),
    };
  },

  getRanking() {
    return JSON.parse(localStorage.getItem(KEYS.RANKING)) || [];
  },

  saveScore(newRecord) {
    const rankingDB = this.getRanking();

    // Regra de negócio isolada aqui dentro
    const existingIndex = rankingDB.findIndex(
      (record) =>
        record.level === newRecord.level &&
        record.name.toLowerCase() === newRecord.name.trim().toLowerCase(),
    );

    if (existingIndex !== -1) {
      if (newRecord.timeSeconds < rankingDB[existingIndex].timeSeconds) {
        rankingDB[existingIndex] = newRecord;
      }
    } else {
      rankingDB.push(newRecord);
    }

    localStorage.setItem(KEYS.RANKING, JSON.stringify(rankingDB));
  },

  clearRanking() {
    localStorage.removeItem(KEYS.RANKING);
  },
};
