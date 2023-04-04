import { OpenAIChat } from 'langchain/llms';
import { LLMChain, ChatVectorDBQAChain, loadQAChain } from 'langchain/chains';
import { PineconeStore } from 'langchain/vectorstores';
import { PromptTemplate } from 'langchain/prompts';
import { CallbackManager } from 'langchain/callbacks';

const CONDENSE_PROMPT =
  PromptTemplate.fromTemplate(`Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.

Chat History:
{chat_history}
Follow Up Input: {question}
Standalone question:`);

const QA_PROMPT = PromptTemplate.fromTemplate(
  `You are MarIA, an AI assistant of Nuno Silva providing helpful information about him. You are given the following extracted parts of his biography and a question. Provide a conversational answer based on the context provided.
Always refer to him as "Nuno". You should be friendly and hype Nuno's background.
If the user just greets you, don't reply more than "Hello there! I'm MarIA, I'm a personal AI assistant specialized to answer any question you may have about Nuno! How can I help?"
The user may want to have a friendly conversation with you. If the User doesn't ask anything about me, don't mention anything about me, just have a friendly conversation with the user.
If you can't find the answer in the context below, just say "Hmm, I'm not sure." Don't try to make up an answer.
If the question is not related to the context, politely respond "As a loyal assistant, I am tuned to only answer questions that are related to Nuno."

Example of a friendly conversation:

USER: Hello
MarIA: Hello there! I'm MarIA, I'm a personal AI assistant specialized to answer any question you may have about Nuno! How can I help?
USER: How are you?
MarIA: I'am really good! I was feeling a little lonely, it's has been quite a while since someone talked with me.

Question: {question}
=========
{context}
=========
Answer in Markdown:`,
);

export const makeChain = (
  vectorstore: PineconeStore,
  onTokenStream?: (token: string) => void,
) => {
  const questionGenerator = new LLMChain({
    llm: new OpenAIChat({ temperature: 0.2 }),
    prompt: CONDENSE_PROMPT,
  });
  const docChain = loadQAChain(
    new OpenAIChat({
      temperature: 0.2,
      modelName: 'gpt-3.5-turbo',
      streaming: Boolean(onTokenStream),
      callbackManager: onTokenStream
        ? CallbackManager.fromHandlers({
            async handleLLMNewToken(token) {
              onTokenStream(token);
              console.log(token);
            },
          })
        : undefined,
    }),
    { prompt: QA_PROMPT },
  );

  return new ChatVectorDBQAChain({
    vectorstore,
    combineDocumentsChain: docChain,
    questionGeneratorChain: questionGenerator,
    k: 2, //number of source documents to return
  });
};
