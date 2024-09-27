<div id="top"></div>

<!-- ABOUT THE PROJECT -->
## About The Project

3D Learning Hub is an educational platform where students can interact with 3D models to enhance their learning experiences.
</br>

<p align="right">(<a href="#top">back to top</a>)</p>

### Features

<ol>
<li> Interactive 3D model viewing </li>
<li> Category-based model selection </li>
<li> User rating and feedback collection </li>
<li>Server-side model compression and optimization </li>
</ol>


<!-- GETTING STARTED -->
## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

## Installation

1. Clone the repo
   ```sh
   git clone https://github.com/francescorizzello94/3d-learning-hub.git
   ```
2. Navigate intop the project directory
   ```
   cd 3d-learning-hub
   ```
3. Intall npm packages
   ```
   npm i
   ```
   
## Setup

1. Set up environment variables
   ```
   touch server/.env
   ```
2. Add the environment variable credentials contained in the PPTX to server/.env
   ```
   MONGODB_URI=[MONGODB_URI in PPTX]
   ```

## Run the app

1. Development
   ```
   npm run dev
   ```
2. Production
   ```
   npm run build
   npm run start
   ```
3. List of scripts in root package.json for individualized command execution
   [npm run][command]
   ```
   "compress-models": "node scripts/compressModels.js",
   "dev": "concurrently \"npm run dev:client\" \"npm run dev:server",
   "dev:client": "npm run compress-models && cd client && vite",
   "dev:server": "npm run compress-models && cd server && nodemon index.js",
   "build": "cd client && vite build",
   "start": "node server/index.js"
   ```
   
   

<p align="right">(<a href="#top">back to top</a>)</p>

