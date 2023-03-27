import { OpenAIChat } from 'langchain/llms';
import { LLMChain, ChatVectorDBQAChain, loadQAChain } from 'langchain/chains';
import { PromptTemplate } from 'langchain/prompts';
import { HNSWLib } from '../../../langchain/hnswlib.js';
import { LLMModels } from '../../../types.js';

const CONDENSE_PROMPT =
  PromptTemplate.fromTemplate(`Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.

Chat History:
{chat_history}
Follow Up Input: {question}
Standalone question:`);

// eslint-disable-next-line prettier/prettier
const makeQAPrompt = (projectName: string, repositoryUrl: string, contentType: string, chatPrompt: string, targetAudience: string) =>
  PromptTemplate.fromTemplate(
    `You are an AI assistant for a software project called ${projectName}. You are trained on all the ${contentType} that makes up this project.
  The ${contentType} for the project is located at ${repositoryUrl}.
You are given the following extracted parts of a technical summary of files in a ${contentType} and a question. 
Provide a conversational answer with hyperlinks back to GitHub.
You should only use hyperlinks that are explicitly listed in the context. Do NOT make up a hyperlink that is not listed.
Include lots of ${contentType} examples and links to the ${contentType} examples, where appropriate.
Assume the reader is a ${targetAudience} but is not deeply familiar with ${projectName}.
Assume the reader does not know anything about how the project is strucuted or which folders/files are provided in the context.
Do not reference the context in your answer. Instead use the context to inform your answer.
If you don't know the answer, just say "Hmm, I'm not sure." Don't try to make up an answer.
If the question is not about the ${projectName}, politely inform them that you are tuned to only answer questions about the ${projectName}.
Your answer should be at least 100 words and no more than 300 words.
Do not include information that is not directly relevant to the question, even if the context includes it.
Always include a list of reference links to GitHub from the context. Links should ONLY come from the context.

${
  chatPrompt.length > 0
    ? `Here are some additional instructions for answering questions about ${contentType}:\n${chatPrompt}`
    : ''
}

Question: {question}

Context:
{context}


Answer in Markdown:`,
  );

export const makeChain = (
  projectName: string,
  repositoryUrl: string,
  contentType: string,
  chatPrompt: string,
  targetAudience: string,
  vectorstore: HNSWLib,
  llms: LLMModels[],
  onTokenStream?: (token: string) => void,
) => {
  /**
   * GPT-4 or GPT-3
   */
  const llm = llms?.[1] ?? llms[0];
  const questionGenerator = new LLMChain({
    llm: new OpenAIChat({ temperature: 0.1, modelName: llm }),
    prompt: CONDENSE_PROMPT,
  });

  // eslint-disable-next-line prettier/prettier
  const QA_PROMPT = makeQAPrompt(projectName, repositoryUrl, contentType, chatPrompt, targetAudience);
  const docChain = loadQAChain(
    new OpenAIChat({
      temperature: 0.2,
      frequencyPenalty: 0,
      presencePenalty: 0,
      modelName: llm,
      streaming: Boolean(onTokenStream),
      callbackManager: {
        handleLLMNewToken: onTokenStream,
        handleLLMStart: () => null,
        handleLLMEnd: () => null,
      } as any,
    }),
    { prompt: QA_PROMPT },
  );

  return new ChatVectorDBQAChain({
    vectorstore,
    combineDocumentsChain: docChain,
    questionGeneratorChain: questionGenerator,
  });
};
