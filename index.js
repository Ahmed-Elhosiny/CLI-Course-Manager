#!usr/bin/env node
import { Command } from 'commander';
import inquirer from 'inquirer';

import fs from 'fs';

const program = new Command();

const filePath = './courses.json';
const q = [
  {
    type: 'input',
    name: 'title',
    message: 'Please enter course title',
  },
  {
    type: 'number',
    name: 'price',
    message: 'Please enter course price',
  },
];
program
  .name('Courses-manager')
  .description('CLI to make courses')
  .version('1.0.0');

program
  .command('add')
  .alias('a')
  .description('Add a course')
  .action(() => {
    inquirer.prompt(q).then((course) => {
      if (fs.existsSync(filePath)) {
        fs.readFile(filePath, 'utf8', (err, data) => {
          if (err) {
            console.log(`Error ${err}`);
            process.exit();
          }
          const courses = JSON.parse(data);
          courses.push(course);
          fs.writeFile(filePath, JSON.stringify(courses), 'utf8', (err) => {
            if (err) {
              console.log(`Can not write to file ${err} 💥`);
              process.exit();
            }
            console.log(`Course has been added 😊`);
          });
        });
      } else {
        fs.writeFile(filePath, JSON.stringify([course]), 'utf8', (err) => {
          if (err) {
            console.log(`Can not write to file ${err} 💥`);
            process.exit();
          }
          console.log(`Your first Course has been added 👏😊`);
        });
      }
    });
  });

program
  .command('list')
  .alias('l')
  .description('list all courses')
  .action(() => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.log(`Error -> ${err}`);
        process.exit();
      }
      const parsedData = JSON.parse(data);

      // Try to make (index) in table starts from 1 :(
      // const adjustedData = parsedData.map((item, index) => {
      //   return { index: index + 1, ...item };
      // });
      console.table(parsedData);
    });
  });
program.parse(process.argv);
