# SRVA
A custom survey/poll creator.  

##Features
Full cutomization of survey and questions. Ability to create public or private surveys/polls. Every poll given a custom URL. Poll creator may choose users to be registered or not in order to participate. 

##Tech
Backend build with NodeJS/Express utilizing a PostgreSQL database. 

Frontend build with React/Redux.

##Requirements
Node v6.9.1^

PostgreSQL 9.5.0^

##API
All data must be sent (and will be received) in JSON format.

###Routes:

+ __"/create/user"__:
  + __POST__: creates unique user, accepts JSON object with format: 
    + ```javascript
          {"username": [String], 
    
          "email": [String], 
          
          "password": [String]}
      ```

+ __"/create/survey"__:
  + __POST__: creates new survery/poll accepts JSON object with format: 
    + ```javascript
          {"title": [String required], 
    
          "url": [String unique required], 
          
          "options": [Array of Strings required], 
          
          "private": [Number (1 or 0, defaults to 0)], 
          
          "createdBy": [Number (userid, defaults to 0, 'anonymous')]}
      ```
          
+ __"/create/comment"__:
  + __POST__: creates new comment on survery/poll, accepts JSON object with format:
    + ```javascript
          {"userid":[Number (valid user id) required], 
          
          "pollid":[Number (valid survery id) required], 
          
          "comment":[String required]}
      ```
    
+ __"/vote"__:
  + __POST__: creates new vote for survey, comment, or survery option. accepts JSON object with format (optionid, pollid, or commentid MUST be supplied):
    + ```javascript
          {"userid": [Number (valid user id)], 
          
          "optionid": [Number (valid option id)], 
          
          "commentid": [Number (valid comment id)], 
          
          "pollid": [Number (valid poll id)]}
      ```
    
+ __"/polls/[survey url]"__:
  + __GET__: retreives all poll info matching unique url, data will be sent in following JSON format:
    + ```javascript
         {"poll_id": [Number (unique poll id)],
          
          "title": [String],
  
          "url": [String],
  
          "private": [Number (1 == true, 0 == false)],
  
          "created_at": [Date],
 
          "created_by": [Number (unique user id, or 0 == anonymous)],
  
          "votes": [Number (of upvotes)],
 
          "options": [
             
             {"option": [String],
      
              "count": [Number of votes for this option]
             
             }, ...
          
          ]
    
         }
     ```
