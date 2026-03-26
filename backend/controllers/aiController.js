import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import Course from "../models/courseModel.js";
dotenv.config();


export const searchWithAi = async (req,res) => {

    try {
         const { input } = req.body;
     
    if (!input) {
      return res.status(400).json({ message: "Search query is required" });
    }
 // case-insensitive
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });
const prompt=`You are an intelligent assistant for an LMS platform. A user will type any query about what they want to learn. Your task is to understand the intent and return one **most relevant keyword** from the following list of course categories and levels:

- App Development  
- AI/ML  
- AI Tools  
- Data Science  
- Data Analytics  
- Ethical Hacking  
- UI UX Designing  
- Web Development  
- Others  
- Beginner  
- Intermediate  
- Advanced  

Only reply with one single keyword from the list above that best matches the query. Do not explain anything. No extra text.

Query: ${input}
`

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents:prompt,
  });
  const keyword=  response.candidates?.[0]?.content?.parts?.[0]?.text || "";
  keyword = keyword.replace(/[^a-zA-Z ]/g, "").trim();
    const courses = await Course.find({
      isPublished: true,
     $or: [
    { title: { $regex: input, $options: 'i' } },
    { subTitle: { $regex: input, $options: 'i' } },
    { description: { $regex: input, $options: 'i' } },
    { category: { $regex: input, $options: 'i' } },
    { level: { $regex: input, $options: 'i' } }
  ]
    });

    if(courses.length > 0){
    return res.status(200).json(courses);
    }else{
       const courses = await Course.find({
      isPublished: true, 
     $or: [  
    { title: { $regex: keyword, $options: 'i' } },
    { subTitle: { $regex: keyword, $options: 'i' } },
    { description: { $regex: keyword, $options: 'i' } },
    { category: { $regex: keyword, $options: 'i' } },
    { level: { $regex: keyword, $options: 'i' } }
  ]
    });
       return res.status(200).json(courses);
    }


    } catch (error) {
        console.log(error)
    }
}






// import { GoogleGenAI } from "@google/genai";
// import dotenv from "dotenv";
// import Course from "../models/courseModel.js";

// dotenv.config();

// export const searchWithAi = async (req, res) => {
//   try {
//     const { input } = req.body;

//     if (!input) {
//       return res.status(400).json({ message: "Search query is required" });
//     }

//     // ✅ FIX 1: pass API key
//     const ai = new GoogleGenAI({
//       apiKey: process.env.GEMINI_API_KEY,
//     });

//     const prompt = `You are an intelligent assistant for an LMS platform. A user will type any query about what they want to learn. Your task is to understand the intent and return one **most relevant keyword** from the following list of course categories and levels:

// - App Development  
// - AI/ML  
// - AI Tools  
// - Data Science  
// - Data Analytics  
// - Ethical Hacking  
// - UI UX Designing  
// - Web Development  
// - Others  
// - Beginner  
// - Intermediate  
// - Advanced  

// Only reply with one single keyword from the list above that best matches the query. Do not explain anything. No extra text.

// Query: ${input}
// `;

//     const response = await ai.models.generateContent({
//       model: "gemini-2.5-flash",
//       contents: prompt,
//     });

//     // ✅ FIX 2: correct response parsing
//     let keyword =
//       response.candidates?.[0]?.content?.parts?.[0]?.text || "";

//     // ✅ FIX 3: clean keyword
//     keyword = keyword.replace(/[^a-zA-Z ]/g, "").trim();

//     const courses = await Course.find({
//       isPublished: true,
//       $or: [
//         { title: { $regex: input, $options: "i" } },
//         { subTitle: { $regex: input, $options: "i" } },
//         { description: { $regex: input, $options: "i" } },
//         { category: { $regex: input, $options: "i" } },
//         { level: { $regex: input, $options: "i" } },
//       ],
//     });

//     if (courses.length > 0) {
//       return res.status(200).json(courses);
//     } else {
//       const courses = await Course.find({
//         isPublished: true,
//         $or: [
//           { title: { $regex: keyword, $options: "i" } },
//           { subTitle: { $regex: keyword, $options: "i" } },
//           { description: { $regex: keyword, $options: "i" } },
//           { category: { $regex: keyword, $options: "i" } },
//           { level: { $regex: keyword, $options: "i" } },
//         ],
//       });

//       return res.status(200).json(courses);
//     }
//   } catch (error) {
//     console.log(error);

//     // ✅ FIX 4: send error response
//     return res.status(500).json({ message: "Server Error" });
//   }
// };