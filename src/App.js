import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { TextureLoader } from 'three';
import './App.css';

import gameData from './gameData.json';

function Dice({ position, rollDiceFunctionRef, setDiceResult }) {
  const diceRef = useRef();
  const [targetRotation, setTargetRotation] = useState([0, 0, 0]);
  const [rotation, setRotation] = useState([0, 0, 0]);
  const [isRolling, setIsRolling] = useState(false);

  const textures = [
    useLoader(TextureLoader, '/images/dice1.png'),
    useLoader(TextureLoader, '/images/dice2.png'),
    useLoader(TextureLoader, '/images/dice3.png'),
    useLoader(TextureLoader, '/images/dice4.png'),
    useLoader(TextureLoader, '/images/dice5.png'),
    useLoader(TextureLoader, '/images/dice6.png'),
  ];

  useEffect(() => {
    if (rollDiceFunctionRef) {
      rollDiceFunctionRef.current = rollDice;
    }
  }, [rollDiceFunctionRef]);

  const rollDice = () => {
    const randomX = Math.PI / 2 * Math.floor(Math.random() * 10 + 10) + Math.random() * 0.1;
    const randomY = Math.PI / 2 * Math.floor(Math.random() * 10 + 10) + Math.random() * 0.1;
    const randomZ = Math.PI / 2 * Math.floor(Math.random() * 10 + 10) + Math.random() * 0.1;
    setTargetRotation([randomX, randomY, randomZ]);
    setIsRolling(true);
  };

  useFrame(() => {
    if (diceRef.current && isRolling) {
      const step = 0.1;
      const [x, y, z] = rotation;
      const [tx, ty, tz] = targetRotation;

      const newX = THREE.MathUtils.lerp(x, tx, step);
      const newY = THREE.MathUtils.lerp(y, ty, step);
      const newZ = THREE.MathUtils.lerp(z, tz, step);

      setRotation([newX, newY, newZ]);
      diceRef.current.rotation.set(newX, newY, newZ);

      if (Math.abs(newX - tx) < 0.01 && Math.abs(newY - ty) < 0.01 && Math.abs(newZ - tz) < 0.01) {
        setIsRolling(false);

        const finalRotation = [
          Math.round(newX / (Math.PI / 2)) * (Math.PI / 2),
          Math.round(newY / (Math.PI / 2)) * (Math.PI / 2),
          Math.round(newZ / (Math.PI / 2)) * (Math.PI / 2),
        ];
        setRotation(finalRotation);
        diceRef.current.rotation.set(finalRotation[0], finalRotation[1], finalRotation[2]);

        const faces = [
          { value: 5, position: [0, 0, 1] },
          { value: 6, position: [0, 0, -1] },
          { value: 3, position: [0, 1, 0] },
          { value: 4, position: [0, -1, 0] },
          { value: 1, position: [1, 0, 0] },
          { value: 2, position: [-1, 0, 0] }
        ];

        const frontFace = faces.reduce((closest, number) => {
          const direction = new THREE.Vector3(...number.position).applyEuler(diceRef.current.rotation);
          return direction.z > closest.direction.z ? { ...number, direction } : closest;
        }, { direction: new THREE.Vector3(0, 0, -Infinity) });

        setDiceResult(frontFace.value);
      }
    }
  });

  return (
    <mesh ref={diceRef} castShadow receiveShadow position={position}>
      <boxGeometry args={[2, 2, 2]} />
      {textures.map((texture, index) => (
        <meshStandardMaterial attach={`material-${index}`} map={texture} key={index} />
      ))}
    </mesh>
  );
}

export default function App() {
  const chatLogRef = useRef(null);
  const [inputValue, setInputValue] = useState('');
  const [nickname, setNickname] = useState("");
  const [isNicknameSet, setIsNicknameSet] = useState(false);
  const [theme, setTheme] = useState("");
  const [isThemeSet, setIsThemeSet] = useState(false);
  const [storyVisible, setStoryVisible] = useState(true);
  const [race, setRace] = useState('');
  const [job, setJob] = useState('');
  const [stats, setStats] = useState({ str: 0, dex: 0, int: 0, hp: 0 });
  const [rolling, setRolling] = useState(false);
  const [isJobConfirmed, setIsJobConfirmed] = useState(false);
  const [isDiceConfirmed, setIsDiceConfirmed] = useState(false);
  const [isStatsConfirmed, setIsStatsConfirmed] = useState(false);
  const [userActionExamples, setUserActionExamples] = useState([]);
  const [isRollDiceModalOpen, setIsRollDiceModalOpen] = useState(false);
  const [relevantStat, setRelevantStat] = useState('');
  const rollDiceFunctionRef1 = useRef(null);
  const rollDiceFunctionRef2 = useRef(null);
  const rollDiceFunctionRef3 = useRef(null);
  const rollDiceFunctionRef4 = useRef(null);
  const rollDiceFunctionRefStats1 = useRef(null);
  const rollDiceFunctionRefStats2 = useRef(null);
  const rollDiceFunctionRefStats3 = useRef(null);
  const rollDiceFunctionRamdomStats1 = useRef(null);
  const rollDiceFunctionRamdomStats2 = useRef(null);
  const rollDiceFunctionRamdomStats3 = useRef(null);
  const [diceResult1, setDiceResult1] = useState(0);
  const [diceResult2, setDiceResult2] = useState(0);
  const [diceResult3, setDiceResult3] = useState(0);
  const [diceResult4, setDiceResult4] = useState(0);
  const [diceResultStats1, setDiceResultStats1] = useState(0);
  const [diceResultStats2, setDiceResultStats2] = useState(0);
  const [diceResultStats3, setDiceResultStats3] = useState(0);
  const [setDiceRamdomResult1, setDiceRamdomResultStats1] = useState(0);
  const [setDiceRamdomResult2, setDiceRamdomResultStats2] = useState(0);
  const [setDiceRamdomResult3, setDiceRamdomResultStats3] = useState(0);
  const [raceList, setRaceList] = useState([]);
  const [jobList, setJobList] = useState([]);
  const [chatLog, setChatLog] = useState([]);
  const [isResultConfirmed, setIsResultConfirmed] = useState(false); // 확인 버튼 표시 여부

  // 닉네임 설정 핸들러
  const handleSetNickname = () => {
    if (nickname.trim() !== "") {
      setIsNicknameSet(true);
    }
  };

  // 주제 선택 핸들러
  const handleSetTheme = (selectedTheme) => {
    setTheme(selectedTheme);
    setRaceList(gameData.raceData[selectedTheme]);
    setJobList(gameData.jobData[selectedTheme]);
    setIsThemeSet(true);
  };

  // 테스트
  const testInput = async (input) => {
    try {
      const response = await fetch('/api/gpt/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `${input}`,
        }),
      });
    } catch (error) {
      
    }
  };

  // 시작 기본설정
  const preferencesUserInput = async () => {
    setStoryVisible(false);
    try {
      const raceSkills = gameData.raceSkills[theme]?.[race] || [];
      const jobSkills = gameData.jobSkills[theme]?.[job] || [];
      
      const raceSkillsString = raceSkills.join(', ');
      const jobSkillsString = jobSkills.join(', ');

      const response = await fetch('/api/gpt/preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `${nickname}님이 선택한 주제(${theme}), 종족(${race}), 직업(${job})로 진행:\n종족 스킬: ${raceSkillsString}\n직업 스킬: ${jobSkillsString}`,
        }),
      });
      

      const data = await response.json();
      setUserActionExamples(data.examples);
      if (data.story_theme && data.story_era && data.story_place && data.story_mood && data.story_start_situation) {
        setChatLog(prevLog => {
          const newLog = [
            ...prevLog,
            `기본설명: 게임 테마: ${data.story_theme}`,
            `기본설명: 시대 배경: ${data.story_era}`,
            `기본설명: 주요 장소: ${data.story_place}`,
            `기본설명: 게임 분위기: ${data.story_mood}`,
            `기본설명: 배경 설명: ${data.story_start_situation}`
          ];
          setTimeout(() => {
            if (chatLogRef.current) {
              chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight; // 로그창을 맨 아래로 스크롤
            }
          }, 0);
          return newLog;
        });
      } else {
        throw new Error("GPT 응답이 예상한 형식과 다릅니다.");
      }
    } catch (error) {
      console.error('OpenAI API 호출 중 오류 발생:', error);
      setChatLog(prevLog => {
        const newLog = [...prevLog, `시스템: 오류가 발생했습니다. 다시 시도해주세요.`];
        setTimeout(() => {
          if (chatLogRef.current) {
            chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight; // 로그창을 맨 아래로 스크롤
          }
        }, 0);
        return newLog;
      });
    } finally {
      setStoryVisible(true);
    }
  };

  // 사용자 입력 처리 핸들러
  const handleUserInput = async (input) => {
    setStoryVisible(false);
    setChatLog(prevLog => [...prevLog, `${nickname}: ${input}`]); // 사용자 입력을 로그에 추가
    setUserActionExamples([]);
    const lastStory = chatLog[chatLog.length - 1]; // 마지막 이야기
    const raceSkills = gameData.raceSkills[theme]?.[race] || [];
    const jobSkills = gameData.jobSkills[theme]?.[job] || [];
    
    try {
      const response = await fetch('/api/gpt/handleUserInput', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `주인공 이름: ${nickname}님이 선택한 주제: ${theme}, 
            ${nickname}님의 종족: ${race}, 
            ${nickname}님의 직업: ${job}로 진행,
            행동: ${input}로 진행,
            이전 이야기: ${lastStory},
            종족 스킬: ${raceSkills.join(', ')}, 직업 스킬: ${jobSkills.join(', ')}`
        }),
      });
    
      const data = await response.json();
      setChatLog((prevLog) => {
        const newLog = [...prevLog, `시스템: ${data.story_situation}`];

        // "주사위를 굴려야 하는 경우" 처리
        if (data.requires_roll) {
          setDiceRamdomResultStats1(0);
          setDiceRamdomResultStats2(0);
          setDiceRamdomResultStats3(0);
          setRelevantStat(''); // 스탯 관련 데이터 초기화
          setIsResultConfirmed(false);
          newLog.push(
            <button
              key="roll-dice-btn"
              style={{
                marginTop: '10px',
                padding: '10px',
                backgroundColor: '#444',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
              }}
              onClick={() => openRollDiceModal(data.relevant_stat)}
            >
              주사위 굴리기
            </button>
          );
        }
        setTimeout(() => {
          if (chatLogRef.current) {
            chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight; // 로그창을 맨 아래로 스크롤
          }
        }, 0);

        return newLog;
      });

      if (!data.requires_roll) {
        setUserActionExamples(data.examples);
      }
    } catch (error) {
      setChatLog(prevLog => {
        const newLog = [...prevLog, `시스템: 오류가 발생했습니다. 다시 시도해주세요.`];
        setTimeout(() => {
          if (chatLogRef.current) {
            chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight; // 로그창을 맨 아래로 스크롤
          }
        }, 0);
        return newLog;
      });
    } finally {
      setStoryVisible(true);
    }
  };

  // 결과를 통해 스토리 진행
  const continueStory = async (dice1, dice2, dice3, relevantStat, success) => {
    setStoryVisible(false);
    const diceSum = dice1 + dice2 + dice3;
    const actionResult = success ? '성공' : '실패';
    const lastStory = chatLog[chatLog.length - 2]; // 마지막 이야기
  
    try {
      const response = await fetch('/api/gpt/continueStory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `
            주인공 이름: ${nickname}님이 선택한 주제: ${theme}, 
            ${nickname}님의 종족: ${race}, 
            ${nickname}님의 직업: ${job}로 진행,
            이전 이야기: ${lastStory},
            주사위 결과: ${diceSum} (${actionResult}), 
            관련 능력: ${relevantStat}.`,
        }),
      });
  
      const data = await response.json();
      setChatLog((prevLog) => {
        const newLog = [...prevLog, `시스템: ${data.story_situation}`];

        // "주사위를 굴려야 하는 경우" 처리
        if (data.requires_roll) {
          setDiceRamdomResultStats1(0);
          setDiceRamdomResultStats2(0);
          setDiceRamdomResultStats3(0);
          setRelevantStat(''); // 스탯 관련 데이터 초기화
          setIsResultConfirmed(false);
          newLog.push(
            <button
              key="roll-dice-btn"
              style={{
                marginTop: '10px',
                padding: '10px',
                backgroundColor: '#444',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
              }}
              onClick={() => openRollDiceModal(data.relevant_stat)}
            >
              주사위 굴리기
            </button>
          );
        }
        setTimeout(() => {
          if (chatLogRef.current) {
            chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight; // 로그창을 맨 아래로 스크롤
          }
        }, 0);

        return newLog;
      });

      if (!data.requires_roll) {
        setUserActionExamples(data.examples);
      }
    } catch (error) {
      setChatLog((prevLog) => [...prevLog, '시스템: 다음 이야기를 가져오는 중 오류가 발생했습니다.']);
      console.error('GPT API 호출 중 오류 발생:', error);
    } finally {
      setStoryVisible(true);
    }
  };

  const openRollDiceModal = (stat) => {
    setRelevantStat(stat);
    setIsRollDiceModalOpen(true);
  };

  const addDiceResultToLog = (dice1, dice2, dice3, relevantStat, success) => {
    const diceSum = dice1 + dice2 + dice3;
    const resultMessage = success
      ? `시스템: ✅ 성공! (주사위 합: ${diceSum})`
      : `시스템: ❌ 실패! (주사위 합: ${diceSum})`;
    
    setChatLog((prevLog) => [
      ...prevLog,
      resultMessage,
    ]);
  
    setIsRollDiceModalOpen(false); // 주사위 모달 닫기
  };

  const removeRollDiceButtonFromLog = () => {
    setChatLog((prevLog) => prevLog.filter((log) => typeof log !== 'object' || !log.key === 'roll-dice-btn'));
  };

  useEffect(() => {
    if (diceResult1 && diceResult2 && raceList.length > 0) {
      const randomIndex = (diceResult1 + diceResult2 - 2) % raceList.length;
      setRace(raceList[randomIndex]);
    }
  }, [diceResult1, diceResult2, raceList]);

  useEffect(() => {
    if (diceResult3 && diceResult4 && jobList.length > 0) {
      const randomIndex = (diceResult3 + diceResult4 - 2) % jobList.length;
      setJob(jobList[randomIndex]);
    }
  }, [diceResult3, diceResult4, jobList]);

  useEffect(() => {
    if (diceResultStats1 && diceResultStats2 && diceResultStats3 && stats.str + stats.dex + stats.int + stats.hp === 0) {
      setStats({
        str : diceResultStats1 + gameData.raceStats[theme][race].str,
        dex : diceResultStats2 + gameData.raceStats[theme][race].dex,
        int : diceResultStats3 + gameData.raceStats[theme][race].int,
        hp : diceResultStats1 + diceResultStats2 + diceResultStats3 + gameData.raceStats[theme][race].hp,
      });
    }
  }, [diceResultStats1, diceResultStats2, diceResultStats3, stats]);

  return (
    <div className="App">
      {!isNicknameSet ? (
        <div className="nickname-setup">
          <h1>AI TRPG</h1>
          <h2>닉네임을 설정해주세요</h2>
          <input
            type="text"
            placeholder="닉네임을 입력하세요"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
          <button onClick={handleSetNickname}>설정하기</button>
          {/* <button onClick={() => testInput("안녕?")}>테스트</button> */}
        </div>
      ) : !isThemeSet ? (
        <div className="theme-setup">
          <h2>게임 주제를 선택해주세요</h2>
          <button onClick={() => handleSetTheme("판타지")}>판타지</button>
          <button onClick={() => handleSetTheme("미래 공상 과학")}>미래 공상 과학</button>
          <button onClick={() => handleSetTheme("공포")}>공포</button>
          <button onClick={() => handleSetTheme("탐정 미스터리")}>탐정 미스터리</button>
          <button onClick={() => handleSetTheme("해적 모험")}>해적 모험</button>
          <button onClick={() => handleSetTheme("중세 전쟁")}>중세 전쟁</button>
          <button onClick={() => handleSetTheme("신화와 전설")}>신화와 전설</button>
          <button onClick={() => handleSetTheme("좀비 아포칼립스")}>좀비 아포칼립스</button>
          <button onClick={() => handleSetTheme("일상")}>일상</button>
        </div>
      ) : !isDiceConfirmed ? (
        <div className="character-creation" style={{ textAlign: 'center', marginTop: '20px' }}>
          {theme === '탐정 미스터리' || theme === '중세 전쟁' || theme === '일상' ? (
            <>
              <h2>주제에 따라 종족은 "인간"으로 고정됩니다.</h2>
              <button onClick={() => {
                setRace('인간');
                setIsDiceConfirmed(true);
              }}>종족 선택 완료</button>
            </>
          ) : (
            <>
              <h2>캐릭터 종족을 생성하기 위해 주사위를 굴려주세요</h2>
              {!rolling && <button onClick={() => {
                if (rollDiceFunctionRef1.current) {
                  rollDiceFunctionRef1.current();
                }
                if (rollDiceFunctionRef2.current) {
                  rollDiceFunctionRef2.current();
                }
                setRolling(true);
              }}>종족 주사위 굴리기</button>}
              <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '20px', height: '300px' }}>
                <Canvas shadows camera={{ position: [0, 0, 10], fov: 50 }}>
                  <ambientLight intensity={0.3} />
                  <directionalLight
                    castShadow
                    position={[5, 5, 5]}
                    intensity={1}
                    shadow-mapSize-width={1024}
                    shadow-mapSize-height={1024}
                  />
                  <Dice position={[-2, 0, 0]} rollDiceFunctionRef={rollDiceFunctionRef1} setDiceResult={setDiceResult1} />
                  <Dice position={[2, 0, 0]} rollDiceFunctionRef={rollDiceFunctionRef2} setDiceResult={setDiceResult2} />
                </Canvas>
              </div>
              {race && (
                <div style={{ marginTop: '20px' }}>
                  <h2>당신의 종족은: "{race}" 입니다.</h2>
                  <button onClick={() => {
                    setIsDiceConfirmed(true);
                    setRolling(false);
                  }}>종족 선택 완료</button>
                </div>
              )}
            </>
          )}
        </div>
      ) : !isJobConfirmed ? (
        <div className="character-creation" style={{ textAlign: 'center', marginTop: '20px' }}>
          <h2>캐릭터 직업을 설정하기 위해 주사위를 굴려주세요.</h2>
          {!rolling && <button onClick={() => {
            if (rollDiceFunctionRef3.current) {
              rollDiceFunctionRef3.current();
            }
            if (rollDiceFunctionRef4.current) {
              rollDiceFunctionRef4.current();
            }
            setRolling(true);
          }}>직업 주사위 굴리기</button>}
          <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '20px', height: '300px' }}>
            <Canvas shadows camera={{ position: [0, 0, 10], fov: 50 }}>
              <ambientLight intensity={0.3} />
              <directionalLight
                castShadow
                position={[5, 5, 5]}
                intensity={1}
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
              />
              <Dice position={[-2, 0, 0]} rollDiceFunctionRef={rollDiceFunctionRef3} setDiceResult={setDiceResult3} />
              <Dice position={[2, 0, 0]} rollDiceFunctionRef={rollDiceFunctionRef4} setDiceResult={setDiceResult4} />
            </Canvas>
          </div>
          {job && (
            <div style={{ marginTop: '20px' }}>
              <h2>당신의 직업은: "{job}" 입니다.</h2>
              <button onClick={() => {
                setIsJobConfirmed(true);
                setRolling(false);
                }}>직업 선택 완료</button>
            </div>
          )}
        </div>
      ) : !isStatsConfirmed ? (
        <div className="character-creation" style={{ textAlign: 'center', marginTop: '20px' }}>
          <h2>캐릭터 스탯을 설정하기 위해 주사위를 굴려주세요.</h2>
          {!rolling && <button onClick={() => {
            if (rollDiceFunctionRefStats1.current) {
              rollDiceFunctionRefStats1.current();
            }
            if (rollDiceFunctionRefStats2.current) {
              rollDiceFunctionRefStats2.current();
            }
            if (rollDiceFunctionRefStats3.current) {
              rollDiceFunctionRefStats3.current();
            }
            setRolling(true);
          }}>스탯 주사위 굴리기</button>}
          <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '20px', height: '300px' }}>
            <Canvas shadows camera={{ position: [0, 0, 10], fov: 50 }}>
              <ambientLight intensity={0.3} />
              <directionalLight
                castShadow
                position={[5, 5, 5]}
                intensity={1}
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
              />
              <Dice position={[-4, 0, 0]} rollDiceFunctionRef={rollDiceFunctionRefStats1} setDiceResult={setDiceResultStats1} />
              <Dice position={[0, 0, 0]} rollDiceFunctionRef={rollDiceFunctionRefStats2} setDiceResult={setDiceResultStats2} />
              <Dice position={[4, 0, 0]} rollDiceFunctionRef={rollDiceFunctionRefStats3} setDiceResult={setDiceResultStats3} />
            </Canvas>
          </div>
          {stats.str + stats.dex + stats.int + stats.hp > 0 && (
            <div style={{ marginTop: '20px' }}>
              <h2>당신의 스탯은 [힘 : {stats.str}, 민첩 : {stats.dex}, 지능 : {stats.int}, 체력 : {stats.hp}] 입니다.</h2>
              <button onClick={() => {setIsStatsConfirmed(true); preferencesUserInput(); setRolling(false);}}>스탯 설정 완료</button>
            </div>
          )}
        </div>
      ) : (
        <>
          <header className="header">
            <h2>AI TRPG</h2>
          </header>
          <div className="App" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            {/* 스킬 창 */}
            <div className="custom-display" style={{ flex: 1, marginRight: '20px', marginTop: '20px', textAlign: 'center' }}>
              <h3>스킬 창</h3>
              <div style={{ maxHeight: '380px', width: '180px', textAlign: 'center', border: '1px solid white', overflowY: 'auto', borderRadius: '8px' }}>
                <ul style={{ color: '#fff', listStyleType: 'none', padding: 0 }}>
                  {gameData.raceSkills[theme] && gameData.raceSkills[theme][race] && gameData.raceSkills[theme][race].map((skill, index) => (
                    <li key={index}>{skill}</li>
                  ))}
                  {gameData.jobSkills[theme] && gameData.jobSkills[theme][job] && gameData.jobSkills[theme][job].map((skill, index) => (
                    <li key={index}>{skill}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 채팅 창 */}
            <div style={{ flex: 3 }}>
              <div className={`custom-display ${storyVisible ? 'visible' : 'hidden'}`} 
                style={{ margin: '20px auto 0 auto',  height: '40vh', overflowY: 'auto', padding: '10px', border: '1px solid white', backgroundColor: '#222', borderRadius: '8px', width: '600px' }} ref={chatLogRef}>
                {chatLog.map((line, index) => {
                  // React 요소인 경우 그대로 렌더링
                  if (React.isValidElement(line)) {
                    return <div key={index}>{line}</div>;
                  }

                  // 문자열인 경우 처리
                  if (typeof line === 'string') {
                    return (
                      <div
                        key={index}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          marginBottom: '10px',
                        }}
                      >
                        {line.startsWith('기본설명:') ? (
                          <div
                            style={{
                              backgroundColor: '#999',
                              color: 'black',
                              padding: '10px',
                              borderRadius: '8px',
                              maxWidth: '60%',
                              textAlign: 'left',
                            }}
                          >
                            <strong>{line.split(': ')[1]}:</strong>
                            <div
                              dangerouslySetInnerHTML={{
                                __html: line.split(': ').slice(2).join(': ').replace(/\.{3}$/, '').replace(/\./g, '.<br />'),
                              }}
                            />
                          </div>
                        ) : line.startsWith('시스템:') ? (
                          <div
                            style={{
                              backgroundColor: '#555',
                              color: 'white',
                              padding: '10px',
                              borderRadius: '8px',
                              maxWidth: '60%',
                              textAlign: 'left',
                            }}
                          >
                            <strong>시스템:</strong>
                            <div
                              dangerouslySetInnerHTML={{
                                __html: line.slice(4).replace(/\./g, '.<br />'),
                              }}
                            />
                          </div>
                        ) : line.startsWith('주사위 결과:') ? (
                          <div
                            style={{
                              backgroundColor: '#4caf50',
                              color: 'white',
                              padding: '10px',
                              borderRadius: '8px',
                              maxWidth: '60%',
                              marginLeft: 'auto',
                            }}
                          >
                            <strong>결과:</strong> {line.slice(7)}
                          </div>
                        ) : (
                          <div
                            style={{
                              backgroundColor: '#007bff',
                              color: 'white',
                              padding: '10px',
                              borderRadius: '8px',
                              maxWidth: '60%',
                              marginLeft: 'auto',
                            }}
                          >
                            <strong>{nickname}:</strong> {line.slice(nickname.length + 2)}
                          </div>
                        )}
                      </div>
                    );
                  }

                  // 처리되지 않은 데이터는 무시
                  return null;
                })}
              </div>
            </div>

            {/* 스탯 테이블 */}
            <div className="stats-display" style={{ flex: 1, marginLeft: '20px', marginTop: '20px', textAlign: 'center' }}>
              <h3>상태 창</h3>
              <table style={{ borderCollapse: 'collapse' }}>
                <tbody>
                  <tr>
                    <th style={{ border: '1px solid white', padding: '8px' }}>닉네임</th>
                    <td style={{ border: '1px solid white', padding: '8px' }} width={'80px'}>{nickname}</td>
                  </tr>
                  <tr>
                    <th style={{ border: '1px solid white', padding: '8px' }}>종족</th>
                    <td style={{ border: '1px solid white', padding: '8px' }}>{race}</td>
                  </tr>
                  <tr>
                    <th style={{ border: '1px solid white', padding: '8px' }}>직업</th>
                    <td style={{ border: '1px solid white', padding: '8px' }}>{job}</td>
                  </tr>
                  <tr>
                    <th style={{ border: '1px solid white', padding: '8px' }}>힘</th>
                    <td style={{ border: '1px solid white', padding: '8px' }}>{stats.str}</td>
                  </tr>
                  <tr>
                    <th style={{ border: '1px solid white', padding: '8px' }}>민첩</th>
                    <td style={{ border: '1px solid white', padding: '8px' }}>{stats.dex}</td>
                  </tr>
                  <tr>
                    <th style={{ border: '1px solid white', padding: '8px' }}>지능</th>
                    <td style={{ border: '1px solid white', padding: '8px' }}>{stats.int}</td>
                  </tr>
                  <tr>
                    <th style={{ border: '1px solid white', padding: '8px' }}>체력</th>
                    <td style={{ border: '1px solid white', padding: '8px' }}>{stats.hp}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="user-input">
          <input style={{width: '490px'}}
            type="text"
            placeholder="당신의 행동을 입력하세요"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleUserInput(inputValue);
                setInputValue('');
              }
            }}
          />
          <button onClick={() => {
            handleUserInput(inputValue);
            setInputValue('');
          }}>행동하기</button>
          </div>
          <div className="user-actions" style={{ marginTop: '20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h3>유저 행동 예시:</h3>
            {userActionExamples && userActionExamples.map((example, index) => (
              <button key={index} style={{ margin: '5px', padding: '10px', backgroundColor: '#444', color: 'white', border: 'none', borderRadius: '5px', width: '600px' }}
                onClick={() => {
                  handleUserInput(example);
                }}>
                {example}
              </button>
            ))}
          </div>

          {isRollDiceModalOpen && (
            <div
              className="dice-modal"
              style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: '#fff',
                padding: '20px',
                borderRadius: '10px',
                boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.3)',
                color: 'gray',
              }}
            >
              <h3>{relevantStat}을 확인합니다.</h3>
              <h3>
                주사위 수가{' '}
                {(() => {
                  if (relevantStat === '힘') return `당신의 힘(${stats.str})보다 작거나 같아야 합니다.`;
                  if (relevantStat === '민첩') return `당신의 민첩(${stats.dex})보다 작거나 같아야 합니다.`;
                  if (relevantStat === '지능') return `당신의 지능(${stats.int})보다 작거나 같아야 합니다.`;
                  return '올바른 스탯을 확인할 수 없습니다.';
                })()}
              </h3>
              <h3>주사위를 굴려주세요.</h3>
              <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '20px', height: '300px' }}>
                <Canvas shadows camera={{ position: [0, 0, 10], fov: 50 }}>
                  <ambientLight intensity={0.3} />
                  <directionalLight
                    castShadow
                    position={[5, 5, 5]}
                    intensity={1}
                    shadow-mapSize-width={1024}
                    shadow-mapSize-height={1024}
                  />
                  <Dice
                    position={[-4, 0, 0]}
                    rollDiceFunctionRef={rollDiceFunctionRamdomStats1}
                    setDiceResult={setDiceRamdomResultStats1}
                  />
                  <Dice
                    position={[0, 0, 0]}
                    rollDiceFunctionRef={rollDiceFunctionRamdomStats2}
                    setDiceResult={setDiceRamdomResultStats2}
                  />
                  <Dice
                    position={[4, 0, 0]}
                    rollDiceFunctionRef={rollDiceFunctionRamdomStats3}
                    setDiceResult={setDiceRamdomResultStats3}
                  />
                </Canvas>
              </div>
              {!rolling && !isResultConfirmed && (
                <button
                  onClick={() => {
                    if (rollDiceFunctionRamdomStats1.current) {
                      rollDiceFunctionRamdomStats1.current();
                    }
                    if (rollDiceFunctionRamdomStats2.current) {
                      rollDiceFunctionRamdomStats2.current();
                    }
                    if (rollDiceFunctionRamdomStats3.current) {
                      rollDiceFunctionRamdomStats3.current();
                    }
                    setRolling(true);
                  }}
                >
                  주사위 굴리기
                </button>
              )}
              {setDiceRamdomResult1 + setDiceRamdomResult2 + setDiceRamdomResult3 > 0 && !isResultConfirmed && (
                <div style={{ marginTop: '20px' }}>
                  <h2>결과: 주사위의 합은 {setDiceRamdomResult1 + setDiceRamdomResult2 + setDiceRamdomResult3} 입니다.</h2>
                  {(() => {
                    // relevantStat에 따라 스탯 계산
                    const diceSum = setDiceRamdomResult1 + setDiceRamdomResult2 + setDiceRamdomResult3;
                    let success = false;

                    if (relevantStat === '힘') {
                      success = diceSum <= stats.str;
                    } else if (relevantStat === '민첩') {
                      success = diceSum <= stats.dex;
                    } else if (relevantStat === '지능') {
                      success = diceSum <= stats.int;
                    }

                    return (
                      <>
                        {success ? (
                          <p style={{ color: 'green' }}>성공! {relevantStat} 체크를 통과했습니다!</p>
                        ) : (
                          <p style={{ color: 'red' }}>실패... {relevantStat} 체크에 실패했습니다.</p>
                        )}
                        <button
                          onClick={() => {
                            setIsResultConfirmed(true); // 결과 확인 상태 업데이트
                            setRolling(false); // 주사위 롤링 상태 초기화
                            addDiceResultToLog(setDiceRamdomResult1, setDiceRamdomResult2, setDiceRamdomResult3, relevantStat, success); // success 전달
                            removeRollDiceButtonFromLog(); // 로그창에서 버튼 제거
                            continueStory(setDiceRamdomResult1, setDiceRamdomResult2, setDiceRamdomResult3, relevantStat, success);
                            setIsRollDiceModalOpen(false); // 모달 닫기
                          }}
                        >
                          확인
                        </button>
                      </>
                    );
                  })()}
                </div>
              )}
              {isResultConfirmed && (
                <div style={{ marginTop: '20px' }}>
                  <h2>최종 결과: 주사위의 합은 {setDiceRamdomResult1 + setDiceRamdomResult2 + setDiceRamdomResult3} 입니다.</h2>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}