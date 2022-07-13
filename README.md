**General Assembly**
A Full Stack project as a team of four with a 1 week deadline.

**Best In The Game**

The final project on the SEI course. I had 1 week to create a Full Stack app, the backend was built with Django and Python, the frontend was React.js

With the landing page being a compilation of some of the best basketball plays that has taken place in the NBA.

<img width="1511" alt="Screenshot 2022-06-21 at 13 28 19" src="https://user-images.githubusercontent.com/73545574/175279438-27ecc878-bb65-46d4-bd8b-77ba12c32e9c.png">

**Brief:**

**1.** Build a full-stack application - by making your own backend and your own frontend.

**2.** Use a Python Django API using Django REST Framework to serve your data from an SQL database.

**3.** Consume your API with a separate frontend built with React.

**4.** Create a MERN app & ensure there is CRUD functionality.

**5.** Implement thoughtful user stories/wireframes that are significant enough to help you know which features are core MVP and which you can cut.

**6.** Have a visually impressive design.

**7.** Be deployed online so it's publicly accessible.

**Built With:**

**Frontend:**

**1.** React.js

**2.** JSX

**3.** CSS and Sass

**4.** React BootStrap

**5.** Axios

**Backend:**
<!-- Python -->
<!-- Django -->

<!-- Dev Tools-->
 
**1.** Git

**2.** GitHub

**3.** VScode

**4.** Insomnia

**5.** TablePlus

**Deployment:**
The app is deployed on ....and can be found here.

**Process:**

For this one week project we worked solo on our project, so I wanted to create a website that displayed some of the best Players in the NBA as I am a massive basketball fanatic. I thought what could go wrong?!. I created an ERD diagram and used this to visually display our model relationships in the backend.

I also created a virtual whiteboard using Excalidraw, this enables me to create the visuals on how I would like the page to look, adding notes, endpoints, and how each page will look.

<img width="1223" alt="Screenshot 2022-06-21 at 13 36 38" src="https://user-images.githubusercontent.com/73545574/175280271-ecf042b8-64c3-476b-b22a-3052d0ec075d.png">

<img width="1234" alt="Screenshot 2022-06-21 at 13 43 53" src="https://user-images.githubusercontent.com/73545574/175280325-a25616e0-c0b3-4268-9158-c11d9d404071.png">

**Backend:**

Covering the backend first, I wanted to create the registerView, login view and also the Authentication.

<img width="596" alt="Screenshot 2022-06-21 at 13 47 04" src="https://user-images.githubusercontent.com/73545574/175280405-ca439291-da8b-4af5-905d-ab5314a17362.png">

<img width="366" alt="Screenshot 2022-06-21 at 13 48 15" src="https://user-images.githubusercontent.com/73545574/175280442-7edfdedf-9ef3-4f0e-97af-7225b0e920d4.png">

I also spent some time adding dummy data to our seeds, this is so when you click onto the site there are plenty of basketballers that the user can see, which was vital for me to do as it gave the site a real genuine feel.

**Example:**

Below I wanted to try and create as much information on the player as possible. I created whether or not the player is still active in the NBA so once you click onto the player you would get a deeper insight into the player being their age and description.
I spent time adding in dummy data to our seeds, this is so when you click onto the site there are plenty of players already on show which gives the website a real genuine feel. Example:


<img width="513" alt="Screenshot 2022-07-13 at 14 13 27" src="https://user-images.githubusercontent.com/73545574/178742010-e232180e-ddc0-4863-88ed-4fac2f3b96bc.png">


<img width="875" alt="Screenshot 2022-06-21 at 13 50 11" src="https://user-images.githubusercontent.com/73545574/175280545-0a476838-8f5a-40da-83a5-c504e8051780.png">

**Frontend:**

Once the backend was completed and working within insomnia, I linked it to the frontend and started building. Again, this was a daunting task and quite exciting as I really wanted the final product to be quite impressive but at the same time I had to be quite realistic as this was my first time creating a full stack site.
I wanted to try and make the site as responsive as possible on all screen sizes, which I was not too sure how I would achieve, but I knew that Google would be my best friend for a task like this. For the frontend, I focused on creating the Navbar, set out the routes within the App.js file, and also made sure that i created the HomePage first, I thought of cloning the NBA website but once I gave it deep thought I wanted to create the website in my own way.

 
Here is a snippet to show  the conditional formatting, checking to see if the user is logged in.

<img width="524" alt="Screenshot 2022-06-21 at 13 57 08" src="https://user-images.githubusercontent.com/73545574/175280689-38e5a805-d7e3-44af-a8fa-0ec2d809df40.png">

**Regsiter/Login:**

<img width="514" alt="Screenshot 2022-06-21 at 13 58 29" src="https://user-images.githubusercontent.com/73545574/175280747-7ca1e896-fa69-41d3-a60c-b793d874da86.png">

**Commenting on favorite players:**
 
I wanted to allow the users that have registered to only be able to leave comments and delete comments that they have created under the players cards, which appears on the bottom of the page of every player, so ultimately the user has come across a player that they really like they can essentially add a comment on the basketball players page, which I also incorporated the error handling to understand if it doesn't why that also is.

<img width="518" alt="Screenshot 2022-07-13 at 14 06 58" src="https://user-images.githubusercontent.com/73545574/178740687-8b8626e3-14a2-4e90-8315-8f066b0b022c.png">


<img width="1111" alt="Screenshot 2022-07-13 at 14 06 24" src="https://user-images.githubusercontent.com/73545574/178740601-c68b7cb1-f1f5-475b-aa17-0976805f0fa8.png">

 <img width="287" alt="Screenshot 2022-06-21 at 14 02 46" src="https://user-images.githubusercontent.com/73545574/175280896-96419496-dc3e-4df4-9bbb-796ba698e3c8.png">
 
 <img width="375" alt="Screenshot 2022-06-21 at 14 02 55" src="https://user-images.githubusercontent.com/73545574/175280928-6a36aa00-31d4-42b5-ba57-70afb7337ce7.png">
 
**Challenges:**
 
**1.** My first challenge was allowing the user to register and then not having to log in again - which I never managed to overcome due to the deadline fast approaching, which left me quite puzzled. - That is something that I am looking to rectify in the near future.  

**2.** Working with reactBootstrap for the first time on my own, I got off to a slow start which I struggled with for a little time. However, after taking a break and creating a map of what I want to achieve and just playing around with it, I managed to get it to work with the way I envisioned it to look to a certain extent. 

**3.** My main challenges were enabling the user to delete their comments. 

**Bugs:**
 
**1.** The authenticated user is unable to delete their comment which i was working on for sometime but for the love of me I couldn't figure out how to sort it out, which is something that I would love to be able to fix in the future as comments can't be deleted on the frontend.

**2.** Once the user has registered they still need to login as opposed to already being logged in. 

**Future Improvements:**
 
**1.** Bug fixes.

**2.** Search functionality for players.

**3.** Filters for teams so you can search for the greatest players.

**4.** Now that I understand the different http error codes, I would like to make my own custom errors.

**5.** Creating a filter that enables the user to filter who is retired and players by teams they have played for.

**Wins & Key Learnings:**
 
**1.** This project reinforced my understanding of axios and django like no other project. I think being in control from start to finish enabled me to understand why I would use certain elements and what happens if it is used incorrectly.

**2.** Stepping away and taking a break is sometimes the perfect remedy to overcoming a block, as many of the time I would find myself glued to my desk completely puzzling myself.

**3.**  Really pleased with how clean the app looks, as I was quite skeptical in the beginning as I thought maybe I may have bit off more than I can chew.





