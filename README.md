## Getting Started Guide

### Pre-requiste
- [NodeJS](https://nodejs.org/en/)
- npm or yarn 

### Run
Open your terminal and run `yarn start` to open and play with our toy robot. 

### Tests
Run `yarn test` to run all the tests.

### Instructions
- Robot can be given a sequence of single command or a `txt` file containing multiple command in each new line.
- Following are the valid list of commands our robot can understand: 
    - PLACE X,Y,F   (where X, Y are the position on the tabletop, and F is the direction)
    - MOVE (will move the Robot by one unit in the current direction)
    - LEFT (will rotate the robot by 90 deg. anti-clockwise)
    - RIGHT (will rotate the robot by 90 deg. clockwise)
    - REPORT (will output the robot location on the table)



