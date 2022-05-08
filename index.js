const core = require('@actions/core');
const github = require('@actions/github');
const fetch = require('node-fetch');

const username = core.getInput('username')
const password = core.getInput('token')
const method = core.getInput('method-name')

const getIssueMetadata = () => {
    try {
        fetch('https://fintechos.atlassian.net/rest/api/3/issue/createmeta', {
    method: 'GET',
    headers: {
    'Authorization': `Basic ${Buffer.from(
        `${username}:${password}`
    ).toString('base64')}`,
    'Accept': 'application/json'
    }
})
    .then(response => {
        console.log(
            `Response: ${response.status} ${response.statusText}`
    );
        return response.text();
    })
    .then(text => {
        console.log(text)
    })
    .catch(err => console.error(err));


        // console.log(`Hello ${nameToGreet}!`);
        const time = (new Date()).toTimeString();
        core.setOutput("time", time);
      // Get the JSON webhook payload for the event that triggered the workflow
        const payload = JSON.stringify(github.context.payload, undefined, 2)
        console.log(`The event payload: ${payload}`);

    } 
    catch (error) {
        core.setFailed(error.message);
    } 
}

if ( method == 'metadata') {getIssueMetadata()}
