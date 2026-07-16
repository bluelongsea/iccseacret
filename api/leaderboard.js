const storageKey = 'sea-cret-guard-users';
const sectorIds = ['east', 'west', 'south', 'jeju', 'central'];

function getRedisConfig() {
  return {
    url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN,
  };
}

async function redis(command) {
  const { url, token } = getRedisConfig();
  if (!url || !token) {
    const error = new Error('공용 랭킹 저장소가 아직 연결되지 않았습니다.');
    error.statusCode = 503;
    throw error;
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(command),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.error) {
    const error = new Error(data.error || '공용 랭킹 저장소 응답을 확인할 수 없습니다.');
    error.statusCode = 502;
    throw error;
  }
  return data.result;
}

function safeAccount(account) {
  return {
    name: String(account.name || '').slice(0, 24),
    completed: Array.isArray(account.completed) ? account.completed.filter((id) => sectorIds.includes(id)) : [],
  };
}

function calculatePoints(completed = []) {
  const baseCount = ['east', 'west', 'south', 'jeju'].filter((id) => completed.includes(id)).length;
  return baseCount * 500 + (completed.includes('central') ? 2000 : 0);
}

function publicRows(accounts = []) {
  return accounts
    .map((account) => {
      const safe = safeAccount(account);
      return {
        ...safe,
        missionCount: safe.completed.length,
        points: calculatePoints(safe.completed),
      };
    })
    .sort((a, b) => b.points - a.points || b.missionCount - a.missionCount || a.name.localeCompare(b.name, 'ko'));
}

async function readAccounts() {
  const raw = await redis(['GET', storageKey]);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeAccounts(accounts) {
  await redis(['SET', storageKey, JSON.stringify(accounts)]);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', reject);
  });
}

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  try {
    if (req.method === 'GET') {
      const accounts = await readAccounts();
      res.status(200).json({ rows: publicRows(accounts), participants: accounts.length });
      return;
    }

    if (req.method !== 'POST') {
      res.status(405).json({ error: '지원하지 않는 요청입니다.' });
      return;
    }

    const body = await readBody(req);
    const action = body.action;
    const name = String(body.name || '').trim().slice(0, 24);
    const password = String(body.password || '').trim();
    const completed = Array.isArray(body.completed) ? body.completed.filter((id) => sectorIds.includes(id)) : [];
    const accounts = await readAccounts();
    const index = accounts.findIndex((account) => account.name === name);

    if (!name) {
      res.status(400).json({ error: '요원명이 필요합니다.' });
      return;
    }

    if (action === 'join') {
      if (!password) {
        res.status(400).json({ error: '비밀번호가 필요합니다.' });
        return;
      }
      if (index >= 0) {
        res.status(409).json({ error: '이미 등록된 요원명입니다.' });
        return;
      }
      accounts.push({ name, password, completed: [] });
      await writeAccounts(accounts);
      res.status(200).json({ account: { name, completed: [] }, rows: publicRows(accounts) });
      return;
    }

    if (action === 'login') {
      if (index < 0 || accounts[index].password !== password) {
        res.status(401).json({ error: '가입된 요원명과 비밀번호를 확인해주세요.' });
        return;
      }
      res.status(200).json({ account: safeAccount(accounts[index]), rows: publicRows(accounts) });
      return;
    }

    if (action === 'progress') {
      if (index < 0) {
        accounts.push({ name, password: '', completed });
      } else {
        accounts[index] = {
          ...accounts[index],
          completed: Array.from(new Set([...(accounts[index].completed || []), ...completed])),
        };
      }
      await writeAccounts(accounts);
      res.status(200).json({ account: safeAccount(accounts.find((account) => account.name === name)), rows: publicRows(accounts) });
      return;
    }

    res.status(400).json({ error: '요청 종류를 확인해주세요.' });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message || '공용 랭킹 처리 중 오류가 발생했습니다.' });
  }
}
