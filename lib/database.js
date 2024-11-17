const fetch = require('node-fetch');
const axios = require('axios');
const config = require('../config')

// Replace these with your GitHub credentials
const userName = config.USER_NAME
const token = config.TOKEN
const repoName = config.REPO_NAME

// Function to fetch data from GitHub API
async function githubApiRequest(url, method = 'GET', data = {}) {
  try {
    const options = {
      method,
      headers: {
        Authorization: `Basic ${Buffer.from(`${userName}:${token}`).toString('base64')}`,
        'Content-Type': 'application/json',
      },
    };

    if (method === 'GET' || method === 'HEAD') {
      // Remove the body property for GET and HEAD requests
      delete options.body;
    } else {
      // For other methods (POST, PUT, DELETE, etc.), add the JSON.stringify data to the request body
      options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);

    return await response.json();
  } catch (error) {
    throw new Error(`GitHub API request failed: ${error.message}`);
  }
}

async function checkRepoAvailability() {
  try {
    const apiUrl = `https://api.github.com/repos/${userName}/${repoName}`;
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await axios.get(apiUrl, { headers });

    if (response.status === 200) {
      return true
    } else {
     return false
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return false
    } else {
      console.error('Error:', error.message);
    }
  }
}

async function githubSearchFile(filePath, fileName = null) {
  const url = `https://api.github.com/repos/${userName}/${repoName}/contents/${filePath}?ref=main`;
  const data = await githubApiRequest(url);

  // Check if the data is an array or object
  if (Array.isArray(data)) {
    // If data is an array, we are listing the contents of a directory
    return fileName ? data.find((file) => file.name === fileName) : data;
  } else if (data && typeof data === 'object' && data.name) {
    // If data is an object, we are accessing a single file directly
    return data;
  } else {
    throw new Error(`Unexpected response format: ${JSON.stringify(data)}`);
  }
}
// 2. Function to create a new GitHub file
async function githubCreateNewFile(filePath, content) {
  if (typeof content !== 'string') {
    throw new Error(`Content for ${filePath} must be a string.`);
  }
  
  try {
    const url = `https://api.github.com/repos/${userName}/${repoName}/contents/${filePath}`;
    const data = {
      message: `Create new file: ${filePath}`,
      content: Buffer.from(content).toString('base64'),
    };
    return await githubApiRequest(url, 'PUT', data);
  } catch (error) {
    console.error(`Failed to create file ${filePath}: ${error.message}`);
    throw error;
  }
}
// NEW FUNCTION: Upload Buffer to GitHub
async function uploadBufferToGitHub(fileName, fileBuffer) {
  try {
    const content = fileBuffer.toString('base64');
    const url = `https://api.github.com/repos/${userName}/${repoName}/contents/${fileName}`;
    const data = {
      message: `Upload ${fileName}`,
      content: content,
      branch: 'main',  // You can specify a different branch if needed
    };

    const response = await axios.put(
      url,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );

    console.log('Buffer uploaded successfully:', response.data.content.html_url);
  } catch (error) {
    console.error('Error uploading buffer:', error.response ? error.response.data : error.message);
  }
}

async function DeletePaper(filePath) {
  const file = await githubSearchFile(filePath);
  if (!file) throw new Error('File not found on GitHub.');
  
  const url = `https://api.github.com/repos/${userName}/${repoName}/contents/${filePath}`;
  const data = {
    message: `Delete file: ${fileName}`,
    sha: file.sha,
  };
  await githubApiRequest(url, 'DELETE', data);
}


// 3. Function to delete a GitHub file
async function githubDeleteFile(filePath, fileName) {
  const file = await githubSearchFile(filePath, fileName);
  if (!file) throw new Error('File not found on GitHub.');
  
  const url = `https://api.github.com/repos/${userName}/${repoName}/contents/${filePath}/${fileName}`;
  const data = {
    message: `Delete file: ${fileName}`,
    sha: file.sha,
  };
  await githubApiRequest(url, 'DELETE', data);
}

// 4. Function to get GitHub file content
async function githubCreateNewFile(filePath, content) {
  const url = `https://api.github.com/repos/${userName}/${repoName}/contents/${filePath}`;
  const data = {
    message: `Create new file: ${filePath}`,
    content: Buffer.from(content).toString('base64'),
  };
  return await githubApiRequest(url, 'PUT', data);
}

async function githubClearAndWriteFile(filePath, content) {
  const file = await githubSearchFile(filePath);
  const url = `https://api.github.com/repos/${userName}/${repoName}/contents/${filePath}`;
  const data = {
    message: `Update file: ${filePath}`,
    content: Buffer.from(content).toString('base64'),
    sha: file.sha,
  };
  return await githubApiRequest(url, 'PUT', data);
}

async function githubGetFileContent(filePath) {
  const file = await githubSearchFile(filePath);
  const url = file.download_url;
  const response = await fetch(url);
  return await response.text();
}

// 6. Function to delete an existing GitHub file and upload a new one
async function githubDeleteAndUploadFile(fileName, newContent) {
  await githubDeleteFile(fileName);
  await githubCreateNewFile(fileName, newContent);
}

//========================================
async function updateCMDStore(MsgID , CmdID) {
try { 
let olds = JSON.parse(await githubGetFileContent("Non-Btn",'data.json'))
olds.push({[MsgID]:CmdID})
var add = await githubClearAndWriteFile('Non-Btn','data.json',JSON.stringify(olds, null, 2))
return true
} catch (e) {
console.log( e)
return false
}
}

async function isbtnID(MsgID){
try{
let olds = JSON.parse(await githubGetFileContent("Non-Btn",'data.json'))
let foundData = null;
for (const item of olds) {
  if (item[MsgID]) {
    foundData = item[MsgID];
    break;
  }
}
if(foundData) return true
else return false
} catch(e){
return false
}
}

async function getCMDStore(MsgID) {
try { 
let olds = JSON.parse(await githubGetFileContent("Non-Btn",'data.json'))
let foundData = null;
for (const item of olds) {
  if (item[MsgID]) {
    foundData = item[MsgID];
    break;
  }
}
return foundData
} catch (e) {
console.log( e)
return false
}
} 

function getCmdForCmdId(CMD_ID_MAP, cmdId) {
  const result = CMD_ID_MAP.find((entry) => entry.cmdId === cmdId);
  return result ? result.cmd : null;
}

function getFileNamesAndPaths(fileList) {
  return fileList.map(file => {
      const fileNameWithoutExtension = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
      return {
          name: fileNameWithoutExtension,
          path: file.path
      };
  });

}

async function GetPaper(filePath) {
  const usrl = `https://api.github.com/repos/${userName}/${repoName}/contents/${filePath}?ref=main`;
  const data = await githubApiRequest(usrl);
  const url = data.download_url;
  return url
}
async function searchfile(params) {
  const url = `https://api.github.com/repos/${userName}/${repoName}/contents/${params}?ref=main`;
  const data = await githubApiRequest(url);
  return (await getFileNamesAndPaths(data))
}

async function connectdb() {
  const files = [
    { path: "tnews1.json", defaultContent: JSON.stringify([]) },
    { path: "tnews2.json", defaultContent: JSON.stringify([]) },
    { path: "tnews3.json", defaultContent: JSON.stringify([]) },
  ];

  for (const file of files) {
    try {
      // Check if the file exists by trying to fetch its content
      await githubGetFileContent(file.path);
      console.log(`File "${file.path}" exists 🛢️`);
    } catch (e) {
      // If the file doesn't exist, create it with default content
      console.log(`File "${file.path}" does not exist. Creating...`);
      await githubCreateNewFile(file.path, file.defaultContent);
      console.log(`File "${file.path}" created successfully 🛢️`);
    }
  }
}
async function input(setting, data) {
  let filePath;
  
  if (setting === "TNEWS1") {
    filePath = "tnews1.json";
  } else if (setting === "TNEWS2") {
    filePath = "tnews2.json";
  } else if (setting === "TNEWS3") {  
    filePath = "tnews3.json";
  }

  let existingData = [];
  try {
    existingData = JSON.parse(await githubGetFileContent(filePath));
  } catch (e) {
    console.log("File not found or is empty, creating a new one.");
  }

  existingData.push(data);
  if (setting === "TNEWS1") {
    config.TNEWS1 = existingData
  } else if (setting === "TNEWS2") {
    config.TNEWS2 = existingData
  } else if (setting === "TNEWS3") {
    config.TNEWS3 = existingData
  }

  await githubClearAndWriteFile(filePath, JSON.stringify(existingData));
}

// Function to retrieve data from different files
async function get(setting) {
  let filePath;
  
  if (setting === "TNEWS1") {
    filePath = "tnews1.json";
  } else if (setting === "TNEWS2") {
    filePath = "tnews2.json";
  } else if (setting === "TNEWS3") {
    filePath = "tnews3.json";
  }

  try {
    const data = await githubGetFileContent(filePath);
    return JSON.parse(data);
  } catch (e) {
    console.log("Error reading file:", e.message);
    return [];
  }
}

async function updb() {
  try {
    // Fetch data from hiru.json and sporty.json
    const TNEWS1 = JSON.parse(await githubGetFileContent("tnews1.json"));
    const TNEWS2 = JSON.parse(await githubGetFileContent("tnews2.json"));
    const TNEWS3 = JSON.parse(await githubGetFileContent("tnews3.json"));
    // Update the config object with the data from both files
    config.TNEWS1 = TNEWS1;
    config.TNEWS2 = TNEWS2;
    config.TNEWS3 = TNEWS3;

    console.log("Database updated successfully ✅");
  } catch (e) {
    console.error("Error updating database:", e.message);
  }
}


module.exports = { 
  updateCMDStore, 
  isbtnID, 
  getCMDStore, 
  getCmdForCmdId, 
  updb,
  connectdb, 
  searchfile, 
  GetPaper, 
  githubCreateNewFile, 
  DeletePaper,
  get,
  input,
  uploadBufferToGitHub // Export the new function
}