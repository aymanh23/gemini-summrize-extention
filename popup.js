console.log("Popup script is loaded");

import { GoogleGenerativeAI } from "./@google/generative-ai/dist/index.mjs"; // Use relative path to the module
// Import from local directory



const API_KEY = 'AIzaSyAb4uIHERA5ZyW1KZz2uj6b_pjzXGNY3Fw'; // Replace with your actual API key

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

document.getElementById('summarize').addEventListener('click', async () => {
    console.log('Summarize button clicked');

    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
        const tabId = tabs[0].id;
        console.log('Tab ID:', tabId);

        chrome.scripting.executeScript({
            target: { tabId },
            function: () => document.body.innerText
        }, async (results) => {
            if (results && results[0]) {
                const pageText = results[0].result;
                console.log('Page text:', pageText);

                try {
                    const result = await model.generateContent(pageText);
                    console.log('Gemini API Response:', result);
                    document.getElementById('output').innerText = result.response.text();
                } catch (error) {
                    console.error('Gemini API error:', error);
                }
            } else {
                console.error('Failed to get page text');
            }
        });
    });
});
