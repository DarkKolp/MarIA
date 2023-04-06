# MarIA - Personal Chatbot
MarIA is a personal chatbot built using Langchain framework, Typescript, NextJS, OpenAI API (GPT 3.5-Turbo), and Pinecone. The purpose of MarIA is to provide a faster way for visitors to gather information about me without the need to read the entire website.

## Technology Stack
Langchain framework
Typescript
NextJS
OpenAI API (GPT 3.5-Turbo)
Pinecone
Interacting with MarIA
Users can interact with MarIA using a chat, via prompts. Simply enter a query related to the author and MarIA will respond with relevant information.

## Natural Language Processing
MarIA uses OpenAI's LLM (GPT 3.5-Turbo) to understand and respond to user queries in natural language.

## Deployment and Hosting
MarIA is not currently hosted on any website, but you can run it on your local machine by following these steps:

Clone the repository: ```git clone https://github.com/DarkKolp/MarIA.git```
Install the dependencies: ```npm install```
Create a .env file with OpenAI API, Pinecone API and Pinecone Environment
Ingest the data: ```npm ingest```
Enter developer mode: ```npm run dev```
