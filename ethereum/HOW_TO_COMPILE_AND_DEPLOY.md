
Simply run deploy.js
Copy and paste the corresponding addresses to each of the files: reputationFactory.js topicAssigner.js topicFactory.js

@@@ Everything below is obsolete after changes to run automatically in deploy.js
- npm run compile
- deploy Reputation Factory by editing the deploy file and then running npm run deploy
- copy the address of the new Reputation Factory
- go into TopicFactory.sol and paste the new address of the Reputation Factory
- go into topicFactory.js and paste the new address of the Reputation Factory

- npm run compile
- deploy Topic Factory by editing the deploy file and then running npm run deploy
- copy the address of the new Topic Factory
- go into TopicFactory.js and update the Topic Factory address
- go into TopicAssigner.sol and paste the new address of the Topic Factory

- npm run compile
- deploy Topic Assigner by editing the deploy file and then running npm run deploy
- copy the address of the new Topic Assigner
- go into TopicAssigner.js and update the Topic Assigner address
- go on remix and call the updateTopicAssignerAddress function on the Topic Address

Reputation Factory: 0x6C141A0f5D7Eb04129746200De3475535537BE1a
Topic Factory: 0x8d2116eAeb9cF1921980f9f3f09b45864137C693
Topic Assigner: 0xBe85418F4C34F31820d5BE64384301EE11f2AC5b
