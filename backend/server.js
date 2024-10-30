require('dotenv').config();
const express = require('express');
const multer = require('multer');
const axios = require('axios');
const cors = require('cors');
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');
const pdfParse = require('pdf-parse')
const pdf = require('pdf-poppler');

const OpenAI = require('openai');
const { type } = require('os');



const app = express();
app.use(cors({
    origin: ['https://gajma-ocr.vercel.app', 'http://localhost:5000'],
    methods: ['GET','HEAD', 'PUT' , 'PATCH', 'POST' , 'DELETE'],
    credentials: true 
}));
app.use(express.json());

const upload = multer({dest: 'uploads/'});

const openai  = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

async function createAssistant(imagePath) {

    if(!imagePath){
        throw new Error('Image path is undefined')
    }

    const base64Image = fs.readFileSync(imagePath, {
        encoding: "base64",
    })

    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages:[
            {
                role:"user",
                content: [
                    {
                        type: "text",
                        text: `
        Extract all possible data from the invoice image and structure it in the following JSON format:
        {
          "templateData": {
            "name": "<licensee_name>",
            "invoiceNo": "<invoice_number>",
            "date": "<date>",
            "dueDate": "<due_date>",
            "billTo": "<bill_to>",
            "total": "<total>",
            "bankAccount": "<bank_account>",
            "bankName": "<bank_name>"
          },
          "allData": [
            // Include all data extracted from the invoice here in JSON format
          ]
        }
        Respond with only the JSON structure.
        `,
         },
                    {
                        type: "image_url",
                        image_url: {
                            url: `data:image/png;base64,${base64Image}`,
                        },
                    }
                ]
            },
        ],
        max_tokens: 1000,
    })
    
   
let responseText = response.choices[0].message.content
console.log("Raw Response from OPENAI: ", responseText )

//Extract JSON-like content using regular expression
const jsonMatch = responseText.match(/{[\s\S]*}/);
if(!jsonMatch) {
    throw new Error("Invalid JSON response from OPENAI");
}

const jsonString = jsonMatch[0];

  try {
    const parsedResponse = JSON.parse(jsonString);
    return parsedResponse;
  } catch (error) {
    console.error("Failed to parse JSON:", error);
    throw new Error("Failed to parse JSON from OpenAI response");
  }
}

async function convertPdfToImage(filePath) {
    const outputDir = path.dirname(filePath);
    const outputFilePath = path.join(outputDir, `${path.basename(filePath, path.extname(filePath))}-1.png`);

    const options = {
        format: 'png',
        out_dir: outputDir,
        out_prefix: path.basename(filePath, path.extname(filePath)),
        page: 1,  // Only convert the first page
    };

    try {
        await pdf.convert(filePath, options);
        
        // Verify if the image exists
        if (fs.existsSync(outputFilePath)) {
            console.log(`Image created at: ${outputFilePath}`);
            return outputFilePath;
        } else {
            throw new Error(`Image conversion failed. Expected file not found: ${outputFilePath}`);
        }
    } catch (error) {
        console.error("PDF to image conversion error:", error);
        throw error;
    }
}

app.post('/extract', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    console.log('Uploaded file:', req.file);

    let imagePath = req.file.path;

    try {

        if(req.file.mimetype === 'application/pdf'){
            imagePath = await convertPdfToImage(req.file.path)
        }

        const extractedJson = await createAssistant(imagePath)
        console.log('Extracted JSON:', extractedJson);
        res.json(extractedJson);
    } catch (error) {
        console.error('Error during extraction:', error);
        res.status(500).send('Failed to extract data.');
    } finally {
        // Clean up the uploaded file after processing
        fs.unlink(req.file.path, (err) => {
            if (err) console.error('Error deleting file:', err);
        });
        if (req.file.mimetype === 'application/pdf') {
            fs.unlink(imagePath, (err) => {
                if (err) console.error('Error deleting converted image:', err);
            });
        }
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('Server running on http://localhost:5000');
  
});
