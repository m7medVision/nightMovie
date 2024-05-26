### NighMovie
NighMovie is Open Source project that allows to get suggestions for movies based on the user's movies ratings. This project is based on Google LLM's (gemini) model.

### Installation
To install the project you need to install [Node.js](https://nodejs.org/en/). After that you can run the following commands:
```bash
npm install
```
Then, edit the .env file and add the following variables:
```bash
DATABASE_URI=mongodb://127.0.0.1/payload-template-blank-3-0
PAYLOAD_SECRET=YOUR_SECRET_HERE
GOOGLE_GEN_AI_API_KEY=HERE_API
```
To run the project you can use the following command:
```bash
npm dev
```
### TODO:
- [ ] add rating input for the user.
- [ ] save user data in the database.
- [x] make `/find` page only accessible for authenticated users.
- [x] create login.
- [~] add wishlist page. 
