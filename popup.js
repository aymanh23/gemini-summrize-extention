import { GoogleGenerativeAI } from "./@google/generative-ai/dist/index.mjs"; // Import the Gemini AI library

const API_KEY = 'AIzaSyCioN-lrxGdDj2ajYgK1vgsx6KV0pTZJ1I'; // Google API key

const genAI = new GoogleGenerativeAI(API_KEY); // Initialize the Gemini AI instance
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", temperature: 0.0 }); // Use Gemini model with specified settings

// Add event listener for the "Summarize" button
document.getElementById('summarize').addEventListener('click', async () => {
    const outputElement = document.getElementById('output');
    outputElement.innerText = 'Summarizing...'; // Show loading indicator

    // Get the active tab in the current window
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
        const tabId = tabs[0].id;

        // Inject script to get page text from the active tab
        chrome.scripting.executeScript({
            target: { tabId },
            function: () => document.body.innerText
        }, async (results) => {
            if (results && results[0]) {
                const pageText = results[0].result;

                // form prompt template probably here

                try {

                    // const prompt = `You are a blog summarizer. Here is the content of a web page: "${pageText}". Please extract the main points and summarize it for me.`;

                    const prompt = `
                        You are a blog summarizer. Here is the content of a web page: "${pageText}". 
                        Please follow this format and extract the relevant information:
                        
                        - *Title*: Extract the title of the page.
                        - *Author*: Identify the author of the page if available.
                        - *Key Points*: List the key points from the content.
                        - *Published Date*: Provide the date the content was published if available.
                        - *Summary*: Provide a concise summary of the main points from the page.
                        
                        Make sure the summary is clear and focuses on the key ideas presented in the content.
                        `;


                    // Generate summary using Gemini AI
                    const result = await model.generateContent(prompt);

                    // format output here

                    // Display the summary in the popup
                    document.getElementById('output').innerText = result.response.text();


                } catch (error) {
                    console.error('Gemini API error:', error); // Handle errors
                }
            } else {
                console.error('Failed to get page text'); // Handle failure to retrieve page content
            }
        });
    });
});
