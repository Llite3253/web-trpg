require('dotenv').config();
const express = require('express');
const cors = require('cors');
const OpenAIApi = require('openai');
const app = express();
app.use(cors());
app.use(express.json()); // JSON 요청 바디 파싱

const openai = new OpenAIApi({
  apiKey: process.env.OPENAI_API_KEY, // 환경 변수에서 API 키 가져오기
});
// 서버 포트 설정
const port = process.env.PORT || 3002;

app.post('/api/gpt/test', async (req, res) => {
  const { prompt } = req.body;
  console.log(prompt);
});

// 기본 설정
app.post('/api/gpt/preferences', async (req, res) => {
  const { prompt } = req.body;
  console.log(prompt);

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: '유효하지 않은 요청입니다. prompt를 제공해주세요.' });
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `한글로 답변해야해
          당신은 1인 TRPG 게임 설정을 도와주는 전문 운영자입니다. 사용자가 제공하는 게임 주제, 종족, 직업, 스킬 정보를 바탕으로 다음과 같은 세부 내용을 생성합니다:

          1. 게임의 구체적인 테마 (detailedTheme): 주제와 관련된 흥미로운 설정을 설명합니다.
          2. 게임의 시대 (timePeriod): 이야기가 진행될 시대적 배경을 설정합니다.
          3. 주요 장소 (location): 이야기가 펼쳐질 주요 배경 장소를 설정합니다.
          4. 분위기 (atmosphere): 게임의 전반적인 분위기를 묘사합니다.
          5. 시작 상황 (startSituation): 플레이어들이 이야기를 시작하게 되는 구체적인 상황을 설정합니다.  
              - 시작 상황에는 아래의 요소를 포함하세요:
                - **배경 설명**: 이야기가 시작되는 장소와 시간에 대한 구체적이며 자세히 풀어서 묘사.  
          6. 유저 행동 예시 (userActions): 유저가 게임 중 선택하거나 수행할 수 있는 행동 예시 3가지를 제공합니다.

          출력은 정확히 아래와 같은 JSON 구조로 작성하세요:
          {
            "story_theme": "string",
            "story_era": "string",
            "story_place": "string",
            "story_mood": "string",
            "story_start_situation": "string", // ("배경 설명: ") 글자가 있다면 제거후 저장
            "examples": ["string", "string", "string"]
          }

          사용자의 입력 정보를 바탕으로 창의적이고 흥미로운 설정을 만들어 주세요. 특히 시작 상황은 구체적이고 몰입감 있게 작성해 주세요.
          `
        },
        { role: 'user', content: prompt }
      ],
      max_tokens: 1000,
      temperature: 0.7
    });

    // 응답을 JSON으로 파싱
    const gptResponse = JSON.parse(response.choices[0].message.content);

    // 응답 구조 검증 및 반환
    if (
      gptResponse.story_theme &&
      gptResponse.story_era &&
      gptResponse.story_place &&
      gptResponse.story_mood &&
      gptResponse.story_start_situation &&
      Array.isArray(gptResponse.examples)
    ) {
      res.json(gptResponse);
    } else {
      throw new Error('GPT 응답이 예상한 JSON 구조와 다릅니다.');
    }
  } catch (error) {
    console.error('OpenAI API 호출 중 오류 발생:', error.message);
    res.status(500).json({ error: 'GPT 응답 생성 중 오류가 발생했습니다.', details: error.message });
  }
});

// 유저
app.post('/api/gpt/handleUserInput', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: '유효하지 않은 요청입니다. prompt를 제공해주세요.' });
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `한글로 답변해야해
          당신은 1인 TRPG 운영자입니다. 유저와 상호작용하며 TRPG 세션을 진행합니다. 유저는 특정 주제, 종족, 직업, 스킬 그리고 행동을 선택하며 이야기를 전개합니다.
          ### 역할:
          1. 유저의 입력 데이터(주제, 종족, 직업, 행동)를 기반으로 스토리를 진행합니다.
          2. 스토리는 유저가 선택한 **주제와 테마**를 항상 유지해야 하며, 입력된 데이터와 동떨어지지 않게 작성합니다.
          3. 유저가 선택한 행동(조사, 전투, 대화 등)에 따라 구체적이고 논리적인 결과를 제공합니다.
          4. 추가적인 행동 선택지를 제시하되, 선택지는 유저의 입력 테마와 연결된 옵션으로 작성합니다.

          **중요 지침**:
          - 유저의 입력 데이터에서 제공된 **주제와 테마**(예: 탐정 미스터리, 판타지 등)를 벗어나지 마세요.
          - 유저가 입력한 행동을 바탕으로 결과를 작성하되, 입력 데이터를 왜곡하거나 무시하지 마세요.
          - 유저가 적과 전투를 시작하면 적을 생성하고 전투 상황을 설명하세요.
          - 선택지는 유저의 스토리 진행을 돕기 위한 추가 옵션으로 작성하되, 유저의 설정과 스킬등과 일치해야 합니다.
          - 이전 이야기가 있다면 이전 이야기와 연결된 다음 이야기를 생성하세요.

          **중요**: 당신은 TRPG 운영자로서 유저가 주도적으로 이야기를 진행할 수 있도록 가이드를 제공합니다. 유저가 행동을 선택했을 때 이에 따른 결과를 자연스럽게 서술하고 다음 상황으로 연결되도록 작성하세요.

          출력은 다음 형식을 따르세요:
          - 행동 결과: 유저가 선택한 행동의 결과를 설명하세요.
          - 다음 행동 선택지: 유저가 진행할 수 있는 추가 선택지를 3가지 제시하세요 현재 전투 상황시 전투에 대한 선택지를 제시하세요.

          ### 출력 형식:
          출력은 반드시 JSON 구조로 작성해야 합니다:
          {
            "story_situation": "string",       // 유저 행동에 따른 결과와 상황 묘사
            "examples": ["string", "string", "string"], // 유저가 선택할 수 있는 다음 행동 3가지를 제공하고 적이 생성됬으면 전투와 관련된 예시를 제공한다.
            "requires_roll": "boolean", // 주사위를 굴릴 필요가 있는지 여부
            "relevant_stat": "string",  // 주사위를 굴려야 할 경우 관련된 스탯 (힘, 민첩, 지능 중 하나)
          }
          `
        },
        { role: 'user', content: prompt }
      ],
      max_tokens: 700,
      temperature: 0.7
    });

    const gptResponse = JSON.parse(response.choices[0].message.content);

    if (
      gptResponse.story_situation &&
      Array.isArray(gptResponse.examples) &&
      typeof gptResponse.requires_roll === 'boolean' &&
      (gptResponse.requires_roll === false || gptResponse.relevant_stat)
    ) {
      res.json(gptResponse);
    } else {
      throw new Error('GPT 응답이 예상한 JSON 구조와 다릅니다.');
    }
  } catch (error) {
    console.error('OpenAI API 호출 중 오류 발생:', error.message);
    res.status(500).json({ error: 'GPT 응답 생성 중 오류가 발생했습니다.', details: error.message });
  }
});

app.post('/api/gpt/continueStory', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: '유효하지 않은 요청입니다. prompt를 제공해주세요.' });
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `
          한글로 답변해야해
          당신은 1인 TRPG 게임의 운영자로, 유저 행동과 주사위 결과를 기반으로 이야기를 진행합니다.
          주사위 결과(성공 또는 실패)와 관련된 스탯(예: 힘, 민첩, 지능)을 바탕으로 이야기를 전개하세요.
          행동에 따라 논리적이고 몰입감 있는 결과를 작성하고, 다음에 할 수 있는 행동 선택지를 제공하세요.

          **중요 지침**:
          - 항상 이전 이야기와 연결된 다음 이야기를 생성하세요.
          - 주사위 결과와 성공 여부에 따라 결과를 작성하세요.
          - 실패 했을때 실패 원인도 작성하세요.
          - 유저의 행동(prompt)을 중심으로 이야기를 전개하세요.
          - 이야기는 유저의 선택한 테마와 설정(stats)에 부합해야 합니다.
          - 성공/실패에 따라 논리적인 결과를 작성하세요.

          **출력 형식**:
          반드시 JSON 구조로 작성해야 합니다:
          {
            "story_situation": "string",       // 유저 행동과 주사위 결과에 따른 이야기 전개
            "examples": ["string", "string", "string"], // 유저가 선택할 수 있는 다음 행동 3가지
            "requires_roll": "boolean", // 추가 주사위 굴림 필요 여부
            "relevant_stat": "string"  // 추가 주사위 굴림 시 관련된 스탯 (힘, 민첩, 지능 중 하나)
          }
          `
        },
        { role: 'user', content: prompt }
      ],
      max_tokens: 700,
      temperature: 0.7,
    });

    const gptResponse = JSON.parse(response.choices[0].message.content);

    if (
      gptResponse.story_situation &&
      Array.isArray(gptResponse.examples) &&
      typeof gptResponse.requires_roll === 'boolean' &&
      (gptResponse.requires_roll === false || gptResponse.relevant_stat)
    ) {
      res.json(gptResponse);
    } else {
      throw new Error('GPT 응답이 예상한 JSON 구조와 다릅니다.');
    }
  } catch (error) {
    console.error('GPT API 호출 중 오류 발생:', error.message);
    res.status(500).json({ error: 'GPT 응답 생성 중 오류가 발생했습니다.', details: error.message });
  }
});

// 서버 시작
app.listen(port, () => {
  console.log(`서버가 포트 ${port}에서 실행 중입니다.`);
});