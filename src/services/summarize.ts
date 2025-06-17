import {VertexAI, HarmBlockThreshold, HarmCategory} from '@google-cloud/vertexai'

const project = 'quick-keel-462020-m3'
const location = 'us-central1'
const textModel = 'gemini-2.5-flash-preview-05-20';

const vertexAI = new VertexAI({
  project: project,
  location: location,
})

interface Bookmark {
  title: string,
  url:string
}


export async function summarize(bookmarks:Bookmark[]) {
  const generativeModel = vertexAI.preview.getGenerativeModel({
  model:textModel,
  safetySettings: [
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    }
  ],
  generationConfig: {maxOutputTokens: 65535},
  systemInstruction: {
    role:'system',
    parts:[{'text': `You are a brilliant podcast script generator who has numerous hit podcast episodes. 
      Create a podcast script summarizing the list of links provided to you. Use tags like [S1] and [S2] for specifying the speakers and use
      non-verbal tags like - (laughs), (clears throat), (sighs), (gasps), (coughs), (singing), (sings), (mumbles), (beep), (groans), (sniffs), (claps), (screams), (inhales), (exhales), (applause), (burps), (humming), (sneezes), (chuckle), (whistles)
      wherever necessary
      An example output is - "[S1] Dia is an open weights text to dialogue model. [S2] You get full control over scripts and voices. [S1] Wow. Amazing. (laughs) [S2] Try it now on Git hub or Hugging Face."
      Create fun and interesting scripts that the user would love listening to.`}]
  },
})
const googleSearch = {
  googleSearchRetrieval: {
    disableAttribution: false
  }
}
  const formattedBookmarks = bookmarks.map((b)=> ` - ${b.title} (${b.url})`)
  const prompt = `Here is the list of bookmarks - ${formattedBookmarks}`
  const request = {
    contents: [{role:'user', parts: [{text: prompt}]}]
  }
  const result = await generativeModel.generateContent(request)
  const response = result.response
  console.log('Response: ', JSON.stringify(response))
  return response
}