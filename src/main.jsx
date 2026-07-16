import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Anchor,
  Bell,
  Camera,
  Eye,
  EyeOff,
  MapPin,
  Home,
  KeyRound,
  Navigation,
  RotateCcw,
  ShipWheel,
  Trophy,
  UserRound,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import './styles.css';

const sectors = [
  {
    id: 'east',
    label: '동해',
    office: '동해지방청',
    title: '소금빵 튕기기 작전',
    mission: '소금빵 튕기기',
    description: '선박을 손가락으로 움직여 내려오는 소금빵을 튕기세요. 1번만 튕겨도 배지가 지급됩니다.',
    color: '#f05a28',
    asset: '/assets/east.png',
    position: 'card-east',
    number: 1,
  },
  {
    id: 'west',
    label: '서해',
    office: '서해지방청',
    title: '서해 틀린그림 찾기',
    mission: '틀린 그림 찾기',
    description: '양쪽 캐릭터를 비교해 오른쪽에만 다른 3곳을 10초 안에 찾으세요.',
    color: '#1d4f9a',
    asset: '/assets/west.png',
    position: 'card-west',
    number: 2,
  },
  {
    id: 'south',
    label: '남해',
    office: '남해지방청',
    title: '아치 퍼즐 정렬',
    mission: '퍼즐 맞추기',
    description: '보이는 9조각을 끌어다가 3x3 칸에 맞추세요.',
    color: '#f59e0b',
    asset: '/assets/south.png',
    position: 'card-south',
    number: 3,
  },
  {
    id: 'jeju',
    label: '제주',
    office: '제주지방청',
    title: '오염물 바구니 회수',
    mission: '낙하물 받기',
    description: '오염물 10개를 받아 100점을 채우세요. 생수병과 네잎클로버는 0점입니다.',
    color: '#16a085',
    asset: '/assets/jeju.png',
    position: 'card-jeju',
    number: 4,
  },
];

const finalSector = {
  id: 'central',
  label: '중부',
  office: '중부지방청',
  title: 'SEA-CRET GUARD 전직',
  mission: 'OX 최종관문',
  description: '시크릿가드가 되기 위한 최종관문! OX 퀴즈 3문제 중 2문제를 맞히세요.',
  color: '#0ea5e9',
  asset: '/assets/central.png',
  position: 'card-central',
  number: 5,
};

const allSectors = [...sectors, finalSector];
const accountsKey = 'sea-cret-guard-accounts';
const sessionKey = 'sea-cret-guard-user';
const recordKey = 'sea-cret-guard-game-record';
const publicUrl = 'https://iccsecretguard.vercel.app';
const participantGoal = 100;
const coastGuardStations = [
  { name: '인천해양경찰서', region: '중부', lat: 37.4563, lng: 126.7052, address: '인천광역시 연수구 해돋이로 일대' },
  { name: '평택해양경찰서', region: '중부', lat: 36.9807, lng: 126.8452, address: '경기도 평택시 포승읍 평택항 일대' },
  { name: '태안해양경찰서', region: '중부', lat: 36.7456, lng: 126.2980, address: '충청남도 태안군 태안읍 일대' },
  { name: '보령해양경찰서', region: '중부', lat: 36.3334, lng: 126.6128, address: '충청남도 보령시 대천항 일대' },
  { name: '군산해양경찰서', region: '서해', lat: 35.9677, lng: 126.7366, address: '전북특별자치도 군산시 군산항 일대' },
  { name: '부안해양경찰서', region: '서해', lat: 35.7280, lng: 126.7336, address: '전북특별자치도 부안군 부안읍 일대' },
  { name: '목포해양경찰서', region: '서해', lat: 34.8118, lng: 126.3922, address: '전라남도 목포시 목포항 일대' },
  { name: '완도해양경찰서', region: '서해', lat: 34.3110, lng: 126.7551, address: '전라남도 완도군 완도읍 일대' },
  { name: '여수해양경찰서', region: '서해', lat: 34.7604, lng: 127.6622, address: '전라남도 여수시 여수항 일대' },
  { name: '부산해양경찰서', region: '남해', lat: 35.0968, lng: 129.0403, address: '부산광역시 영도구 부산항 일대' },
  { name: '울산해양경찰서', region: '남해', lat: 35.5384, lng: 129.3114, address: '울산광역시 남구 울산항 일대' },
  { name: '창원해양경찰서', region: '남해', lat: 35.1496, lng: 128.6597, address: '경상남도 창원시 진해항 일대' },
  { name: '통영해양경찰서', region: '남해', lat: 34.8544, lng: 128.4332, address: '경상남도 통영시 통영항 일대' },
  { name: '사천해양경찰서', region: '남해', lat: 34.9347, lng: 128.0691, address: '경상남도 사천시 삼천포항 일대' },
  { name: '포항해양경찰서', region: '동해', lat: 36.0190, lng: 129.3435, address: '경상북도 포항시 포항항 일대' },
  { name: '울진해양경찰서', region: '동해', lat: 36.9931, lng: 129.4006, address: '경상북도 울진군 후포항 일대' },
  { name: '동해해양경찰서', region: '동해', lat: 37.5247, lng: 129.1143, address: '강원특별자치도 동해시 묵호항 일대' },
  { name: '속초해양경찰서', region: '동해', lat: 38.2070, lng: 128.5918, address: '강원특별자치도 속초시 속초항 일대' },
  { name: '제주해양경찰서', region: '제주', lat: 33.5141, lng: 126.5297, address: '제주특별자치도 제주시 제주항 일대' },
  { name: '서귀포해양경찰서', region: '제주', lat: 33.2539, lng: 126.5618, address: '제주특별자치도 서귀포시 서귀포항 일대' },
];

function calculatePoints(completedMissions = [], saltScore = 0) {
  const completedBaseCount = sectors.filter((sector) => completedMissions.includes(sector.id)).length;
  return completedBaseCount * 500 + (completedMissions.includes('central') ? 2000 : 0) + Number(saltScore || 0);
}

function readJson(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key) || 'null') ?? fallback;
  } catch {
    return fallback;
  }
}

function saveJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function buildPublicRanking(accounts = [], currentUser, currentCompleted = []) {
  return accounts
    .map((account) => {
      const missions = account.name === currentUser ? currentCompleted : Array.isArray(account.completed) ? account.completed : [];
      const saltScore = Number(account.saltScore || 0);
      return {
        name: account.name,
        points: calculatePoints(missions, saltScore),
        saltScore,
        missionCount: missions.length,
        completed: missions,
        current: account.name === currentUser,
      };
    })
    .sort((a, b) => b.points - a.points || b.missionCount - a.missionCount || a.name.localeCompare(b.name, 'ko'));
}

async function requestLeaderboard(action, payload = {}) {
  const response = await fetch('/api/leaderboard', {
    method: action === 'list' ? 'GET' : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: action === 'list' ? undefined : JSON.stringify({ action, ...payload }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.error) {
    throw new Error(data.error || '공용 랭킹 서버에 연결할 수 없습니다.');
  }
  return data;
}

function getQrSectorId() {
  const params = new URLSearchParams(window.location.search);
  return params.get('sector') || params.get('mission');
}

function getDistanceKm(from, to) {
  const earthRadius = 6371;
  const toRad = (value) => (value * Math.PI) / 180;
  const dLat = toRad(to.lat - from.lat);
  const dLng = toRad(to.lng - from.lng);
  const lat1 = toRad(from.lat);
  const lat2 = toRad(to.lat);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return earthRadius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function getNearestStation(position) {
  return coastGuardStations
    .map((station) => ({ ...station, distance: getDistanceKm(position, station) }))
    .sort((a, b) => a.distance - b.distance)[0];
}

function App() {
  const qrSectorId = getQrSectorId();
  const savedUser = sessionStorage.getItem(sessionKey);
  const savedCompleted = readJson(recordKey, []);
  const qrSector = allSectors.find((sector) => sector.id === qrSectorId);
  const finalUnlocked = sectors.every((sector) => savedCompleted.includes(sector.id));

  const [user, setUser] = useState(savedUser || null);
  const [authTab, setAuthTab] = useState('login');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authMessage, setAuthMessage] = useState('');
  const [screen, setScreen] = useState(savedUser && qrSector ? 'game' : 'map');
  const [activeSector, setActiveSector] = useState(qrSector && (qrSector.id !== 'central' || finalUnlocked) ? qrSector : sectors[0]);
  const [clearedSector, setClearedSector] = useState(null);
  const [completed, setCompleted] = useState(savedCompleted);
  const [saltScore, setSaltScore] = useState(() => {
    const accounts = readJson(accountsKey, []);
    const account = accounts.find((item) => item.name === savedUser);
    return Number(account?.saltScore || 0);
  });
  const [notice, setNotice] = useState(qrSector ? `${qrSector.office} QR로 접속했습니다.` : '');
  const [remoteRows, setRemoteRows] = useState([]);
  const [remoteError, setRemoteError] = useState('');
  const [showIntro, setShowIntro] = useState(() => !sessionStorage.getItem('sea-cret-intro-seen'));

  useEffect(() => {
    if (!showIntro) return undefined;
    const timer = setTimeout(() => {
      sessionStorage.setItem('sea-cret-intro-seen', '1');
      setShowIntro(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, [showIntro]);

  const refreshLeaderboard = async () => {
    try {
      const data = await requestLeaderboard('list');
      setRemoteRows(Array.isArray(data.rows) ? data.rows : []);
      setRemoteError('');
    } catch (error) {
      setRemoteRows([]);
      setRemoteError(error.message || '공용 랭킹 저장소 연결이 필요합니다.');
    }
  };

  useEffect(() => {
    refreshLeaderboard();
  }, []);

  useEffect(() => {
    saveJson(recordKey, completed);
    if (!user) return;
    const accounts = readJson(accountsKey, []);
    saveJson(accountsKey, accounts.map((account) => (
      account.name === user ? { ...account, completed, saltScore: Math.max(Number(account.saltScore || 0), saltScore) } : account
    )));
    requestLeaderboard('progress', { name: user, completed, saltScore })
      .then(refreshLeaderboard)
      .catch((error) => setRemoteError(error.message || '공용 랭킹 저장소 연결이 필요합니다.'));
  }, [completed, saltScore, user]);

  useEffect(() => {
    if (!notice) return undefined;
    const timer = setTimeout(() => setNotice(''), 1000);
    return () => clearTimeout(timer);
  }, [notice]);

  useEffect(() => {
    if (!user || !qrSector) return;
    if (qrSector.id === 'central' && !sectors.every((sector) => completed.includes(sector.id))) {
      setNotice('중부 최종장은 동해, 서해, 남해, 제주 4곳을 먼저 완료해야 열립니다.');
      setScreen('map');
      return;
    }
    setActiveSector(qrSector);
    setScreen('game');
  }, [user]);

  const completedBaseCount = sectors.filter((sector) => completed.includes(sector.id)).length;
  const totalPoints = calculatePoints(completed, saltScore);
  const registeredUsers = readJson(accountsKey, []);
  const participants = Math.max(remoteRows.length, registeredUsers.length, user ? 1 : 0);
  const participation = Math.min(100, (participants / participantGoal) * 100);

  const handleAuth = async () => {
    const inputName = name.trim();
    const inputPassword = password.trim();
    if (!inputName || !inputPassword) {
      setAuthMessage('요원명과 비밀번호를 모두 입력해주세요.');
      return;
    }
    const accounts = readJson(accountsKey, []);
    const account = accounts.find((item) => item.name === inputName);
    if (authTab === 'join') {
      if (account) {
        setAuthMessage('이미 등록된 요원명입니다.');
        return;
      }
      let joinRemoteError = '';
      try {
        await requestLeaderboard('join', { name: inputName, password: inputPassword });
        await refreshLeaderboard();
      } catch (error) {
        joinRemoteError = error.message || '공용 랭킹 저장소 연결이 필요합니다.';
        setRemoteError(joinRemoteError);
      }
      saveJson(accountsKey, [...accounts, { name: inputName, password: inputPassword, completed: [], saltScore: 0 }]);
      setAuthTab('login');
      setName('');
      setPassword('');
      setAuthMessage(joinRemoteError ? '회원가입 완료! 공용 랭킹 저장소가 연결되면 전체 랭킹에 반영됩니다.' : '회원가입 완료! 로그인해주세요.');
      return;
    }

    let loginAccount = account;
    try {
      const data = await requestLeaderboard('login', { name: inputName, password: inputPassword });
      loginAccount = data.account;
      await refreshLeaderboard();
    } catch (error) {
      setRemoteError(error.message || '공용 랭킹 저장소 연결이 필요합니다.');
    }

    if (!loginAccount || loginAccount.password && loginAccount.password !== inputPassword) {
      setAuthMessage('가입된 요원명과 비밀번호를 확인해주세요.');
      return;
    }
    if (!account) {
      saveJson(accountsKey, [...accounts, { name: inputName, password: inputPassword, completed: loginAccount.completed || [], saltScore: Number(loginAccount.saltScore || 0) }]);
    }
    sessionStorage.setItem(sessionKey, inputName);
    setUser(inputName);
    setCompleted(Array.isArray(loginAccount.completed) ? loginAccount.completed : []);
    setSaltScore(Number(loginAccount.saltScore || 0));
    setName('');
    setPassword('');
    setScreen(qrSector ? 'game' : 'map');
  };

  const startMission = (sector) => {
    if (sector.id === 'central' && !sectors.every((item) => completed.includes(item.id))) {
      setNotice('중부 최종장은 동해, 서해, 남해, 제주 4곳을 모두 완수해야 열립니다.');
      return;
    }
    setActiveSector(sector);
    setScreen('game');
  };

  const completeMission = (sectorId, result = {}) => {
    if (sectorId === 'east') {
      setSaltScore((current) => Math.max(current, Number(result.saltScore || 0)));
    }
    setCompleted((current) => Array.from(new Set([...current, sectorId])));
    const sector = allSectors.find((item) => item.id === sectorId);
    setNotice(`${sector?.office || '미션'} 완수! 배지가 적립되었습니다.`);
    setClearedSector(sector || null);
    setScreen('complete');
  };

  const resetRecord = () => {
    setCompleted([]);
    setNotice('미션 기록을 초기화했습니다.');
    setScreen('map');
  };

  const logout = () => {
    sessionStorage.removeItem(sessionKey);
    setUser(null);
    setScreen('map');
  };

  if (showIntro) {
    return <PhoneShell><IntroScreen /></PhoneShell>;
  }

  if (!user) {
    return <PhoneShell><AuthScreen {...{ authTab, setAuthTab, name, setName, password, setPassword, showPassword, setShowPassword, authMessage, handleAuth }} /></PhoneShell>;
  }

  return (
    <PhoneShell>
      {screen === 'map' && <MapScreen {...{ user, completed, completedBaseCount, totalPoints, notice, startMission, participation, participants, participantGoal }} />}
      {screen === 'game' && <GameScreen key={activeSector.id} sector={activeSector} onComplete={(result) => completeMission(activeSector.id, result)} onBack={() => setScreen('map')} />}
      {screen === 'complete' && <MissionCompleteScreen sector={clearedSector} onDone={() => setScreen(clearedSector?.id === 'central' ? 'certificate' : 'map')} />}
      {screen === 'certificate' && <CertificateScreen {...{ user, participation, participants, participantGoal }} />}
      {screen === 'profile' && <ProfileScreen {...{ user, completed, totalPoints, resetRecord, logout }} />}
      {screen === 'leaderboard' && <LeaderboardScreen {...{ user, completed, remoteRows, remoteError }} />}
      {screen === 'badges' && <BadgesScreen completed={completed} />}
      {screen === 'notice' && <NoticeScreen />}
      {screen === 'qr' && <StationMapScreen />}
      <BottomNav screen={screen} setScreen={setScreen} />
    </PhoneShell>
  );
}

function PhoneShell({ children }) {
  return (
    <main className="stage">
      <section className="tablet">
        <div className="browser-bar">
          <span>‹</span>
          <span>›</span>
          <span className="url-lock">🔒 sea-cret-guard.go.kr</span>
          <span>☰</span>
        </div>
        {children}
      </section>
    </main>
  );
}

function IntroScreen() {
  return (
    <div className="intro-screen">
      <p className="intro-line line-1">세상의 이치</p>
      <p className="intro-line line-2">해경의 가치</p>
      <p className="intro-line line-3">언제나 같이.</p>
      <h1 className="intro-line line-4">
        <span>바다를 지키는 시크릿가드</span>
        <strong>해양경찰청.</strong>
      </h1>
    </div>
  );
}

function AuthScreen({ authTab, setAuthTab, name, setName, password, setPassword, showPassword, setShowPassword, authMessage, handleAuth }) {
  const login = authTab === 'login';
  return (
    <div className="auth-view">
      <section className="auth-hero-card">
        <div className="auth-logo-pill"><Anchor size={17} /> 해양경찰 미션 인증</div>
        <img className="auth-character" src="/assets/central.png" alt="아치 캐릭터" />
        <div className="auth-title-block">
          <span>SEA-CRET GUARD</span>
          <h1>{login ? '요원 로그인' : '신규 요원 등록'}</h1>
          <p>{login ? '가입한 요원명과 비밀번호로 다시 미션을 이어가세요.' : '아치와 함께 5개 지방청 미션을 수행할 요원 정보를 등록하세요.'}</p>
        </div>
        <div className="auth-mini-stats">
          <span>5개 지방청</span>
          <span>미션 배지</span>
          <span>아치증 발급</span>
        </div>
      </section>

      <section className="auth-panel">
        <div className="auth-tabs">
          <button type="button" className={login ? 'active' : ''} onClick={() => setAuthTab('login')}><KeyRound size={15} /> 로그인</button>
          <button type="button" className={!login ? 'active' : ''} onClick={() => setAuthTab('join')}>신규 등록</button>
        </div>
        {authMessage && <div className="message auth-message">{authMessage}</div>}
        <form onSubmit={(event) => { event.preventDefault(); handleAuth(); }}>
          <label>{login ? '요원명' : '새 요원명'}</label>
          <input value={name} onChange={(event) => setName(event.target.value)} placeholder="요원명을 입력하세요" />
          <label>비밀번호</label>
          <div className="password-row">
            <input type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="비밀번호를 입력하세요" />
            <button type="button" aria-label="비밀번호 보기" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button>
          </div>
          <button className="orange-button auth-submit" type="submit">{login ? '미션 접속하기' : '요원 등록하기'}</button>
        </form>
        <div className="kcg-channel-links" aria-label="해양경찰청 공식 채널 바로가기">
          <a href="https://www.kcg.go.kr" target="_blank" rel="noreferrer">
            <span className="channel-logo home-logo"><Anchor size={15} /></span>
            <span>해양경찰청 홈페이지</span>
          </a>
          <a href="https://www.instagram.com/kcgnmpa/?hl=ko" target="_blank" rel="noreferrer">
            <span className="channel-logo instagram-logo">◎</span>
            <span>해양경찰청 인스타그램</span>
          </a>
          <a href="https://m.blog.naver.com/PostList.naver?blogId=kcgnmpa&tab=1" target="_blank" rel="noreferrer">
            <span className="channel-logo blog-logo">B</span>
            <span>해양경찰청 블로그</span>
          </a>
          <a href="https://www.youtube.com/channel/UCl6GW0nhB6UIL05h2oF3vRA" target="_blank" rel="noreferrer">
            <span className="channel-logo youtube-logo">▶</span>
            <span>해양경찰청 유튜브</span>
          </a>
        </div>
      </section>
    </div>
  );
}

function MapScreen({ user, completed, completedBaseCount, totalPoints, notice, startMission, participation, participants, participantGoal }) {
  const finalOpen = sectors.every((sector) => completed.includes(sector.id));
  return (
    <div className="map-view">
      <header className="hero">
        <div className="badge-mark"><Anchor /></div>
        <div>
          <h1>SEA-CRET GUARD</h1>
          <p><strong>아치</strong>와 함께하는 해양경찰 미션</p>
        </div>
      </header>
      <section className="status-card">
        <img src="/assets/central.png" alt="아치" />
        <div>
          <span>해양 지킴이 {user}</span>
          <div className="level-line"><i style={{ width: `${Math.min(100, completedBaseCount * 25)}%` }} /></div>
        </div>
        <strong>{totalPoints.toLocaleString()} P</strong>
      </section>
      <ParticipationCard participation={participation} participants={participants} participantGoal={participantGoal} />
      {notice && <div className="toast">✅ {notice}</div>}
      <section className="sea-map">
        <div className="horizon-wave wave-a" />
        <div className="horizon-wave wave-b" />
        <KoreaMissionMap />
        <div className="island island-a" />
        <div className="island island-b" />
        <div className="island island-c" />
        <div className="route r1" />
        <div className="route r2" />
        {[...sectors, finalSector].map((sector) => (
          <MissionCard
            key={sector.id}
            sector={sector}
            locked={sector.id === 'central' && !finalOpen}
            done={completed.includes(sector.id)}
            onStart={() => startMission(sector)}
          />
        ))}
      </section>
    </div>
  );
}

function KoreaMissionMap() {
  return (
    <svg className="mission-korea-map" viewBox="0 0 260 360" aria-hidden="true">
      <path className="mission-korea-land" d="M140 18c22 14 33 33 35 58 1 15 11 23 24 32 21 16 24 42 10 62-9 13-7 28 3 42 14 20 10 44-10 60-16 12-22 28-17 48 5 21-10 39-32 41-17 1-28-10-40-18-11-8-23-5-36-2-24 6-46-10-49-35-2-18 7-33 19-45 11-11 10-24 2-37-12-20-7-43 10-57 13-11 16-25 9-41-10-22 0-45 21-55 14-7 21-19 23-35 3-17 12-30 28-18z" />
      <path className="mission-korea-ridge" d="M92 82c-14 20-12 39 4 55 14 14 11 31-6 48-16 15-20 35-8 53 11 16 10 32-5 48" />
      <path className="mission-korea-ridge" d="M164 58c-3 28 9 42 28 56 16 13 16 32 6 50-11 18-5 36 8 52" />
      <ellipse className="mission-jeju-shape" cx="86" cy="326" rx="35" ry="13" transform="rotate(-8 86 326)" />
      <circle className="mission-port p-east" cx="181" cy="160" r="5" />
      <circle className="mission-port p-west" cx="70" cy="176" r="5" />
      <circle className="mission-port p-south" cx="125" cy="267" r="5" />
      <circle className="mission-port p-jeju" cx="86" cy="326" r="5" />
      <circle className="mission-port p-central" cx="132" cy="88" r="5" />
    </svg>
  );
}

function MissionCard({ sector, locked, done, onStart }) {
  return (
    <article className={`mission-card ${sector.position} ${locked ? 'locked' : ''}`}>
      <div className="mission-title-row">
        <span style={{ background: sector.color }}>{sector.number}</span>
        <strong>{sector.label} · {sector.mission}</strong>
      </div>
      <div className="mission-thumb">
        <img src={sector.asset} alt={`${sector.label} 아치`} />
      </div>
      <p>{sector.description}</p>
      <button onClick={onStart}>{locked ? '잠김' : done ? '다시 도전' : '미션 시작'}</button>
    </article>
  );
}

function ParticipationCard({ participation, participants, participantGoal }) {
  const complete = participation >= 100;
  const donation = participants * 100;
  return (
    <section className="participation-card">
      <div>
        <strong>{complete ? '아치 찾기 성공!' : 'SEA-CRET 참여도'}</strong>
        <span>{participants.toLocaleString()} / {participantGoal.toLocaleString()}명 참여</span>
      </div>
      <div className="participation-line">
        <i style={{ width: `${participation}%` }} />
      </div>
      <p>{complete ? `참여바가 가득 찼습니다. 해양경찰청 이름으로 ${donation.toLocaleString()}원을 기부할 수 있습니다.` : `1명당 100원씩 쌓여 현재 ${donation.toLocaleString()}원이 모였습니다. 참여바가 꽉 차면 해양경찰청 이름으로 기부할 수 있습니다.`}</p>
    </section>
  );
}

function GameScreen({ sector, onComplete, onBack }) {
  return (
    <div className="game-view">
      <header className="game-header">
        <button onClick={onBack}>‹</button>
        <div>
          <span>{sector.office}</span>
          <h1>{sector.title}</h1>
        </div>
      </header>
      {sector.id === 'east' && <EastSaltBreadGame onComplete={onComplete} />}
      {sector.id === 'west' && <WestHiddenGame onComplete={onComplete} />}
      {sector.id === 'south' && <SouthPuzzleGame onComplete={onComplete} />}
      {sector.id === 'jeju' && <JejuCatchGame onComplete={onComplete} />}
      {sector.id === 'central' && <CentralOxQuizGame onComplete={onComplete} />}
    </div>
  );
}

function MissionCompleteScreen({ sector, onDone }) {
  const finalMission = sector?.id === 'central';
  return (
    <div className="complete-view">
      <div className="confetti" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
      <article className="complete-card">
        <p>{sector?.office || '해양경찰 미션'} 완료</p>
        <h1>미션 클리어!!</h1>
        <img src={sector?.asset || '/assets/central.png'} alt="" />
        <strong>{sector?.mission || '배지 적립'} 성공</strong>
        <span>{finalMission ? '최종 인증이 완료되었습니다. 아치증 발급을 진행하세요.' : '배지와 포인트가 기록되었습니다.'}</span>
        <button onClick={onDone}><Home size={20} /> {finalMission ? '아치증 발급 화면으로' : '완료'}</button>
      </article>
    </div>
  );
}

function CertificateScreen({ user, participation, participants, participantGoal }) {
  const [issued, setIssued] = useState(false);
  return (
    <div className="certificate-view">
      <header className="certificate-hero">
        <span>FINAL CLEAR</span>
        <h1>SEA-CRET 아치증 발급받기!</h1>
        <p>{user} 요원님의 최종 SEA-CRET GUARD 인증이 준비되었습니다.</p>
      </header>
      <ParticipationCard participation={participation} participants={participants} participantGoal={participantGoal} />
      {!issued ? (
        <button className="issue-button" onClick={() => setIssued(true)}>SEA-CRET 아치증 발급받기!</button>
      ) : (
        <section className="issued-card">
          <div className="generated-certificate" role="img" aria-label={`${user} 요원 SEA-CRET 아치증`}>
            <div>
              <span>SEA-CRET ARCHI</span>
              <h2>{user}</h2>
              <strong>APPROVED</strong>
              <p>아치는 바다의 안전을 지키는 특별한 임무를 수행할 요원으로 임명합니다.</p>
            </div>
            <img src="/assets/secret-guard-badge.png" alt="" />
          </div>
          <strong>아치증 발급 완료!</strong>
        </section>
      )}
    </div>
  );
}

function EastSaltBreadGame({ onComplete }) {
  const areaRef = useRef(null);
  const [shipX, setShipX] = useState(50);
  const [bread, setBread] = useState({ x: 50, y: 8, vx: 0.18, vy: 1.15 });
  const [score, setScore] = useState(0);
  const [ended, setEnded] = useState(false);
  const [saved, setSaved] = useState(false);
  const draggingRef = useRef(false);
  const scoreRef = useRef(0);

  useEffect(() => {
    if (ended || saved) return undefined;
    const move = setInterval(() => {
      setBread((current) => {
        let next = {
          x: current.x + current.vx,
          y: current.y + current.vy,
          vx: current.vx,
          vy: current.vy + 0.055,
        };

        if (next.x < 7 || next.x > 93) {
          next.vx *= -1;
          next.x = Math.max(7, Math.min(93, next.x));
        }

        const hitShip = next.vy > 0 && next.y > 73 && next.y < 83 && Math.abs(next.x - shipX) < 19;
        if (hitShip) {
          next = {
            ...next,
            y: 70,
            vy: -1.8 - Math.min(1.3, scoreRef.current / 90),
            vx: (next.x - shipX) / 24,
          };
          setScore((value) => {
            const updated = value + 1;
            scoreRef.current = updated;
            return updated;
          });
        }

        if (next.y > 105) {
          setEnded(true);
        }

        return next;
      });
    }, 24);
    return () => clearInterval(move);
  }, [ended, saved, shipX]);

  const moveShip = (clientX) => {
    const rect = areaRef.current?.getBoundingClientRect();
    if (!rect) return;
    setShipX(Math.max(10, Math.min(90, ((clientX - rect.left) / rect.width) * 100)));
  };

  const finishGame = () => {
    if (score < 1 || saved) return;
    setSaved(true);
    onComplete({ saltScore: score });
  };

  const resetBread = () => {
    scoreRef.current = 0;
    setScore(0);
    setBread({ x: 50, y: 8, vx: 0.18, vy: 1.15 });
    setEnded(false);
    setSaved(false);
  };

  const breadStage = Math.max(1, 5 - Math.floor(score / 50));

  return (
    <div className="mini-game salt-game">
      <GameStats time="튕기기" current={score} target={250} label="점" />
      <p className="salt-guide">작은 선박을 꾹 누른 채 좌우로 움직여 소금빵을 튕기세요. 1번만 튕겨도 동해 배지를 받을 수 있습니다.</p>
      <div
        ref={areaRef}
        className="salt-playfield"
        onPointerDown={(event) => { draggingRef.current = true; moveShip(event.clientX); }}
        onPointerMove={(event) => draggingRef.current && moveShip(event.clientX)}
        onPointerUp={() => { draggingRef.current = false; }}
        onPointerLeave={() => { draggingRef.current = false; }}
      >
        <div className={`salt-bread-stage stage-${breadStage}`} style={{ left: `${bread.x}%`, top: `${bread.y}%` }} />
        <button className="ship-paddle" style={{ left: `${shipX}%` }} type="button" aria-label="선박 조종 버튼">🚢</button>
        <div className="salt-sea" />
      </div>
      <div className="salt-stage-line">
        <span>현재 빵 단계</span>
        <strong>{breadStage}단계</strong>
        <small>50점마다 한 단계씩 밝아집니다.</small>
      </div>
      {score >= 1 && !ended && <button className="salt-save-button" onClick={finishGame}>점수 저장하고 배지 받기</button>}
      {ended && score >= 1 && <button className="salt-save-button" onClick={finishGame}>최종 {score}점 저장하기</button>}
      {ended && score < 1 && <div className="retry-hint">소금빵을 1번 이상 튕겨야 배지를 받을 수 있습니다.<button onClick={resetBread}>다시 도전</button></div>}
    </div>
  );
}

function createBreads() {
  const blackIndex = Math.floor(Math.random() * 9);
  return Array.from({ length: 9 }, (_, index) => ({
    id: `${index}-${Math.random()}`,
    up: true,
    type: index === blackIndex ? 'black' : index % 2 === 0 ? 'orange' : 'cream',
    image: index === blackIndex ? '/assets/bread-black.png' : index % 2 === 0 ? '/assets/bread-orange.png' : '/assets/bread-cream.png',
  }));
}

function WestHiddenGame({ onComplete }) {
  const target = 4;
  const [time, setTime] = useState(10);
  const [found, setFound] = useState([]);
  const differences = useMemo(() => [
    { id: 'basket-hand', label: '보라색 손', x: 76, y: 65, size: 'hand-zone' },
    { id: 'cheek', label: '빨간 볼터치', x: 50, y: 35, size: 'cheek-zone' },
    { id: 'name-tag', label: '파란 명찰', x: 30, y: 57, size: 'tag-zone' },
    { id: 'left-hand', label: '왼쪽 손', x: 13, y: 35, size: 'left-hand-zone' },
  ], []);
  const correctFound = differences.filter((object) => found.includes(object.id)).length;

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((current) => {
        if (current <= 1) {
          clearInterval(timer);
          return 0;
        }
        return current - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (correctFound >= target) setTimeout(onComplete, 400);
  }, [correctFound, onComplete, target]);

  return (
    <div className="mini-game hidden-game">
      <GameStats time={time} current={correctFound} target={target} label="틀린 곳" />
      <p className="spot-guide">오른쪽 캐릭터에서 기준 그림과 다른 곳 4개를 터치하세요.</p>
      <div className="spot-scene">
        <article className="spot-panel">
          <span>기준</span>
          <div className="spot-image-wrap">
            <img src="/assets/west.png" alt="기준 서해 아치" />
          </div>
        </article>
        <article className="spot-panel spot-target">
          <span>찾기</span>
          <div className="spot-image-wrap">
            <img src="/assets/west-diff.png" alt="비교 서해 아치" />
            {differences.map((object) => (
              <button
                key={object.id}
                className={`difference-hotspot ${object.size} ${found.includes(object.id) ? 'found' : ''}`}
                style={{ left: `${object.x}%`, top: `${object.y}%` }}
                onClick={() => time > 0 && setFound((current) => Array.from(new Set([...current, object.id])))}
                aria-label={object.label}
              >
                {found.includes(object.id) && <span className="found-ring" />}
              </button>
            ))}
          </div>
        </article>
      </div>
      {time === 0 && correctFound < target && <RetryHint />}
    </div>
  );
}

function SouthPuzzleGame({ onComplete }) {
  const [pieces, setPieces] = useState(() => shuffle(Array.from({ length: 9 }, (_, index) => index)));
  const [slots, setSlots] = useState(Array(9).fill(null));
  const [selectedPiece, setSelectedPiece] = useState(null);

  const placePiece = (piece, slotIndex) => {
    if (slotIndex < 0 || slots[slotIndex] !== null || !pieces.includes(piece)) return;
    const nextSlots = [...slots];
    nextSlots[slotIndex] = piece;
    setSlots(nextSlots);
    setPieces((current) => current.filter((item) => item !== piece));
    setSelectedPiece(null);
    if (nextSlots.every((slot, index) => slot === index)) setTimeout(onComplete, 450);
  };

  const removePiece = (slotIndex) => {
    const piece = slots[slotIndex];
    if (piece === null) return;
    const nextSlots = [...slots];
    nextSlots[slotIndex] = null;
    setSlots(nextSlots);
    setPieces((current) => shuffle([...current, piece]));
  };

  const reset = () => {
    setPieces(shuffle(Array.from({ length: 9 }, (_, index) => index)));
    setSlots(Array(9).fill(null));
    setSelectedPiece(null);
  };

  const handleDrop = (event, slotIndex) => {
    event.preventDefault();
    const piece = Number(event.dataTransfer.getData('text/plain'));
    if (Number.isInteger(piece)) placePiece(piece, slotIndex);
  };

  return (
    <div className="mini-game puzzle-game">
      <div className="puzzle-top">
        <img src="/assets/south.png" alt="예시 아치" />
        <p>예시를 보고 보이는 이미지 조각을 끌어다가 맞는 3x3 칸에 놓으세요.</p>
        <button onClick={reset}><RotateCcw size={15} /> 다시 섞기</button>
      </div>
      <div className="puzzle-grid">
        {slots.map((piece, index) => (
          <button
            key={index}
            className={`puzzle-slot ${selectedPiece !== null && piece === null ? 'ready' : ''}`}
            onClick={() => (selectedPiece !== null ? placePiece(selectedPiece, index) : removePiece(index))}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => handleDrop(event, index)}
          >
            {piece === null ? <span>{index + 1}</span> : <PuzzlePiece piece={piece} />}
          </button>
        ))}
      </div>
      <div className="piece-pool">
        {pieces.map((piece) => (
          <button
            key={piece}
            className={`puzzle-piece-button ${selectedPiece === piece ? 'selected' : ''}`}
            draggable
            onDragStart={(event) => event.dataTransfer.setData('text/plain', String(piece))}
            onClick={() => setSelectedPiece(piece)}
            aria-label={`퍼즐 조각 ${piece + 1}`}
          >
            <PuzzlePiece piece={piece} />
          </button>
        ))}
      </div>
    </div>
  );
}

function PuzzlePiece({ piece }) {
  return (
    <span
      className="puzzle-piece-preview"
      style={{
        backgroundPosition: `${(piece % 3) * 50}% ${Math.floor(piece / 3) * 50}%`,
      }}
    />
  );
}

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function JejuCatchGame({ onComplete }) {
  const target = 10;
  const pollutantItems = [
    { icon: '🛢️', value: 10, kind: 'pollutant' },
    { icon: '🧴', value: 10, kind: 'pollutant' },
    { icon: '🧃', value: 10, kind: 'pollutant' },
    { icon: '🪢', value: 10, kind: 'pollutant' },
  ];
  const neutralItems = [
    { icon: '💧', value: 0, kind: 'neutral' },
    { icon: '🍀', value: 0, kind: 'neutral' },
  ];
  const areaRef = useRef(null);
  const [basketX, setBasketX] = useState(50);
  const [items, setItems] = useState([]);
  const [score, setScore] = useState(0);
  const [caughtCount, setCaughtCount] = useState(0);
  const [time, setTime] = useState(20);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((current) => {
        if (current <= 1) {
          clearInterval(timer);
          return 0;
        }
        return current - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (time === 0 || caughtCount >= target) return undefined;
    const fall = setInterval(() => {
      const pool = Math.random() > 0.28 ? pollutantItems : neutralItems;
      const itemType = pool[Math.floor(Math.random() * pool.length)];
      setItems((current) => [
        ...current.slice(-8),
        { id: Math.random(), x: 10 + Math.random() * 80, y: 0, ...itemType },
      ].map((item) => ({ ...item, y: item.y + 12 })));
    }, 450);
    return () => clearInterval(fall);
  }, [time, caughtCount, target]);

  useEffect(() => {
    if (time === 0) return;
    setItems((current) => current.filter((item) => {
      const caught = item.y > 78 && Math.abs(item.x - basketX) < 15;
      if (caught) {
        if (item.value > 0) {
          setScore((value) => value + item.value);
          setCaughtCount((value) => value + 1);
        }
      }
      return item.y < 95 && !caught;
    }));
  }, [items, basketX, time]);

  useEffect(() => {
    if (caughtCount >= target) setTimeout(onComplete, 350);
  }, [caughtCount, onComplete, target]);

  const moveBasket = (clientX) => {
    if (time === 0) return;
    const rect = areaRef.current?.getBoundingClientRect();
    if (!rect) return;
    setBasketX(Math.max(8, Math.min(92, ((clientX - rect.left) / rect.width) * 100)));
  };

  return (
    <div className="mini-game catch-game">
      <GameStats time={time} current={caughtCount} target={target} label={`${score}점`} />
      <div
        ref={areaRef}
        className="catch-area"
        onPointerMove={(event) => moveBasket(event.clientX)}
        onPointerDown={(event) => moveBasket(event.clientX)}
      >
        {items.map((item) => <span key={item.id} className={`fall-item ${item.kind}`} style={{ left: `${item.x}%`, top: `${item.y}%` }}>{item.icon}</span>)}
        <div className="basket" style={{ left: `${basketX}%` }}>🧺</div>
      </div>
      {time === 0 && caughtCount < target && <RetryHint />}
    </div>
  );
}

const centralQuizBank = [
  {
    id: 1,
    question: '2023년, 필리핀 중부 해역에서 발생한 기름 유출 사고 당시 대한민국 최초로 해외에 긴급방제팀을 파견한 것은 해양경찰청이다.',
    answer: 'O',
    explanation: '맞습니다. 2023년 필리핀 민도로 기름유출 사고 당시 대한민국 해양경찰청은 우리나라 최초로 해외 긴급방제팀을 파견했습니다. 이는 첫 해외 해양오염 방제 지원 사례였습니다.',
  },
  {
    id: 2,
    question: '해양경찰은 불법 조업 어선 단속 시, 증거 확보와 법 집행의 정당성을 입증하기 위해 대원들의 헬멧 등에 장착된 바디캠을 활용한다.',
    answer: 'O',
    explanation: '맞습니다. 해양경찰은 불법조업 어선 단속 등 법집행 과정에서 바디캠을 활용하여 증거 확보, 법집행의 적법성 확인, 대원 보호에 활용하고 있습니다.',
  },
  {
    id: 3,
    question: '해양경찰은 해상 사고 발생 시 인명 구조 임무만 수행하며, 해상 범죄 수사나 마약 단속 업무는 경찰청에 모두 인계한다.',
    answer: 'X',
    explanation: '틀렸습니다. 해양경찰은 인명구조뿐만 아니라 해상 범죄 수사, 마약 밀수 단속, 불법조업 단속, 해양환경 보호 등의 업무도 직접 수행합니다.',
  },
  {
    id: 4,
    question: '해양경찰은 함정뿐만 아니라 헬기 및 고정익 항공기를 운용하여 먼 바다의 실종자 수색과 응급환자 이송 임무를 수행한다.',
    answer: 'O',
    explanation: '맞습니다. 해양경찰은 함정뿐 아니라 헬기와 고정익 항공기를 운용하여 원거리 해상 수색, 응급환자 이송, 해상 감시 등의 임무를 수행합니다.',
  },
  {
    id: 5,
    question: '바디캠 영상에서 불법 중국어선 단속을 수행하는 대원들은 저항하는 선원들을 제압하기 위해 섬광폭음탄 등의 비살상 무기를 사용하기도 한다.',
    answer: 'O',
    explanation: '맞습니다. 불법 중국어선 단속 과정에서 필요 시 섬광폭음탄, 테이저 등 비살상 장비를 사용하여 저항하는 선원을 제압하기도 합니다.',
  },
];

function CentralOxQuizGame({ onComplete }) {
  const target = 2;
  const total = 3;
  const [questions, setQuestions] = useState(() => shuffle(centralQuizBank).slice(0, total));
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState([]);
  const [showHint, setShowHint] = useState(false);
  const [result, setResult] = useState(null);
  const [passed, setPassed] = useState(false);
  const current = questions[index];
  const failed = answered.length >= total && score < target;

  const resetQuiz = () => {
    setQuestions(shuffle(centralQuizBank).slice(0, total));
    setIndex(0);
    setScore(0);
    setAnswered([]);
    setShowHint(false);
    setResult(null);
    setPassed(false);
  };

  const chooseAnswer = (choice) => {
    if (!current || passed || result) return;
    const correct = choice === current.answer;
    const nextScore = score + (correct ? 1 : 0);
    const nextAnswered = [...answered, { id: current.id, correct, choice }];
    setScore(nextScore);
    setAnswered(nextAnswered);
    setResult(correct ? '정답입니다!' : '아쉽지만 오답입니다.');
    setShowHint(true);

    if (nextScore >= target) {
      setPassed(true);
      setTimeout(onComplete, 900);
      return;
    }

    if (nextAnswered.length < total) {
      setTimeout(() => {
        setIndex((value) => value + 1);
        setResult(null);
        setShowHint(false);
      }, 900);
    }
  };

  return (
    <div className="mini-game ox-game">
      <section className="ox-hero">
        <img src="/assets/central.png" alt="중부 아치" />
        <div>
          <span>FINAL GATE</span>
          <h2>시크릿가드가 되기 위한 최종관문!</h2>
          <p>5문제 중 랜덤 3문제 출제, 2문제 이상 맞히면 합격입니다.</p>
        </div>
      </section>

      <GameStats time={`문항 ${index + 1}/${total}`} current={score} target={target} label="정답" />

      <article className="ox-card">
        <div className="ox-count">문제 {index + 1}</div>
        <p>{current.question}</p>
        <div className="ox-actions">
          <button className="ox-button yes" onClick={() => chooseAnswer('O')} disabled={passed || Boolean(result)}>O</button>
          <button className="ox-button no" onClick={() => chooseAnswer('X')} disabled={passed || Boolean(result)}>X</button>
        </div>
        <button className="hint-button" onClick={() => setShowHint((value) => !value)}>
          힌트 {showHint ? '닫기' : '보기'}
        </button>
        {result && <strong className={`ox-result ${result.includes('정답') ? 'correct' : 'wrong'}`}>{result}</strong>}
        {showHint && <div className="ox-hint">{current.explanation}</div>}
      </article>

      <div className="ox-dots">
        {questions.map((question, dotIndex) => {
          const item = answered.find((answer) => answer.id === question.id);
          return <span key={question.id} className={`${dotIndex === index ? 'active' : ''} ${item?.correct ? 'correct' : ''} ${item && !item.correct ? 'wrong' : ''}`} />;
        })}
      </div>

      {passed && <div className="message">최종관문 합격! SEA-CRET GUARD 인증으로 이동합니다.</div>}
      {failed && (
        <div className="retry-hint">
          최종관문 재도전이 필요합니다.
          <button onClick={resetQuiz}>다시 도전</button>
        </div>
      )}
    </div>
  );
}

function GameStats({ time, current, target, label }) {
  return <div className="game-stats"><span>{typeof time === 'number' ? `⏱ ${time}s` : time}</span><strong>{current}/{target}</strong><span>{label}</span></div>;
}

function RetryHint() {
  return <div className="retry-hint">시간 종료! 하단 Map으로 돌아가 다시 미션을 시작하세요.</div>;
}

function ProfileScreen({ user, completed, totalPoints, resetRecord, logout }) {
  return (
    <div className="profile-view">
      <h1><UserRound /> 마이페이지</h1>
      <div className="profile-card">
        <img src="/assets/central.png" alt="아치" />
        <div><strong>{user} 요원</strong><span>{totalPoints.toLocaleString()} P</span></div>
      </div>
      <div className="badge-grid">
        {allSectors.map((sector) => <article key={sector.id} className={completed.includes(sector.id) ? 'earned' : ''}><img src={sector.asset} alt="" /><span>{sector.label}</span></article>)}
      </div>
      <button className="outline-button" onClick={resetRecord}>내 기록 전체 삭제</button>
      <button className="outline-button" onClick={logout}>로그아웃</button>
    </div>
  );
}

function LeaderboardScreen({ user, completed, remoteRows, remoteError }) {
  const accounts = readJson(accountsKey, []);
  const localRows = buildPublicRanking(accounts, user, completed);
  const rows = (remoteRows && remoteRows.length > 0 ? remoteRows : localRows)
    .map((row) => ({
      ...row,
      current: row.name === user,
    }))
    .sort((a, b) => b.points - a.points || b.missionCount - a.missionCount || a.name.localeCompare(b.name, 'ko'));

  return (
    <div className="simple-view">
      <h1><Trophy /> 랭킹</h1>
      <p className="leaderboard-note">공용 랭킹 저장소에 등록된 모든 요원의 미션 기록을 기준으로 표시됩니다.</p>
      <div className="coupon-note">상위 3명에게 소금빵 무료쿠폰을 드립니다.</div>
      {remoteError && (
        <div className="retry-hint">
          공용 랭킹 저장소 연결이 필요합니다. 현재는 이 기기에 저장된 요원만 표시됩니다.
        </div>
      )}
      {rows.length === 0 && <div className="retry-hint">아직 가입한 요원이 없습니다.</div>}
      {rows.map((row, index) => (
        <div className={`rank-row ${row.current ? 'current' : ''}`} key={row.name}>
          <strong>{index + 1}</strong>
          <span>{row.name}{row.current ? ' 요원' : ''}<small>{row.missionCount}/5 미션 완료 · 소금빵 {Number(row.saltScore || 0).toLocaleString()}점</small></span>
          <b>{row.points.toLocaleString()} P</b>
        </div>
      ))}
    </div>
  );
}

function BadgesScreen({ completed }) {
  const baseBadges = allSectors.map((sector) => ({
    id: sector.id,
    title: sector.office,
    subtitle: sector.mission,
    asset: sector.asset,
    unlocked: completed.includes(sector.id),
  }));
  const allUnlocked = allSectors.every((sector) => completed.includes(sector.id));
  const secretBadge = {
    id: 'secret-guard',
    title: 'SEA-CRET Guard',
    subtitle: '5개 배지 완성 시 공개',
    asset: '/assets/secret-guard-badge.png',
    unlocked: allUnlocked,
    featured: true,
  };
  const badges = [...baseBadges, secretBadge];

  return (
    <div className="simple-view badges-view">
      <h1><ShipWheel /> 배지</h1>
      <section className="badge-collection-hero">
        <strong>{completed.length}/5 지방청 배지 수집</strong>
        <p>미션을 완료하면 잠겨 있던 배지가 공개됩니다. 모든 배지를 모으면 마지막 SEA-CRET Guard가 열립니다.</p>
        <div className="badge-progress"><i style={{ width: `${Math.min(100, completed.length * 20)}%` }} /></div>
      </section>
      <div className="badge-grid large collection-grid">
        {badges.map((badge) => (
          <article key={badge.id} className={`badge-card ${badge.unlocked ? 'earned' : 'locked'} ${badge.featured ? 'featured' : ''}`}>
            {badge.unlocked ? (
              <>
                <div className="badge-image-wrap"><img src={badge.asset} alt="" /></div>
                <span>{badge.title}</span>
                <small>{badge.featured ? '최종 시크릿 배지 공개' : badge.subtitle}</small>
              </>
            ) : (
              <div className="locked-badge">
                <b>?</b>
                <strong>{badge.title}</strong>
                <small>{badge.featured ? '모든 배지 획득 시 공개' : '미션 완료 시 공개'}</small>
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}

function NoticeScreen() {
  return (
    <div className="simple-view">
      <h1><Bell /> 공지사항</h1>
      <article className="notice-card"><strong>5개 지방청 미션 안내</strong><p>동해, 서해, 남해, 제주 미션을 완료하면 중부 최종 전직 미션이 열립니다.</p></article>
      <article className="notice-card"><strong>게임 완수 조건</strong><p>각 게임의 목표 수량과 제한 시간을 확인하고 성공하면 배지가 지급됩니다.</p></article>
      <article className="notice-card"><strong>QR 접속</strong><p>QR 화면의 코드를 스캔하면 이 웹사이트로 바로 접속할 수 있습니다.</p></article>
    </div>
  );
}

function StationMapScreen() {
  const [permissionMode, setPermissionMode] = useState('대기 중');
  const [userPosition, setUserPosition] = useState(null);
  const [nearest, setNearest] = useState(null);
  const [locationError, setLocationError] = useState('');

  const requestLocation = (mode) => {
    setPermissionMode(mode);
    setLocationError('');
    if (!navigator.geolocation) {
      setLocationError('이 브라우저에서는 GPS 기능을 사용할 수 없습니다.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const current = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserPosition(current);
        setNearest(getNearestStation(current));
      },
      (error) => {
        setNearest(null);
        setLocationError(error.code === 1 ? '위치 권한이 거부되었습니다. 브라우저 설정에서 위치 권한을 허용해주세요.' : '현재 위치를 가져오지 못했습니다. 잠시 후 다시 시도해주세요.');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    );
  };

  return (
    <div className="simple-view station-map-view">
      <h1><MapPin /> 지도</h1>
      <section className="location-hero">
        <div>
          <span>ARCHI REWARD MAP</span>
          <h2>가까운 해양경찰서 찾기</h2>
          <p>GPS를 켜면 현재 위치에서 가장 가까운 해양경찰서를 안내합니다. 방문 시 SEA-CRET 아치증을 보여주면 준비된 상품으로 교환할 수 있습니다.</p>
        </div>
        <Navigation />
      </section>

      <section className="permission-card">
        <strong>위치 접근 설정</strong>
        <p>브라우저 권한창이 뜨면 원하는 방식을 선택해주세요. 앱 안의 버튼은 권한 요청을 시작하는 역할을 합니다.</p>
        <div className="permission-actions">
          <button onClick={() => requestLocation('위치 허용')}>위치 허용</button>
          <button onClick={() => requestLocation('앱 사용할 때만')}>앱 사용할 때만</button>
          <button className="deny" onClick={() => { setPermissionMode('거부'); setNearest(null); setLocationError('위치 기능을 사용하지 않도록 설정했습니다.'); }}>거부</button>
        </div>
        <small>현재 상태: {permissionMode}</small>
      </section>

      {nearest && (
        <section className="nearest-card">
          <span>가장 가까운 관서</span>
          <h2>{nearest.name}</h2>
          <p>{nearest.address}</p>
          <div className="station-meta">
            <strong>{nearest.region} 권역</strong>
            <b>약 {nearest.distance.toFixed(1)}km</b>
          </div>
          <a href={`https://map.kakao.com/link/search/${encodeURIComponent(nearest.name)}`} target="_blank" rel="noreferrer">지도 앱에서 보기</a>
        </section>
      )}

      {locationError && <div className="retry-hint">{locationError}</div>}

      <section className="station-database">
        <div className="station-db-title">
          <strong>전국 해양경찰서 데이터베이스</strong>
          <span>{coastGuardStations.length}개 관서</span>
        </div>
        <div className="station-list">
          {coastGuardStations.map((station) => (
            <article key={station.name} className={nearest?.name === station.name ? 'selected' : ''}>
              <div>
                <strong>{station.name}</strong>
                <span>{station.address}</span>
              </div>
              <small>{userPosition ? `${getDistanceKm(userPosition, station).toFixed(1)}km` : station.region}</small>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function BottomNav({ screen, setScreen }) {
  const navItems = [
    { id: 'qr', label: '지도', icon: MapPin },
    { id: 'leaderboard', label: '랭킹', icon: Trophy },
    { id: 'map', label: '홈', icon: Home, center: true },
    { id: 'badges', label: '배지', icon: Anchor },
    { id: 'profile', label: '마이', icon: UserRound },
  ];

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            className={`${screen === item.id ? 'active' : ''} ${item.center ? 'home-center' : ''}`}
            onClick={() => setScreen(item.id)}
          >
            <span className="nav-icon"><Icon /></span>
            <span className="nav-label">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

createRoot(document.getElementById('root')).render(<App />);
