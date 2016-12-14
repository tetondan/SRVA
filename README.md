# SRVA
A custom survey/poll creator.  

##Features
Full cutomization of survey and questions. Ability to create public or private surveys/polls. Every poll given a custom URL. Poll creator may choose users to be registered or not in order to participate. 

##Tech
Backend build with NodeJS/Express utilizing a PostgreSQL database. 

Frontend build with Reat/Redux.

##Requirements
Node v6.9.1^

PostgreSQL 9.5.0^

##API

*__"/create/user"__ 
⋅⋅* POST: requires a JSON object sent {"username": [username], "email": [email], "password": [password]}
