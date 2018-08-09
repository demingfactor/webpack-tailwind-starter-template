## Getting started

1. Clone this repository locally into your new project (eg. myproject)

    $ git clone https://github.com/demingfactor/webpack-tailwind-starter-template yourproject

    $ cd yourproject

2. Add templates as a remote and clear it from origin

    $ git remote add template git@github.com:demingfactor/webpack-tailwind-starter-template.git

    $ git remote rm origin

3. Create your project on github and follow their instructions to setup your new origin.

  Visit github.com > New Project > create a new repository
  
    $ git remote add <..per github new project instructions>

4. Update package.json "name" to match your new repository name and commit

5. Install NPM packages

    $ npm install
    
6. Clone index.html.example for local use

So that your index.html is never updated accidently from a push in the Template.
We get you to copy the example file.
If new code is later added in the example file in master you can look in the file and copy enhancements across yourself.

    $ cp src/index.html.example index.html

6. Run Start to start the project in Development mode

    $ npm run start

## Updating from the template

To update your repository from the template.

$ git pull template master

## Updating NPM and all the things

If you're running ASDF we've included .tool-versions to make your life easier.
If 'npm run build' is not running you probably need to update ASDF like so:

    $ asdf plugin-update --all && asdf update && npm i npm















