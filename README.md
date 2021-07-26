# Recipe_task.js

A web application that gives a list of recipe categories and then dynamically generates matching recipes based on the category clicked. The application makes fetch requests to the included JSON files to generate the recipe information. You can change the serving sizes/quantities of the recipes by clicking the respective buttons at the bottom of the recipe page. All quantities are displayed in fractions.

## Potential Future Features

- Use "fs" from node.js to map over the contents of the data folder so any new JSON files are automatically added to the project.

- Dynamically display the category headings. Async/await doesn't work with the built in forEach in this application so a custom for loop would need to be built.


## Deployment

Deployed with [github pages](https://pages.github.com/).

## Get started

No dependencies - to run locally, open the project directory with VSCode. Install the [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) (if you haven't already) and click "Go Live" in the blue bar at the bottom of the screen. This will open a live development server in your browser that updates in response to code changes.
