// Dependencies

const core = require('@actions/core');
const github = require('@actions/github');
const fetch = require('node-fetch');

// Inputs

const username = core.getInput('username')
const password = core.getInput('token')
const projectKey = core.getInput('project-key')
const issueType = core.getInput('issue-type')
const content = core.getInput('issue-description')

// Create Issue Based on Action Inputs

const createJiraIssue = () => {

    const date = new Date();
    const time = date.getDate()+'-'+(date.getMonth()+1)+'-'+date.getFullYear();

    // Body Data
    const bodyData = `{
        "update": {},
        "fields": {
            "summary": "Test Jira Nightly ${time}",
            "issuetype": {
                "name": "${issueType}"
            },
        "project": {
            "key": "${projectKey}"
        },
        "description": {
            "type": "doc",
            "version": 1,
            "content": [
                {
                "type": "paragraph",
                "content": [
                    {
                    "text": "${content}",
                    "type": "text"
                    }
                ]
                }
            ]
        }
    }}`;

    try {
        fetch('https://fintechos.atlassian.net/rest/api/3/issue', {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${Buffer.from(
                    `${username}:${password}`
            ).toString('base64')}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: bodyData
        })
            .then(response => {
                console.log(`Response: ${response.status} ${response.statusText}`);
                return response.text();
            })
            .then(text => {
                let jsonResult = JSON.parse(text)
                console.log(jsonResult)
                // Setting The output -> Issue ID
                core.setOutput("created-issue-id", jsonResult['id']);
            })
            .catch(err => console.error(err));
    } 
    catch (error) {
        core.setFailed(error.message);
    }   
}

createJiraIssue()
