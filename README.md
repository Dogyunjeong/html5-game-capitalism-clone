# Capitalism html5 game clone

## Structure

- Separate web and server folder.

### WEB

1. Choose plain js and html to build game. Instead of using any framework.
  - Why no framework: This is my first game developing and `Capitalism` seems has quite few animations. So I feel it doesn't necessary to consider performance of canvas. And I could progressively adopt canvas in rendering. And as it is 9 to 16 hours time limited project, learning new framework and debugging in new environments are burden for me.
2. Choose TS to prevent small mistakes.
3. How to store data
  - store in localStorage.
  - Due to storing data in local storage. Rely on browser based data on producing amount
4. almost 10hrs. Decide to tidy up web code. instead of developing server.
  As I spend around 10 hrs now, Decide to tidy up web code.
  - Capitalism seems not for multi playing. So verifying producing amount with checking server data wouldn't be benefit.
  - Cheating wouldn't be a matter for other users.


### Things to improve in future

1. Implementing server with user login process
  - User can access game at any browser with its own login data.
2. Better images and animations
  - It has basic layouts currently. If adopt nice design, It would become more enjoyable game
4. Some other features
  e.g
  - different stage as original capitalism game.
