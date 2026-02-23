const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function retry(fn, attempts = 3) {
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === attempts - 1) throw err;
      await wait(50 * Math.pow(2, i));
    }
  }
}

module.exports = retry;