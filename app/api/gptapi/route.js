import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req, res) {
  const body = await req.json();
  const { gender, date, calendartype, time } = body;

  function formatDate(dateStr) {
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);

    return `${year}년 ${month}월 ${day}일 0분`;
  }

  const formattedDate = formatDate(date);
  const questions = [
    `${calendartype} ${formattedDate} ${time} 출생 ${gender}의 사주를 알려줘.`,
    `${calendartype} ${formattedDate} ${time} 출생 ${gender}인   나의 오행기운을  금(金):n개 목(木):n개  수(水):n개  화(火):n개  토(土):n개 이런식으로 아무 대답도 설명도 하지말고 갯수만 적어줘. 0개인 경우도 적어줘.형식에 변화는 주지말고 저 오행단어는 그대로 써줘 `,
    `${calendartype} ${formattedDate} ${time} 출생 ${gender}인   나의 인연 오행기운을  금(金):n개 목(木):n개  수(水):n개  화(火):n개  토(土):n개 이런식으로 아무 대답도 설명도 하지말고 갯수만 적어줘. 0개인 경우도 적어줘.형식에 변화는 주지말고 저 오행단어는 그대로 써줘 `,
  ];

  try {
    const responses = await Promise.all(
      questions.map(async (question) => {
        const chatCompletion = await openai.chat.completions.create({
          messages: [{ role: "user", content: question }],
          model: "gpt-3.5-turbo-0125",
        });
        return chatCompletion.choices[0].message.content;
      })
    );

    return Response.json({
      fortune: responses[0],
      myelement: responses[1],
      yourelement: responses[2],
    });
  } catch (error) {
    console.error("OpenAI API error:", error);
    return Response.json({ error: "Error accessing OpenAI API" });
  }
}
