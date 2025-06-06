const puppeteer = require('puppeteer');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const express = require('express');
const cors = require('cors');

const app = express();


const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

const multer = require('multer')
const fs = require('fs');
const pdfparse = require('pdf-parse');


const puppeteerExtra = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteerExtra.use(StealthPlugin())


const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://abhinavgore1326:Abhinav%401326@job-portal-automation.kmjkm.mongodb.net/?retryWrites=true&w=majority&appName=job-portal-automation');
const User = require('./userModel');

const uri = "mongodb+srv://abhinavgore1326:Abhinav%401326@job-portal-automation.kmjkm.mongodb.net/?retryWrites=true&w=majority&appName=job-portal-automation";
const { MongoClient, ServerApiVersion } = require('mongodb');
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {


        await client.connect();
        const postCollection = client.db("database").collection("posts"); // this collection is for team-ekt
        const userCollection = client.db("database").collection("users");

        app.get('/user', async (req, res) => {
            const user = await userCollection.find().toArray();
            res.send(user);
        })
        app.get('/loggedInUser', async (req, res) => {
            const email = req.query.email;
            const user = await userCollection.find({ email: email }).toArray();
            res.send(user);
        })

        app.post('/register', async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user);
            res.send(result); 
        })


        app.get('/userPost', async (req, res) => {
            const email = req.query.email;
            const id = email;
            const post = (await postCollection.find({ id: id }).toArray()).reverse();
            // const posts = await postCollection.find({ id: id }).toArray();
            res.send(post);
        })
 



        // post
        const path = './files';

        fs.readdir(path, (err, files) => {
            if (err) throw err;

            for (const file of files) {
                fs.unlink(path + '/' + file, err => {
                    if (err) throw err;
                });
            }
        });


        const storage = multer.diskStorage({
            
            destination: function (_, _, cb) {
                cb(null, './files')
            },
            filename: function (_, file, cb) {
                const uniqueSuffix = Date.now();
                cb(null, uniqueSuffix + '-' + file.originalname);
            }
        })
        
        const upload = multer({ storage: storage })
        app.post('/internshipApply', upload.single("file"), async (req, _) => {
            
            const user = req.body;
            const id = user.id;
            const password = user.password;
            const resume = req.file;
            

            const resumeBuffer = fs.readFileSync(resume.path);
            pdfparse(resumeBuffer).then(function (data) {
                // console.log(data.text);
                const resumeText = data.text;
                // console.log(resumeText);
                // internshipApply(resumeText, id, password);
                naukriApply(resumeText, id, password, postCollection);
                // internshipApply(resumeText);
            }).catch(function (error) {
                console.error("Error parsing PDF:", error);
            });

        })
    } catch (error) {
        console.log(error);
    }
} run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello from Abhinav');
})

app.listen(port, () => {
    console.log(`Veronica is listening on port ${port}`);
})


async function naukriApply(resume, id, password, postCollection) {
    const browser = await puppeteerExtra.launch({
            headless: false,
            defaultViewport: null
        });
    
    const page = await browser.newPage();
    await page.goto('https://www.naukri.com/mnjuser/recommendedjobs?src=gnbOpportunities');
    // await page.type("#usernameField", "abhinavgore1326@gmail.com");
    // await page.type("#passwordField", "Abhinav@1326");
    await page.type("#usernameField", id);
    await page.type("#passwordField", password);
    await page.click(".blue-btn");
    
    try {
        await page.waitForNavigation({ waitUntil: "networkidle2" });
    } catch (error) {
        if (error.message.includes('Navigating frame was detached')) {
            console.log('Frame was detached, retrying navigation...');
            await page.goto('https://www.naukri.com/mnjuser/recommendedjobs?src=gnbOpportunities');
            // await page.type("#usernameField", "abhinavgore.sit.it@gmail.com");
            // await page.type("#passwordField", "Abhinav@1326");
            await page.type("#usernameField", id);
            await page.type("#passwordField", password);
            await page.click(".blue-btn");
            await page.waitForNavigation({ waitUntil: "networkidle2" });
        } else {
            throw error;
        }
    }
    
    
    
    
    await page.waitForSelector(".naukicon-ot-checkbox", {visible : true}); 
    
    await page.$$eval('.naukicon-ot-checkbox', (elements) => {
        elements.slice(0, 5).forEach(el => el.click());
    });
    
    // const jobData = await page.evaluate(() => {
    // const elements = Array.from(document.querySelectorAll('.info.dspIB'));
    // return elements.slice(0, 5).map(el => {
    //     const title = el.querySelector('p.title')?.textContent.trim() || '';
    //     const subtitle = el.querySelector('.subTitle')?.textContent.trim() || '';
    //     const location = el.querySelector('li.location span')?.textContent.trim() || '';
    //     return { title, subtitle, location };
    // });
    // });
    
    const jobData = await page.evaluate((id) => {
        // Get all job cards
        const jobCards = Array.from(document.querySelectorAll('article.jobTuple.bgWhite.z-depth-1'));
    
        const filteredJobs = jobCards.filter(card =>
          card.querySelector('.dspIB.saveJobContainer.tuple-check-box > i.dspIB.naukicon.naukicon-ot-Checked')
        ).slice(0, 5); // Take only the first 5 matching elements
    
        return filteredJobs.map(card => {
          const title = card.querySelector('.title.ellipsis.typ-16Bold')?.innerText.trim() || '';
          const subtitle = card.querySelector('.companyWrapper .subTitle')?.innerText.trim() || '';
          const location = card.querySelector('.placeHolderLi.location span')?.innerText.trim() || '';
          return { title, subtitle, location, id };
        });
      }, id);
    
    console.log(jobData);
    
    // await page.click(".multi-apply-button");
    console.log("Clicked on multi-apply button");

    
    if (postCollection) {
        if (jobData.length > 0) {
            await postCollection.insertMany(jobData);
        }
    }
    
    // await page.waitForNavigation({ waitUntil: "networkidle2" });
    await browser.close();
}
 

async function internshipApply(resume, id, password) {
    

    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null
    });


    const page = await browser.newPage();
    await page.goto('https://internshala.com/');
    await page.waitForSelector("#modal_login_submit");
    await page.click(".login-cta");
    await page.type("#modal_email", "abhinavgore.sit.it@gmail.com");
    // await page.type("#modal_password", "Abhinav@1326");
    // await page.type("#modal_email", id);
    // await page.type("#modal_password", password);
    // await page.click("#modal_login_submit");
 
    try {
        await page.waitForNavigation({ waitUntil: "networkidle2" });
    } catch (error) {
        if (error.message.includes('Navigating frame was detached')) {
            console.log('Frame was detached, retrying navigation...');
            await page.goto('https://internshala.com/');
            await page.waitForSelector("#modal_login_submit");
            await page.click(".login-cta"); 
            // await page.type("#modal_email", id);
            // await page.type("#modal_password", password);
            // await page.click("#modal_login_submit");
            await page.waitForNavigation({ waitUntil: "networkidle2" });
        } else {
            throw error;
        }
    }

    // await page.waitForNavigation({ waitUntil: "networkidle2" });
    await page.click(".internship_link");


    await page.waitForNavigation({ waitUntil: "networkidle2" });

    // await page.click(".filterUiContainer");
    // await page.click("#internship_list_container_1 .view_detail_button");

    // await page.waitForNavigation({waitUntil : "networkidle2"});

    await page.waitForSelector("#internship_list_container_1 .job-title-href", { visible: true });
    let details = await page.$$("#internship_list_container_1 .job-title-href");
    let detailUrl = [];
    for (let i = 0; i < 3; i++) {
        let url = await page.evaluate(function (ele) {
            return ele.getAttribute("href");
        }, details[i]);
        detailUrl.push(url);
    }

    for (let i of detailUrl) {
        await apply(i);
        await new Promise(function (resolve, _) {
            return setTimeout(resolve, 1000);
        });
    }

    async function applytojob() {
        await page.click("#apply_now_button");
        await page.waitForNavigation({ waitUntil: "networkidle2" });
        console.log("hello");
        await page.click("#layout_table button");
        await page.waitForNavigation({ waitUntil: "networkidle2" });
        // await page.click(".copyCoverLetterTitle");
        // await page.click("#check");
        await page.click("#submit");

    }

    async function ResumeMatch(Job_description) {
        const genAI = new GoogleGenerativeAI('AIzaSyAwNPAOBHMiCLNS0_y948BEgssVGm2_cjg');
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        const prompt = "You are an skilled ATS (Applicant Tracking System) scanner with a deep understanding of data science and ATS functionality, your task is to evaluate the resume against the provided job description. give me the percentage of match if the resume matches the job description. output should be only one line giving the percentage";
        const result = await model.generateContent(prompt + "\n\n" + Job_description + "\n\n" + resume);
        percentage = parseInt(result.response.text(), 10);
        console.log(percentage);
        return percentage;
    }

    async function apply(url) {

        await page.goto("https://internshala.com" + url);
        const textFromFirstP = await page.$eval('.text-container', p => p.innerText);

        // console.log(textFromFirstP);
        const skills = await page.$eval('.round_tabs_container', span => span.innerText);
        // console.log(skills.join(', '));
        // console.log(skills);
        let Job_description = "\n Job Description: \n" + textFromFirstP + "\n Skills: \n" + skills;
        // console.log(Job_description)

        

        let percentage = await ResumeMatch(Job_description);

        if(percentage > 0){
            console.log("Resume matched with the Job Description");
            await User.create({
                email: id,
                jobdes: Job_description,
                resume: resume,
                percentage: percentage
            });
            // await applytojob(Job_description);
            const is_disabled3 = await page.evaluate(() => document.querySelector('.btn.btn-large') !== null);
            console.log(is_disabled3);
            if(is_disabled3){
                await page.evaluate(() => {
                    console.log("done");
                    document.querySelector('.btn.btn-large').disabled = false;
                });
            }
            await page.waitForSelector(".btn.btn-large", {visible : true});
            await page.click(".btn.btn-large");
            console.log("1st");
            // await page.waitForNavigation({ waitUntil: "networkidle2" });
            await new Promise(resolve => setTimeout(resolve, 10000));
            const is_disabled = await page.evaluate(() => document.querySelector('.proceed-btn') !== null);
            console.log(is_disabled);
            if(is_disabled){
                await page.evaluate(() => {
                    console.log("done")
                    document.querySelector('.proceed-btn').disabled = false;
                });
            }
            await page.waitForSelector(".proceed-btn", {visible : true});   
            await page.click('.proceed-btn');
            await page.waitForNavigation({ waitUntil: "networkidle2" });
            console.log("2st");

            // const formControlExists = await page.$(".form-control") !== null;
            // if (formControlExists) {
            //     await page.waitForSelector(".form-control", { visible: true });
            //     let ans = await page.$$(".form-control");

            //     console.log("3st");

            //     for (let i = 0; i < ans.length; i++) {
            //         if (i == 0) {
            //             await ans[i].type(data["hiringReason"]);
            //             await new Promise(function (resolve, _) {
            //                 return setTimeout(resolve, 1000);
            //             });
            //         } else if (i == 1) {
            //             await ans[i].type(data["availability"]);
            //             await new Promise(function (resolve, _) {
            //                 return setTimeout(resolve, 1000);
            //             });
            //         } else {
            //             await ans[i].type(data["rating"]);
            //             await new Promise(function (resolve, _) {
            //                 return setTimeout(resolve, 1000);
            //             });
            //         }
            //     }
            // }
            await new Promise(resolve => setTimeout(resolve, 5000));
            const is_disabled2 = await page.evaluate(() => document.querySelector('#submit') !== null);
            console.log(is_disabled2);
            if(is_disabled2){
                await page.evaluate(() => {
                    console.log("done")
                    document.querySelector('#submit').disabled = false;
                });
            }
            await page.waitForSelector("#submit", {visible : true});   
            await page.click('#submit');
        }
        await page.screenshot({ path: 'wiki.png' });


    }
    // console.log(detailUrl)




    await page.screenshot({ path: 'wiki.png' });
    await browser.close();
};
